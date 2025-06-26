import { useEffect, useRef } from "react";
import { Alert, Platform, PermissionsAndroid } from "react-native";
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

  useEffect(() => {
    let unsubscribeRefresh: (() => void) | null = null;

    async function registerAndSync() {
      if (!Device.isDevice) {
        console.warn("❌ Must use real device for push notifications");
        return;
      }

      const messagingInstance = getMessaging(getApp());

      // 🛡️ Android 13+: Request POST_NOTIFICATIONS permission
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("❌ Notification permission denied (Android 13+)");
          return;
        }
      }

      // 1️⃣ Request FCM permission
      const authStatus = await messagingInstance.requestPermission();
      if (
        authStatus !== AuthorizationStatus.AUTHORIZED &&
        authStatus !== AuthorizationStatus.PROVISIONAL
      ) {
        Alert.alert("Permission Denied", "Push notifications not enabled");
        return;
      }

      // 2️⃣ Get or fetch device ID (IMEI)
      let deviceId = await AsyncStorage.getItem("@deviceId");
      if (!deviceId) {
        try {
          deviceId =
            Platform.OS === "android"
              ? await Application.getAndroidId()
              : await Application.getIosIdForVendorAsync();
          if (deviceId) await AsyncStorage.setItem("@deviceId", deviceId);
        } catch (e) {
          console.warn("⚠️ Failed to fetch device ID:", e);
        }
      }
      imeiRef.current = deviceId;

      // 3️⃣ Get or refresh FCM token
      let fcmToken = await AsyncStorage.getItem("@fcmToken");
      try {
        fcmToken = await getToken(messagingInstance);
        if (fcmToken) {
          await AsyncStorage.setItem("@fcmToken", fcmToken);
        } else {
          console.warn("⚠️ getToken() returned null");
        }
      } catch (e) {
        console.warn("❌ Failed to get FCM token:", e);
      }

      // 4️⃣ Send to backend
      if (fcmToken && deviceId) {
        const payload = { imei: deviceId, token: fcmToken };
        try {
          await axiosInstance.post(
            `${environment.API_URL}/sync-token`,
            payload,
            { headers: { "Content-Type": "application/json" } }
          );
          // console.log("✅ Token synced:", payload);
        } catch (err: any) {
          console.warn(
            "❌ Token sync failed:",
            err.response?.status,
            err.response?.data || err.message
          );
        }
      }

      // 5️⃣ Token refresh
      unsubscribeRefresh = onTokenRefresh(
        messagingInstance,
        async (newToken) => {
          console.log("🔁 Token refreshed:", newToken);
          await AsyncStorage.setItem("@fcmToken", newToken);

          const refreshPayload = { imei: imeiRef.current, token: newToken };
          try {
            await axiosInstance.post(
              `${environment.API_URL}/sync-token`,
              refreshPayload,
              { headers: { "Content-Type": "application/json" } }
            );
            console.log("✅ Refreshed token synced");
          } catch (err: any) {
            console.warn(
              "❌ Refreshed sync failed:",
              err.response?.status,
              err.response?.data || err.message
            );
          }
        }
      );
    }

    registerAndSync();

    return () => {
      unsubscribeRefresh?.();
    };
  }, []);
}
