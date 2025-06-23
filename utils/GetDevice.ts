import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Application from "expo-application";
import { Platform } from "react-native";

export async function getDeviceIdentifiers(): Promise<{
  imei: string | null;
  pushToken: string | null;
}> {
  // 1) IMEI / vendor ID
  let imei: string | null = null;
  try {
    if (Device.isDevice) {
      if (Platform.OS === "android") {
        imei = Application.getAndroidId();
      } else {
        imei = await Application.getIosIdForVendorAsync();
      }
    }
  } catch {
    imei = null;
  }

  // 2) Expo push token (make sure permissions have been granted already)
  let pushToken: string | null = null;
  try {
    const tokenObj = await Notifications.getExpoPushTokenAsync();
    pushToken = tokenObj.data;
  } catch {
    pushToken = null;
  }

  return { imei, pushToken };
}
