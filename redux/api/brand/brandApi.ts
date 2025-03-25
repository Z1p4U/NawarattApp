import axios from "axios";
import config from "@/config/environment";

export interface AllBrandResponse {
  data: object[];
  links: object;
  meta: object;
}

const fetchAllBrands = async (pagination: any): Promise<AllBrandResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axios.get<AllBrandResponse>(
      `${config.API_URL}/brands`,
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
