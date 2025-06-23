import { useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Application from "expo-application";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/constants/axios";
import environment from "@/constants/environment";

export default function usePushTokenSync() {
  const imeiRef = useRef<string | null>(null);

  useEffect(() => {
    async function registerAndSync() {
      // 0️⃣ Must be a physical device
      if (!Device.isDevice) {
        console.warn("Push notifications require a physical device");
        return;
      }

      const { status: existing } = await Notifications.getPermissionsAsync();
      console.log("Existing notification status:", existing); // should be 'undetermined', 'granted' or 'denied'
      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log("After requestPermissionsAsync:", status); // now you’ll see 'granted' or 'denied'
      }

      // 3️⃣ Read & persist the device identifier (IMEI / vendor ID)
      try {
        const id =
          Platform.OS === "android"
            ? await Application.getAndroidId()
            : await Application.getIosIdForVendorAsync();
        if (id) {
          imeiRef.current = id;
          await AsyncStorage.setItem("@deviceId", id);
        }
      } catch (err) {
        console.warn("Failed to get device ID:", err);
      }

      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      console.log("tokenResponse", tokenResponse);
      const token = tokenResponse.data;
      await AsyncStorage.setItem("@pushToken", token);

      // 5️⃣ Sync to your backend
      try {
        await axiosInstance.post(
          `${environment.API_URL}/fcm/sync-token`,
          { imei: imeiRef.current, token },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.warn("Failed to sync token:", err);
      }

      // 6️⃣ Android: create a default channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // 7️⃣ Listen for token rotations (they can happen!)
      const sub = Notifications.addPushTokenListener(async ({ data }) => {
        const newToken = data;
        await AsyncStorage.setItem("@pushToken", newToken);
        try {
          await axiosInstance.post(
            `${environment.API_URL}/fcm/sync-token`,
            { imei: imeiRef.current, token: newToken },
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (err) {
          console.warn("Failed to sync rotated token:", err);
        }
      });

      // cleanup
      return () => {
        sub.remove();
      };
    }

    registerAndSync();
  }, []);
}
