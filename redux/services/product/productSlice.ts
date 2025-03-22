import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AllProductResponse,
  fetchAllProducts,
  fetchProductDetail,
  ProductDetailResponse,
} from "@/redux/api/product/productApi";

/** --------------- State Interfaces --------------- **/
interface ProductState {
  products: AllProductResponse["data"] | null;
  productDetail: ProductDetailResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: ProductState = {
  products: null,
  productDetail: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Products
export const handleFetchAllProductList = createAsyncThunk<
  AllProductResponse, // Return type
  void, // No arguments
  { rejectValue: string } // Error handling type
>("products/fetchAll", async ({ name, pagination }, { rejectWithValue }) => {
  try {
    const response = await fetchAllProducts(name, pagination);
    // console.log("Product List Fetching success:", response);
    return response;
  } catch (error: any) {
    console.error("Product List Fetching error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch products");
  }
});

// Fetch Product Detail
export const handleFetchProductDetail = createAsyncThunk<
  ProductDetailResponse, // Return type
  number, // Argument type (Product ID)
  { rejectValue: string } // Error handling type
>("products/fetchDetail", async (id, { rejectWithValue }) => {
  try {
    const response = await fetchProductDetail(id);
    // console.log("Product Detail Fetching success:", response);
    return response;
  } catch (error: any) {
    console.error("Product Detail Fetching error:", error);
    return rejectWithValue(
      error.response?.data || "Failed to fetch product details"
    );
  }
});

/** --------------- Slice --------------- **/
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductState(state) {
      state.status = "idle";
      state.error = null;
      state.products = null;
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(handleFetchAllProductList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllProductList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.data;
        state.error = null;
      })
      .addCase(handleFetchAllProductList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Product list fetch failed";
      })

      // Fetch Product Detail
      .addCase(handleFetchProductDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchProductDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productDetail = action.payload?.data;
        state.error = null;
      })
      .addCase(handleFetchProductDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Product detail fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
