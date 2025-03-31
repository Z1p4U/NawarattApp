import { AllBrandResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";
import axios from "axios";

const fetchAllBrands = async (
  pagination: PaginationPayload
): Promise<AllBrandResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axios.get<AllBrandResponse>(
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
