import axiosInstance from "@/constants/axios";
import { AllAppBannerResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllBanners = async (
  pagination: PaginationPayload,
  sort_order: string
): Promise<AllAppBannerResponse> => {
  try {
    const params = { ...(pagination || {}), sort_order };

    const response = await axiosInstance.get<AllAppBannerResponse>(
      `${environment.API_URL}/banner`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    throw error;
  }
};

export { fetchAllBanners };
