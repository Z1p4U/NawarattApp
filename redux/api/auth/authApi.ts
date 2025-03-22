import axios from "axios";
import config from "@/config/environment";

export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
  };
}

export interface RegisterResponse {
  message: string;
}

export interface OTPResponse {
  message: string;
}

const fetchLogin = async (
  credential: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${config.API_URL}/login`,
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
      `${config.API_URL}/register`,
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
    console.error("Failed to Register:", error);
    throw error;
  }
};

const fetchVerifyOtp = async (
  phone: string,
  otp: string
): Promise<OTPResponse> => {
  try {
    const response = await axios.post<OTPResponse>(
      `${config.API_URL}/sms/verify`,
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
      `${config.API_URL}/sms/resend`,
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
