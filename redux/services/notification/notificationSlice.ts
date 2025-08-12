import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AllNotificationResponse, PaginationPayload } from "@/constants/config";
import {
  fetchAllGlobalNotifications,
  fetchAllNotifications,
} from "@/redux/api/notification/notificationApi";

/** --------------- State Interfaces --------------- **/
interface NotificationState {
  notifications: AllNotificationResponse["data"];
  globalNotifications: AllNotificationResponse["data"];
  totalNotifications: number;
  totalGlobalNotifications: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: NotificationState = {
  notifications: [],
  globalNotifications: [],
  totalNotifications: 0,
  totalGlobalNotifications: 0,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Notifications
export const handleFetchAllNotifications = createAsyncThunk<
  AllNotificationResponse,
  { imei: string; pagination: PaginationPayload },
  { rejectValue: string }
>(
  "notifications/fetchAll",
  async ({ imei, pagination }, { rejectWithValue }) => {
    try {
      const response = await fetchAllNotifications(imei, pagination);
      return response;
    } catch (error: any) {
      console.error("Notification List Fetching error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

export const handleFetchAllGlobalNotifications = createAsyncThunk<
  AllNotificationResponse,
  { imei: string; pagination: PaginationPayload },
  { rejectValue: string }
>(
  "notifications/fetchAllGlobal",
  async ({ imei, pagination }, { rejectWithValue }) => {
    try {
      const response = await fetchAllGlobalNotifications(imei, pagination);
      return response;
    } catch (error: any) {
      console.error("Global Notification List Fetching error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch global notifications"
      );
    }
  }
);

/** --------------- Slice --------------- **/
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationState(state) {
      state.notifications = [];
      state.globalNotifications = [];
      state.totalNotifications = 0;
      state.totalGlobalNotifications = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Notifications
      .addCase(handleFetchAllNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllNotifications.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.notifications =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.notifications ?? []), ...(action.payload.data ?? [])];

        state.totalNotifications = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(handleFetchAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Notification list fetch failed";
      })

      // Fetch All Global Notifications
      .addCase(handleFetchAllGlobalNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllGlobalNotifications.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.globalNotifications =
          pagination.page === 1
            ? action.payload.data || []
            : [
                ...(state.globalNotifications ?? []),
                ...(action.payload.data ?? []),
              ];

        state.totalGlobalNotifications = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(handleFetchAllGlobalNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Notification list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
