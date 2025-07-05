import axiosInstance from "@/constants/axios";
import {
  AllProductResponse,
  PaginationPayload,
  ProductDetailResponse,
  SpecialCategoryProductResponse,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllProducts = async (
  pagination: PaginationPayload,
  brand_id?: string | null,
  name?: string | null
): Promise<AllProductResponse> => {
  try {
    const params = { brand_id, name, ...(pagination || {}) };

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
  id: string,
  pagination: PaginationPayload
): Promise<SpecialCategoryProductResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<SpecialCategoryProductResponse>(
      `${environment.API_URL}/special_categories/${id}/products`,
      { params }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch special category products:", error);
    throw error;
  }
};

const fetchAllCampaignProducts = async (
  id: string,
  pagination: PaginationPayload
): Promise<AllProductResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<AllProductResponse>(
      `${environment.API_URL}/discountables/${id}/products`,
      { params }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch campaign products:", error);
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
  fetchAllCampaignProducts,
  fetchProductDetail,
};
