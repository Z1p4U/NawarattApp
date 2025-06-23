import environment from "@/constants/environment";
import {
  LoginResponse,
  OTPResponse,
  RegisterResponse,
} from "@/constants/config";
import axiosInstance from "@/constants/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";

interface LoginRequestBody {
  credential: string;
  password: string;
  token?: string;
  imei?: string;
}

const fetchLogin = async (
  credential: string,
  password: string
): Promise<LoginResponse> => {
  // read from storage
  let [token, imei] = await Promise.all([
    AsyncStorage.getItem("@pushToken"),
    AsyncStorage.getItem("@deviceId"),
  ]);

  // if any is missing, try fetching directly
  if (!imei) {
    try {
      imei = Application.getAndroidId
        ? await Application.getAndroidId()
        : await Application.getIosIdForVendorAsync();
    } catch {
      /* ignore */
    }
  }

  // build payload
  const body: LoginRequestBody = { credential, password };
  if (token) body.token = token;
  if (imei) body.imei = imei;

  const response = await axiosInstance.post<LoginResponse>(
    `${environment.API_URL}/login`,
    body
  );
  return response.data;
};

const fetchRegister = async (
  name: string,
  shop_name: string,
  gender: string,
  credential: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      `${environment.API_URL}/register`,
      {
        name,
        shop_name,
        gender,
        credential,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to Register : ", error);
    throw error;
  }
};

const fetchVerifyOtp = async (
  phone: string,
  otp: string
): Promise<OTPResponse> => {
  try {
    const response = await axiosInstance.post<OTPResponse>(
      `${environment.API_URL}/sms/verify`,
      {
        phone,
        otp,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to Send OTP:", error);
    throw error;
  }
};

const fetchResendOtp = async (phone: string): Promise<OTPResponse> => {
  try {
    const response = await axiosInstance.post<OTPResponse>(
      `${environment.API_URL}/sms/resend`,
      {
        phone,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to Resend OTP:", error);
    throw error;
  }
};

export { fetchLogin, fetchRegister, fetchVerifyOtp, fetchResendOtp };
