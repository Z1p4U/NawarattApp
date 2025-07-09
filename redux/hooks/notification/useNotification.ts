import { useCallback, useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  clearNotificationState,
  handleFetchAllNotifications,
} from "@/redux/services/notification/notificationSlice";

export default function useNotification() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, status, totalNotifications } = useSelector(
    (state: RootState) => state.notification
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });
  const deviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      let saved = await AsyncStorage.getItem("@deviceId");
      if (!saved) {
        try {
          saved =
            Platform.OS === "android"
              ? await Application.getAndroidId()
              : await Application.getIosIdForVendorAsync();
        } catch {
          saved = null;
        }
        if (saved) {
          await AsyncStorage.setItem("@deviceId", saved);
        }
      }
      deviceIdRef.current = saved;
      dispatch(
        handleFetchAllNotifications({
          imei: deviceIdRef.current!,
          pagination,
        })
      );
    })();
  }, [dispatch]);

  useEffect(() => {
    if (deviceIdRef.current) {
      dispatch(
        handleFetchAllNotifications({
          imei: deviceIdRef.current,
          pagination,
        })
      );
    }
  }, [dispatch, pagination]);

  const loadMore = useCallback(() => {
    if (status !== "loading" && notifications.length < totalNotifications) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [status, notifications.length, totalNotifications]);

  const reset = useCallback(() => {
    dispatch(clearNotificationState());
    setPagination({ page: 1, size: 20 });
  }, [dispatch]);

  const hasMore = notifications.length < totalNotifications;

  return {
    notifications,
    loading: status === "loading",
    totalNotifications,
    hasMore,
    loadMore,
    reset,
    deviceId: deviceIdRef.current,
  };
}
