import {
  AllWishlistResponse,
  PaginationPayload,
  ToggleWishlistResponse,
} from "@/constants/config";
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

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch wishlists:", error);
    throw error;
  }
};

const fetchToggleWishlist = async (
  token: string | null,
  id: number | null
): Promise<ToggleWishlistResponse> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post<ToggleWishlistResponse>(
      `${environment.API_URL}/wishlist/toggle/${id}`,
      {},
      { headers }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to process :", error);
    throw error;
  }
};

export { fetchAllWishlists, fetchToggleWishlist };
