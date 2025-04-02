import { AllWishlistResponse, PaginationPayload } from "@/constants/config";
import environment from "@/constants/environment";
import axios from "axios";

const fetchAllWishlists = async (
  token: string | null,
  pagination: PaginationPayload
): Promise<AllWishlistResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get<AllWishlistResponse>(
      `${environment.API_URL}/wishlist`,
      { headers, params } // ✅ Both headers and params inside the same object
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch wishlists:", error);
    throw error;
  }
};

export { fetchAllWishlists };
