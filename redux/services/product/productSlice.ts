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
  specialCategoriesProducts: SpecialCategoryProductResponse["data"];
  productDetail: ProductDetailResponse["data"] | null;
  totalProduct: number;
  totalSpecialCategoriesProducts: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  specialCategoriesProducts: [],
  totalProduct: 0,
  totalSpecialCategoriesProducts: 0,
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
  SpecialCategoryProductResponse,
  { id: string; pagination: PaginationPayload },
  { rejectValue: string }
>(
  "products/fetchSpecialCategories",
  async ({ id, pagination }, { rejectWithValue }) => {
    try {
      return await fetchAllSpecialCategoryProducts(id, pagination);
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
      state.specialCategoriesProducts = [];
      state.productDetail = null;
      state.totalProduct = 0;
      state.totalSpecialCategoriesProducts = 0;
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

        state.totalProduct = action.payload.meta.total;
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
        (state, action) => {
          state.status = "succeeded";
          state.error = null;

          const { pagination } = action.meta.arg as {
            pagination: PaginationPayload;
          };

          state.specialCategoriesProducts =
            pagination.page === 1
              ? action.payload.data || []
              : [
                  ...(state.specialCategoriesProducts ?? []),
                  ...(action.payload.data ?? []),
                ];

          state.totalSpecialCategoriesProducts = action.payload.meta.total;
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
