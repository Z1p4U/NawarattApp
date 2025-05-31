import axios from "axios";
import config from "@/constants/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token
axiosInstance.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/**
 * Call this once from your store setup.
 * onAuthError should dispatch(logout()).
 */
export function registerAuthInterceptor(onAuthError: () => void) {
  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error.response?.status;
      if ((status === 401 || status === 403) && onAuthError) {
        onAuthError();
      }
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
