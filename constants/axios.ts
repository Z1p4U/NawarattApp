import axios from "axios";
import config from "@/constants/environment";

import type { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/services/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

let dispatch: AppDispatch;

export function injectStore(_dispatch: AppDispatch) {
  dispatch = _dispatch;
}

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: config.API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});

// Request interceptor – add token if available
axiosInstance.interceptors.request.use(
  async (req) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 / 403 errors
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && dispatch) {
      try {
        dispatch(logout());
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
      }
      return Promise.reject(new Error("Session expired"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
