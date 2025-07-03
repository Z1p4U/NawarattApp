import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllCampaigns } from "@/redux/api/campaign/campaignApi";
import { AllCampaignResponse, PaginationPayload } from "@/constants/config";

/** --------------- State Interfaces --------------- **/
interface CampaignState {
  campaigns: AllCampaignResponse["data"];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: CampaignState = {
  campaigns: [],
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Campaigns
export const handleFetchAllCampaignList = createAsyncThunk<
  AllCampaignResponse, // Return type
  { pagination: PaginationPayload }, // Argument type
  { rejectValue: string } // Error handling type
>("campaigns/fetchAll", async ({ pagination }, { rejectWithValue }) => {
  try {
    const response = await fetchAllCampaigns(pagination);
    // console.log("Campaign List Fetching success:", response);
    return response;
  } catch (error: any) {
    console.error("Campaign List Fetching error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch campaigns");
  }
});

/** --------------- Slice --------------- **/
const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    clearCampaignState(state) {
      state.status = "idle";
      state.error = null;
      state.campaigns = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Campaigns
      .addCase(handleFetchAllCampaignList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCampaignList.fulfilled, (state, action) => {
        state.campaigns = action.payload.data;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(handleFetchAllCampaignList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Campaign list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearCampaignState } = campaignSlice.actions;
export default campaignSlice.reducer;
