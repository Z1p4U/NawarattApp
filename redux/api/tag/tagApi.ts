import axiosInstance from "@/constants/axios";
import { AllTagResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllTags = async (
  pagination: PaginationPayload,
  is_highlight: boolean | null
): Promise<AllTagResponse> => {
  try {
    const params = { ...(pagination || {}), is_highlight };

    const response = await axiosInstance.get<AllTagResponse>(
      `${environment.API_URL}/tags`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};

export { fetchAllTags };
