import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllBrands } from "@/redux/api/brand/brandApi";
import { AllBrandResponse, PaginationPayload } from "@/constants/config";

/** --------------- State Interfaces --------------- **/
interface BrandState {
  brands: AllBrandResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: BrandState = {
  brands: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Brands
export const handleFetchAllBrandList = createAsyncThunk<
  AllBrandResponse, // Return type
  { pagination: PaginationPayload; is_highlight: boolean }, // Argument type
  { rejectValue: string } // Error handling type
>(
  "brands/fetchAll",
  async ({ pagination, is_highlight }, { rejectWithValue }) => {
    try {
      const response = await fetchAllBrands(pagination, is_highlight);
      // console.log("Brand List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("Brand List Fetching error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch brands");
    }
  }
);

/** --------------- Slice --------------- **/
const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearBrandState(state) {
      state.status = "idle";
      state.error = null;
      state.brands = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Brands
      .addCase(handleFetchAllBrandList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllBrandList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.brands = action.payload.data;
      })
      .addCase(handleFetchAllBrandList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Brand list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearBrandState } = brandSlice.actions;
export default brandSlice.reducer;
