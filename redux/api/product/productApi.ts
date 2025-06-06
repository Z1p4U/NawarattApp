import axiosInstance from "@/constants/axios";
import {
  AllProductResponse,
  PaginationPayload,
  ProductDetailResponse,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllProducts = async (
  name: string | null,
  pagination: PaginationPayload,
  brand_id?: number | null
): Promise<AllProductResponse> => {
  try {
    const params = { brand_id, name, ...(pagination || {}) };

    // console.log(params);

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

const fetchAllSpecialCategoryProducts = async (
  pagination: PaginationPayload,
  is_highlight: boolean
): Promise<AllProductResponse> => {
  try {
    const params = { ...(pagination || {}), is_highlight };

    // console.log(params);

    const response = await axiosInstance.get<AllProductResponse>(
      `${environment.API_URL}/special_categories`,
      { params }
    );
    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch special category products:", error);
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

export {
  fetchAllProducts,
  fetchAllSpecialCategoryProducts,
  fetchProductDetail,
};
