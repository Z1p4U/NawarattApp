// redux/services/product/productSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchAllSpecialCategoryProducts,
  fetchProductDetail,
} from "@/redux/api/product/productApi";
import {
  AllProductResponse,
  PaginationPayload,
  ProductDetailResponse,
  SpecialCategoryProductResponse,
} from "@/constants/config";

interface ProductState {
  products: AllProductResponse["data"];
  newArrivalProducts: AllProductResponse["data"];
  featuredProducts: AllProductResponse["data"];
  bestSellingProducts: AllProductResponse["data"];
  topPickProducts: AllProductResponse["data"];
  topSellingProducts: AllProductResponse["data"];
  productDetail: ProductDetailResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  newArrivalProducts: [],
  featuredProducts: [],
  bestSellingProducts: [],
  topPickProducts: [],
  topSellingProducts: [],
  productDetail: null,
  status: "idle",
  error: null,
};

/** Thunk: fetch all (regular) products **/
export const handleFetchAllProductList = createAsyncThunk<
  AllProductResponse,
  { name: string | null; pagination: PaginationPayload; brand_id?: number },
  { rejectValue: string }
>(
  "products/fetchAll",
  async ({ name, pagination, brand_id }, { rejectWithValue }) => {
    try {
      return await fetchAllProducts(name, pagination, brand_id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** Thunk: fetch all special-category products (returns array of categories each having `.products`) **/
export const handleFetchAllSpecialCategoryProducts = createAsyncThunk<
  SpecialCategoryProductResponse, // the backend returns { data: SpecialCategory[] }
  { pagination: PaginationPayload; is_highlight: boolean },
  { rejectValue: string }
>(
  "products/fetchSpecialCategories",
  async ({ pagination, is_highlight }, { rejectWithValue }) => {
    try {
      return await fetchAllSpecialCategoryProducts(pagination, is_highlight);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** Thunk: fetch one product’s detail **/
export const handleFetchProductDetail = createAsyncThunk<
  ProductDetailResponse,
  number,
  { rejectValue: string }
>("products/fetchDetail", async (id, { rejectWithValue }) => {
  try {
    return await fetchProductDetail(id);
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductState(state) {
      state.products = [];
      state.newArrivalProducts = [];
      state.featuredProducts = [];
      state.bestSellingProducts = [];
      state.topPickProducts = [];
      state.topSellingProducts = [];
      state.productDetail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // — Regular product list —
    builder
      .addCase(handleFetchAllProductList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllProductList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.products =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.products ?? []), ...(action.payload.data ?? [])];
      })
      .addCase(handleFetchAllProductList.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Failed to fetch products";
      });

    // — Product detail —
    builder
      .addCase(handleFetchProductDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchProductDetail.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.productDetail = payload.data;
        state.error = null;
      })
      .addCase(handleFetchProductDetail.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Failed to fetch product detail";
      })

      .addCase(handleFetchAllSpecialCategoryProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        handleFetchAllSpecialCategoryProducts.fulfilled,
        (state, { payload }) => {
          state.status = "succeeded";
          state.error = null;
          const categories = payload.data;

          state.newArrivalProducts =
            categories?.find((c) => c.name === "New Arrivals")?.products ?? [];
          state.featuredProducts =
            categories?.find((c) => c.name === "Featured Products")?.products ??
            [];
          state.bestSellingProducts =
            categories?.find((c) => c.name === "Best Selling")?.products ?? [];
          state.topPickProducts =
            categories?.find((c) => c.name === "Top Picks")?.products ?? [];
          state.topSellingProducts =
            categories?.find((c) => c.name === "Top Selling")?.products ?? [];
        }
      )
      .addCase(
        handleFetchAllSpecialCategoryProducts.rejected,
        (state, { payload }) => {
          state.status = "failed";
          state.error = payload ?? "Failed to fetch special-category products";
        }
      );
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
