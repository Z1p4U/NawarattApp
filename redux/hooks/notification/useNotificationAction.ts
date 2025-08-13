import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  clearNotificationState,
  handleFetchAllGlobalNotifications,
  handleFetchAllNotifications,
  handleFetchReadAllNotifications,
  handleFetchReadNotifications,
} from "@/redux/services/notification/notificationSlice";

const DEFAULT_PAGINATION = { page: 1, size: 20 };

const useNotificationAction = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select only what we need to avoid excessive re-renders
  const { status, error } = useSelector(
    (state: RootState) => ({
      status: state.notification.status,
      error: state.notification.error,
    }),
    shallowEqual
  );

  const _refetchAll = useCallback(async (): Promise<void> => {
    // run both refetches in parallel and unwrap each to throw on failure
    await Promise.all([
      dispatch(
        handleFetchAllNotifications({ pagination: DEFAULT_PAGINATION })
      ).unwrap(),
      dispatch(
        handleFetchAllGlobalNotifications({ pagination: DEFAULT_PAGINATION })
      ).unwrap(),
    ]);
  }, [dispatch]);

  const readNotification = useCallback(
    async (id: any): Promise<void> => {
      try {
        await dispatch(handleFetchReadNotifications(id)).unwrap();
        await _refetchAll();
      } catch (err) {
        // rethrow so callers can handle; alternatively return a boolean or set local error state
        throw err;
      }
    },
    [dispatch, _refetchAll]
  );

  const readAllNotifications = useCallback(async (): Promise<void> => {
    try {
      await dispatch(handleFetchReadAllNotifications()).unwrap();
      await _refetchAll();
    } catch (err) {
      throw err;
    }
  }, [dispatch, _refetchAll]);

  return {
    status,
    error,
    readNotification,
    readAllNotifications,
  };
};

export default useNotificationAction;
