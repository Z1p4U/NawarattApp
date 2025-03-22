import { useCallback, useEffect, useState } from "react";
import {
  login,
  register,
  setIsAuthenticated,
} from "@/redux/services/auth/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);

  // Load token from AsyncStorage on mount
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      dispatch(setIsAuthenticated(!!storedToken));
      setLoading(false);
    };
    fetchToken();
  }, [dispatch]);

  const handleLogin = useCallback(
    async (credential: string, password: string) => {
      try {
        const response = await dispatch(
          login({ credential, password })
        ).unwrap();
        return response;
      } catch (error: any) {
        console.error("Failed to login:", error);
        throw error.message || "Login failed";
      }
    },
    [dispatch]
  );

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
        throw error.message || "Register failed";
      }
    },
    [dispatch]
  );

  console.log(isAuthenticated);

  return {
    token,
    isAuthenticated,
    loading,
    login: handleLogin,
    register: handleRegister,
  };
};

export default useAuth;
