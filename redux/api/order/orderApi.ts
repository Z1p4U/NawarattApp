import axiosInstance from "@/constants/axios";
import {
  OrderDetailResponse,
  OrderPayload,
  AllOrderResponse,
  MessageResponse,
  PaginationPayload,
  OrderPayPayload,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllOrder = async (
  pagination: PaginationPayload
): Promise<AllOrderResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllOrderResponse>(
      `${environment.API_URL}/orders`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

const fetchOrderDetail = async (
  id: number | null
): Promise<OrderDetailResponse> => {
  try {
    const response = await axiosInstance.get<OrderDetailResponse>(
      `${environment.API_URL}/orders/${id}`
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to get detail:", error);
    throw error;
  }
};

const fetchCreateOrder = async (
  payload: OrderPayload
): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/orders`,
      payload
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to create:", error);
    throw error;
  }
};

const fetchPayOrder = async (
  id: number | null,
  payload: OrderPayPayload
): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/orders/${id}/pay`,
      payload
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to pay:", error);
    throw error;
  }
};

export { fetchAllOrder, fetchOrderDetail, fetchCreateOrder, fetchPayOrder };
