import axiosInstance from "@/constants/axios";
import {
  AddressDetailResponse,
  AddressPayload,
  AllAddressResponse,
  MessageResponse,
  PaginationPayload,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllAddress = async (
  pagination: PaginationPayload
): Promise<AllAddressResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllAddressResponse>(
      `${environment.API_URL}/address-books`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch address:", error);
    throw error;
  }
};

const fetchAddressDetail = async (
  id: number | null
): Promise<AddressDetailResponse> => {
  try {
    const response = await axiosInstance.get<AddressDetailResponse>(
      `${environment.API_URL}/address-books/${id}`
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

const fetchCreateAddress = async (
  payload: AddressPayload
): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/address-books`,
      { payload }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

const fetchUpdateAddress = async (
  id: number | null,
  payload: AddressPayload
): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>(
      `${environment.API_URL}/address-books/${id}`,
      { payload }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

const fetchDeleteAddress = async (
  id: number | null
): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.delete<MessageResponse>(
      `${environment.API_URL}/address-books/${id}`
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

export {
  fetchAllAddress,
  fetchAddressDetail,
  fetchCreateAddress,
  fetchUpdateAddress,
  fetchDeleteAddress,
};
