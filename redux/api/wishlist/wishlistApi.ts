import axiosInstance from "@/constants/axios";
import {
  AllWishlistResponse,
  PaginationPayload,
  ToggleWishlistResponse,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllWishlists = async (
  pagination: PaginationPayload
): Promise<AllWishlistResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllWishlistResponse>(
      `${environment.API_URL}/wishlist`,
      { params }
    );

    return response?.data;
  } catch (error) {
    console.error("Failed to fetch wishlists:", error);
    throw error;
  }
};

const fetchToggleWishlist = async (
  id: number | null
): Promise<ToggleWishlistResponse> => {
  try {
    const response = await axiosInstance.post<ToggleWishlistResponse>(
      `${environment.API_URL}/wishlist/toggle/${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to process:", error);
    throw error;
  }
};

export { fetchAllWishlists, fetchToggleWishlist };
