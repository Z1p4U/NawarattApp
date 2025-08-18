import axiosInstance from "@/constants/axios";
import {
  AllNotificationResponse,
  MessageResponse,
  PaginationPayload,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllNotifications = async (
  imei?: string,
  pagination?: PaginationPayload
): Promise<AllNotificationResponse> => {
  try {
    const params = {
      imei,
      ...(pagination || {}),
      sort_order: "desc",
      sort_field: "created_at",
    };

    const response = await axiosInstance.get<AllNotificationResponse>(
      `${environment.API_URL}/notifications`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch wishlists:", error);
    throw error;
  }
};

const fetchAllGlobalNotifications = async (
  imei?: string,
  pagination?: PaginationPayload
): Promise<AllNotificationResponse> => {
  try {
    const params = {
      imei,
      ...(pagination || {}),
      sort_order: "desc",
      sort_field: "created_at",
    };

    const response = await axiosInstance.get<AllNotificationResponse>(
      `${environment.API_URL}/global-notifications`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch wishlists:", error);
    throw error;
  }
};

const fetchReadNotification = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.get<MessageResponse>(
      `${environment.API_URL}/notifications/${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch read notifications :", error);
    throw error;
  }
};

const fetchReadAllNotification = async (): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/mark-all-as-read`
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch read all notifications: ", error);
    throw error;
  }
};

export {
  fetchAllNotifications,
  fetchAllGlobalNotifications,
  fetchReadNotification,
  fetchReadAllNotification,
};
