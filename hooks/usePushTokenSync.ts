import { useEffect, useRef } from "react";
import {
  Alert,
  Platform,
  AppState,
  AppStateStatus,
  PermissionsAndroid,
} from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as Application from "expo-application";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/constants/axios";
import environment from "@/constants/environment";

export default function usePushTokenSync() {
  const imeiRef = useRef<string | null>(null);
  const unsubscribeRefresh = useRef<(() => void) | null>(null);

  const registerAndSync = async () => {
    if (!Device.isDevice) {
      console.warn("❌ Must use a real device for push notifications");
      return;
    }

    const messaging = getMessaging(getApp());
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("❌ Notification permission denied");
        return;
      }
    }

    // 1️⃣ FCM permission
    const authStatus = await messaging.requestPermission();
    if (
      authStatus !== AuthorizationStatus.AUTHORIZED &&
      authStatus !== AuthorizationStatus.PROVISIONAL
    ) {
      Alert.alert("Permission Denied", "Push notifications not enabled");
      return;
    }

    // 2️⃣ Fetch & store IMEI / vendor ID once
    let deviceId = await AsyncStorage.getItem("@deviceId");
    if (!deviceId) {
      try {
        deviceId =
          Platform.OS === "android"
            ? await Application.getAndroidId()
            : await Application.getIosIdForVendorAsync();
        if (deviceId) {
          await AsyncStorage.setItem("@deviceId", deviceId);
        }
      } catch {
        console.warn("⚠️ Failed to fetch device ID");
      }
    }
    imeiRef.current = deviceId;

    // 3️⃣ Get & store FCM token
    let fcmToken = await AsyncStorage.getItem("@fcmToken");
    try {
      fcmToken = await getToken(messaging);
      if (fcmToken) {
        await AsyncStorage.setItem("@fcmToken", fcmToken);
      }
    } catch (e) {
      console.warn("❌ Failed to get FCM token:", e);
    }

    // 4️⃣ Sync to backend
    if (fcmToken && imeiRef.current) {
      const payload = { imei: imeiRef.current, token: fcmToken };
      // console.log("Syncing token on launch/resume:", payload);
      try {
        await axiosInstance.post(`${environment.API_URL}/sync-token`, payload);
      } catch (err: any) {
        console.warn(
          "❌ Token sync failed:",
          err.response?.data || err.message
        );
      }
    }

    // 5️⃣ Subscribe to token rotations
    unsubscribeRefresh.current = onTokenRefresh(messaging, async (newToken) => {
      console.log("🔁 Token refreshed:", newToken);
      await AsyncStorage.setItem("@fcmToken", newToken);
      if (imeiRef.current) {
        await axiosInstance.post(`${environment.API_URL}/sync-token`, {
          imei: imeiRef.current,
          token: newToken,
        });
      }
    });

    // 6️⃣ Android channel
    if (Platform.OS === "android") {
      await messaging.setAutoInitEnabled(true);
    }
  };

  useEffect(() => {
    // initial registration
    registerAndSync();

    // re‑register on app resume
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active") {
        registerAndSync();
      }
    });

    return () => {
      sub.remove();
      unsubscribeRefresh.current?.();
    };
  }, []);
}
