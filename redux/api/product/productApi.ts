import axiosInstance from "@/constants/axios";
import {
  AllProductResponse,
  PaginationPayload,
  ProductDetailResponse,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllProducts = async (
  name: string | null,
  pagination: PaginationPayload
): Promise<AllProductResponse> => {
  try {
    const params = { name, ...(pagination || {}) };

    const response = await axiosInstance.get<AllProductResponse>(
      `${environment.API_URL}/products`,
      { params }
    );
    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

const fetchProductDetail = async (
  id: number
): Promise<ProductDetailResponse> => {
  try {
    const response = await axiosInstance.get<ProductDetailResponse>(
      `${environment.API_URL}/products/${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    throw error;
  }
};

export { fetchAllProducts, fetchProductDetail };
