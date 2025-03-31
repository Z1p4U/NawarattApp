import { AllCategoryResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";
import axios from "axios";

const fetchAllCategories = async (
  pagination: PaginationPayload
): Promise<AllCategoryResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axios.get<AllCategoryResponse>(
      `${environment.API_URL}/categories`,
      { params }
    );
    // console.log(response);
    return response.data; // Return only the data portion
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

export { fetchAllCategories };
