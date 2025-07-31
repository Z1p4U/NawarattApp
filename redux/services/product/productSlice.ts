import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCampaignProducts,
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
  brandProducts: AllProductResponse["data"];
  specialCategoriesProducts: SpecialCategoryProductResponse["data"];
  campaignProducts: AllProductResponse["data"];
  productDetail: ProductDetailResponse["data"] | null;
  relatedProduct: ProductDetailResponse["related_product"] | null;
  totalProduct: number;
  totalBrandProducts: number;
  totalSpecialCategoriesProducts: number;
  totalCampaignProducts: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  brandProducts: [],
  specialCategoriesProducts: [],
  campaignProducts: [],
  totalProduct: 0,
  totalBrandProducts: 0,
  totalSpecialCategoriesProducts: 0,
  totalCampaignProducts: 0,
  productDetail: null,
  relatedProduct: null,
  status: "idle",
  error: null,
};

/** Thunk: fetch all (regular) products **/
export const handleFetchAllProductList = createAsyncThunk<
  AllProductResponse,
  {
    pagination: PaginationPayload;
    category_id?: string | null;
    brand_id?: string | null;
    min_price?: number | null;
    max_price?: number | null;
    name: string;
  },
  { rejectValue: string }
>(
  "products/fetchAll",
  async (
    { pagination, category_id, brand_id, min_price, max_price, name },
    { rejectWithValue }
  ) => {
    try {
      return await fetchAllProducts(
        pagination,
        category_id,
        brand_id,
        min_price,
        max_price,
        name
      );
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const handleFetchAllBrandProducts = createAsyncThunk<
  AllProductResponse,
  { pagination: PaginationPayload; brand_id: string | null },
  { rejectValue: string }
>(
  "products/fetchBrandProducts",
  async ({ pagination, brand_id }, { rejectWithValue }) => {
    try {
      return await fetchAllProducts(pagination, brand_id);
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
  "products/fetchSpecialCategoriesProducts",
  async ({ id, pagination }, { rejectWithValue }) => {
    try {
      return await fetchAllSpecialCategoryProducts(id, pagination);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const handleFetchAllCampaignProducts = createAsyncThunk<
  AllProductResponse,
  { id: string; pagination: PaginationPayload },
  { rejectValue: string }
>(
  "products/fetchCampaignProducts",
  async ({ id, pagination }, { rejectWithValue }) => {
    try {
      return await fetchAllCampaignProducts(id, pagination);
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
      state.totalProduct = 0;
      state.status = "idle";
      state.error = null;
    },
    clearCategoryProductState(state) {
      state.specialCategoriesProducts = [];
      state.totalSpecialCategoriesProducts = 0;
      state.status = "idle";
      state.error = null;
    },
    clearBrandProductState(state) {
      state.brandProducts = [];
      state.totalBrandProducts = 0;
      state.status = "idle";
      state.error = null;
    },
    clearCampaignProductState(state) {
      state.campaignProducts = [];
      state.totalCampaignProducts = 0;
      state.status = "idle";
      state.error = null;
    },
    clearProductDetailState(state) {
      state.productDetail = null;
      state.relatedProduct = null;
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
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.products =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.products ?? []), ...(action.payload.data ?? [])];

        state.totalProduct = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(handleFetchAllProductList.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Failed to fetch products";
      });

    // — Brand Product List —
    builder
      .addCase(handleFetchAllBrandProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllBrandProducts.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.brandProducts =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.brandProducts ?? []), ...(action.payload.data ?? [])];

        state.totalBrandProducts = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(handleFetchAllBrandProducts.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Failed to fetch products";
      });

    // — Special Category Product List —
    builder
      .addCase(handleFetchAllSpecialCategoryProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        handleFetchAllSpecialCategoryProducts.fulfilled,
        (state, action) => {
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

          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(
        handleFetchAllSpecialCategoryProducts.rejected,
        (state, { payload }) => {
          state.status = "failed";
          state.error = payload ?? "Failed to fetch special-category products";
        }
      );

    // — Campaign Product List —
    builder
      .addCase(handleFetchAllCampaignProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCampaignProducts.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.campaignProducts =
          pagination.page === 1
            ? action.payload.data || []
            : [
                ...(state.campaignProducts ?? []),
                ...(action.payload.data ?? []),
              ];

        state.totalCampaignProducts = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(
        handleFetchAllCampaignProducts.rejected,
        (state, { payload }) => {
          state.status = "failed";
          state.error = payload ?? "Failed to fetch campaign products";
        }
      );

    // — Product detail —
    builder
      .addCase(handleFetchProductDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchProductDetail.fulfilled, (state, { payload }) => {
        state.productDetail = payload.data;
        state.relatedProduct = payload.related_product;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(handleFetchProductDetail.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Failed to fetch product detail";
      });
  },
});

export const {
  clearProductState,
  clearBrandProductState,
  clearCategoryProductState,
  clearProductDetailState,
  clearCampaignProductState,
} = productSlice.actions;
export default productSlice.reducer;
