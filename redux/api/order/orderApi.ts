import axiosInstance from "@/constants/axios";
import {
  OrderDetailResponse,
  OrderPayload,
  AllOrderResponse,
  MessageResponse,
  PaginationPayload,
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
    console.error("Failed to fetch order:", error);
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
    console.error("Failed to process:", error);
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
    console.error("Failed to process:", error);
    throw error;
  }
};

// const fetchUpdateOrder = async (
//   id: number | null,
//   payload: OrderPayload
// ): Promise<MessageResponse> => {
//   try {
//     const response = await axiosInstance.post<MessageResponse>(
//       `${environment.API_URL}/orders/${id}`,
//       { payload }
//     );

//     return response?.data;
//   } catch (error) {
//     console.error("Failed to process:", error);
//     throw error;
//   }
// };

// const fetchDeleteOrder = async (
//   id: number | null
// ): Promise<MessageResponse> => {
//   try {
//     const response = await axiosInstance.delete<MessageResponse>(
//       `${environment.API_URL}/orders/${id}`
//     );

//     return response?.data;
//   } catch (error) {
//     console.error("Failed to process:", error);
//     throw error;
//   }
// };

export { fetchAllOrder, fetchOrderDetail, fetchCreateOrder };
