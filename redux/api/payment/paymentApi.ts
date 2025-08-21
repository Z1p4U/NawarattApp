import axiosInstance from "@/constants/axios";
import { AllPaymentResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllPayments = async (
  pagination: PaginationPayload,
  is_highlight: boolean | null
): Promise<AllPaymentResponse> => {
  try {
    const params = { ...(pagination || {}), is_highlight };

    const response = await axiosInstance.get<AllPaymentResponse>(
      `${environment.API_URL}/payments`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    throw error;
  }
};

export { fetchAllPayments };
