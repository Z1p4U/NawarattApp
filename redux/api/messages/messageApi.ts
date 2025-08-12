import axiosInstance from "@/constants/axios";
import {
  MessageResponse,
  PaginationPayload,
  AllChatMessageResponse,
  ChatMessagePayload,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllChatMessage = async (
  id: number | null,
  pagination: PaginationPayload
): Promise<AllChatMessageResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllChatMessageResponse>(
      `${environment.API_URL}/chats/${id}/messages`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

const fetchSendChatMessage = async (
  id: number | null,
  payload: ChatMessagePayload
): Promise<MessageResponse> => {
  try {
    console.log("payload", payload);
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/chats/${id}/messages`,
      payload
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

export { fetchAllChatMessage, fetchSendChatMessage };
