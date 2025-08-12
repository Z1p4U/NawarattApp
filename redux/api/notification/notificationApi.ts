import axiosInstance from "@/constants/axios";
import { AllNotificationResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllNotifications = async (
  imei: string,
  pagination?: PaginationPayload
): Promise<AllNotificationResponse> => {
  try {
    const params = { imei, ...(pagination || {}) };

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
  imei: string,
  pagination?: PaginationPayload
): Promise<AllNotificationResponse> => {
  try {
    const params = { imei, ...(pagination || {}) };

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

export { fetchAllNotifications, fetchAllGlobalNotifications };
