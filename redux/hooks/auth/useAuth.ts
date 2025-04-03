import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  verifyOtp,
  resendOtp,
  loadToken,
  setIsAuthenticated,
} from "@/redux/services/auth/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Auth initialization logic: load token from secure storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(loadToken()).unwrap();
      } catch (error) {
        console.error("Error loading token:", error);
        dispatch(setIsAuthenticated(false));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Login handler
  const handleLogin = useCallback(
    async (credential: string, password: string) => {
      try {
        const response = await dispatch(
          login({ credential, password })
        ).unwrap();
        return response;
      } catch (error: any) {
        console.error("Failed to login:", error);
        throw error.error || "Login failed";
      }
    },
    [dispatch]
  );

  // Register handler
  const handleRegister = useCallback(
    async (
      username: string,
      shopName: string,
      gender: string,
      credential: string,
      password: string
    ) => {
      try {
        const response = await dispatch(
          register({ username, shopName, gender, credential, password })
        ).unwrap();
        return response;
      } catch (error: any) {
        console.error("Failed to register:", error);
        throw error.error || "Register failed";
      }
    },
    [dispatch]
  );

  // OTP Verify handler
  const handleVerifyOtp = useCallback(
    async (phone: string, otp: string) => {
      try {
        const response = await dispatch(verifyOtp({ phone, otp })).unwrap();
        return response;
      } catch (error: any) {
        console.error("Failed to verify OTP:", error);
        throw error.message || "OTP verification failed";
      }
    },
    [dispatch]
  );

  // OTP Resend handler
  const handleResendOtp = useCallback(
    async (phone: string) => {
      try {
        const response = await dispatch(resendOtp({ phone })).unwrap();
        return response;
      } catch (error: any) {
        console.error("Failed to resend OTP:", error);
        throw error.message || "Resend OTP failed";
      }
    },
    [dispatch]
  );

  return {
    token,
    isAuthenticated,
    loading,
    login: handleLogin,
    register: handleRegister,
    verifyOtp: handleVerifyOtp,
    resendOtp: handleResendOtp,
  };
};

export default useAuth;
