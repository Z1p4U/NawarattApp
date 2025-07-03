import axiosInstance from "@/constants/axios";
import { AllCampaignResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllCampaigns = async (
  pagination: PaginationPayload
): Promise<AllCampaignResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllCampaignResponse>(
      `${environment.API_URL}/discountables`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    throw error;
  }
};

export { fetchAllCampaigns };
