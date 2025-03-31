import axios from "axios";
import environment from "@/constants/environment";
import {
  LoginResponse,
  OTPResponse,
  RegisterResponse,
} from "@/constants/config";

const fetchLogin = async (
  credential: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${environment.API_URL}/login`,
      {
        credential,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to Login:", error);
    throw error;
  }
};

const fetchRegister = async (
  name: string,
  shop_name: string,
  gender: string,
  credential: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
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
    const response = await axios.post<OTPResponse>(
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
    const response = await axios.post<OTPResponse>(
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
