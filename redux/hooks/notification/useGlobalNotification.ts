import { useCallback, useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  clearNotificationState,
  handleFetchAllGlobalNotifications,
} from "@/redux/services/notification/notificationSlice";

export default function useGlobalNotification() {
  const dispatch = useDispatch<AppDispatch>();
  const { globalNotifications, status, totalGlobalNotifications } = useSelector(
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
        handleFetchAllGlobalNotifications({
          imei: deviceIdRef.current!,
          pagination,
        })
      );
    })();
  }, [dispatch]);

  useEffect(() => {
    if (deviceIdRef.current) {
      dispatch(
        handleFetchAllGlobalNotifications({
          imei: deviceIdRef.current,
          pagination,
        })
      );
    }
  }, [dispatch, pagination]);

  const loadMore = useCallback(() => {
    if (
      status !== "loading" &&
      globalNotifications.length < totalGlobalNotifications
    ) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [status, globalNotifications.length, totalGlobalNotifications]);

  const reset = useCallback(() => {
    dispatch(clearNotificationState());
    setPagination({ page: 1, size: 20 });
  }, [dispatch]);

  const hasMore = globalNotifications.length < totalGlobalNotifications;

  return {
    globalNotifications,
    loading: status === "loading",
    totalGlobalNotifications,
    hasMore,
    loadMore,
    reset,
    deviceId: deviceIdRef.current,
  };
}
