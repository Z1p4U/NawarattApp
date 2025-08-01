import axiosInstance from "@/constants/axios";
import {
  ChatDetailResponse,
  ChatPayload,
  AllChatResponse,
  MessageResponse,
  PaginationPayload,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllChat = async (
  pagination: PaginationPayload
): Promise<AllChatResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllChatResponse>(
      `${environment.API_URL}/chats`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    throw error;
  }
};

const fetchChatDetail = async (
  id: number | null
): Promise<ChatDetailResponse> => {
  try {
    const response = await axiosInstance.get<ChatDetailResponse>(
      `${environment.API_URL}/chats/${id}`
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

const fetchCreateChat = async (): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/chats`
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

export { fetchAllChat, fetchChatDetail, fetchCreateChat };
