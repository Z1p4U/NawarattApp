import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllBanners } from "@/redux/api/app-banner/appBannerApi";
import { AllAppBannerResponse, PaginationPayload } from "@/constants/config";

/** --------------- State Interfaces --------------- **/
interface BannerState {
  banners: AllAppBannerResponse["data"] | [];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: BannerState = {
  banners: [],
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Banners
export const handleFetchAllBannerList = createAsyncThunk<
  AllAppBannerResponse, // Return type
  { pagination: PaginationPayload; sort_order: string }, // Argument type
  { rejectValue: string } // Error handling type
>(
  "appBanner/fetchAll",
  async ({ pagination, sort_order }, { rejectWithValue }) => {
    try {
      const response = await fetchAllBanners(pagination, sort_order);
      // console.log("Banner List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("Banner List Fetching error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch banners");
    }
  }
);

/** --------------- Slice --------------- **/
const appBannerSlice = createSlice({
  name: "app-banner",
  initialState,
  reducers: {
    clearBannerState(state) {
      state.status = "idle";
      state.error = null;
      state.banners = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Banners
      .addCase(handleFetchAllBannerList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllBannerList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.banners = action.payload.data;
      })
      .addCase(handleFetchAllBannerList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Banner list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearBannerState } = appBannerSlice.actions;
export default appBannerSlice.reducer;
