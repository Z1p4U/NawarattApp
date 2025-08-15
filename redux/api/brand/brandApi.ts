import axiosInstance from "@/constants/axios";
import { AllBrandResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllBrands = async (
  pagination: PaginationPayload,
  is_highlight: boolean | null
): Promise<AllBrandResponse> => {
  try {
    const params = { ...(pagination || {}), is_highlight };

    const response = await axiosInstance.get<AllBrandResponse>(
      `${environment.API_URL}/brands`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw error;
  }
};

export { fetchAllBrands };
