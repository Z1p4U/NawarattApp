import environment from "@/constants/environment";
import {
  LoginResponse,
  OTPResponse,
  RegisterResponse,
} from "@/constants/config";
import axiosInstance from "@/constants/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { Platform } from "react-native";

interface AuthPayloadBase {
  credential?: string;
  password?: string;
  name?: string;
  shop_name?: string;
  gender?: string;
}

async function getDeviceData(): Promise<{
  token: string | null;
  imei: string | null;
}> {
  // 1️⃣ Pull from storage
  let [token, imei] = await Promise.all([
    AsyncStorage.getItem("@fcmToken"),
    AsyncStorage.getItem("@deviceId"),
  ]);

  // 2️⃣ If no FCM token, fetch & store it
  if (!token) {
    try {
      const messaging = getMessaging(getApp());
      token = await getToken(messaging);
      if (token) await AsyncStorage.setItem("@fcmToken", token);
    } catch (e) {
      console.warn("⚠️ Failed to get FCM token:", e);
    }
  }

  // 3️⃣ If no IMEI, fetch & store it
  if (!imei && Device.isDevice) {
    try {
      imei =
        Platform.OS === "android"
          ? await Application.getAndroidId()
          : await Application.getIosIdForVendorAsync();
      if (imei) await AsyncStorage.setItem("@deviceId", imei);
    } catch (e) {
      console.warn("⚠️ Failed to get device ID:", e);
    }
  }

  return { token, imei };
}

export async function fetchLogin(
  credential: string,
  password: string
): Promise<LoginResponse> {
  const { token, imei } = await getDeviceData();

  const body: Record<string, any> = { credential, password };
  if (token) body.token = token;
  if (imei) body.imei = imei;

  const { data } = await axiosInstance.post<LoginResponse>(
    `${environment.API_URL}/login`,
    body
  );

  console.log(data);

  return data;
}

export async function fetchRegister(
  name: string,
  shop_name: string,
  gender: string,
  credential: string,
  password: string
): Promise<RegisterResponse> {
  const { token, imei } = await getDeviceData();

  const body: Record<string, any> = {
    name,
    shop_name,
    gender,
    credential,
    password,
  };
  if (token) body.token = token;
  if (imei) body.imei = imei;

  const { data } = await axiosInstance.post<RegisterResponse>(
    `${environment.API_URL}/register`,
    body
  );

  return data;
}

export async function fetchVerifyOtp(
  phone: string,
  otp: string
): Promise<OTPResponse> {
  const { data } = await axiosInstance.post<OTPResponse>(
    `${environment.API_URL}/sms/verify`,
    { phone, otp }
  );
  return data;
}

export async function fetchResendOtp(phone: string): Promise<OTPResponse> {
  const { data } = await axiosInstance.post<OTPResponse>(
    `${environment.API_URL}/sms/resend`,
    { phone }
  );
  return data;
}
