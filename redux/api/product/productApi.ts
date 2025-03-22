import axios from "axios";
import config from "@/config/environment";

export interface AllProductResponse {
  data: number[]; // Ensure this is an array of numbers
  links: object;
  meta: object;
}

export interface ProductDetailResponse {
  data: {
    id: string;
    name: string;
    description: string;
    price: string;
    brand: { id: string; name: string; image: string };
    category: { id: string; name: string };
    images: [];
    thumbnail: string;
  };
  related_products: [];
}

const fetchAllProducts = async (
  name,
  pagination
): Promise<AllProductResponse> => {
  try {
    const params = { name, ...(pagination || {}) };

    const response = await axios.get<AllProductResponse>(
      `${config.API_URL}/products`,
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
    const response = await axios.get<ProductDetailResponse>(
      `${config.API_URL}/products/${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    throw error;
  }
};

export { fetchAllProducts, fetchProductDetail };
