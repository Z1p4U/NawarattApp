import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllTags } from "@/redux/api/tag/tagApi";
import { AllTagResponse, PaginationPayload } from "@/constants/config";

/** --------------- State Interfaces --------------- **/
interface TagState {
  tags: AllTagResponse["data"] | null;
  catalogTag: AllTagResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: TagState = {
  tags: null,
  catalogTag: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Tags
export const handleFetchAllTagList = createAsyncThunk<
  AllTagResponse, // Return type
  { pagination: PaginationPayload; is_highlight: boolean | null }, // Argument type
  { rejectValue: string } // Error handling type
>(
  "tags/fetchAll",
  async ({ pagination, is_highlight }, { rejectWithValue }) => {
    try {
      const response = await fetchAllTags(pagination, is_highlight);
      // console.log("Tag List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("Tag List Fetching error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch tags");
    }
  }
);

export const handleFetchAllCatalogTagList = createAsyncThunk<
  AllTagResponse, // Return type
  { pagination: PaginationPayload; is_highlight: boolean | null }, // Argument type
  { rejectValue: string } // Error handling type
>(
  "tags/fetchAllCatalogTag",
  async ({ pagination, is_highlight }, { rejectWithValue }) => {
    try {
      const response = await fetchAllTags(pagination, is_highlight);
      // console.log("Tag List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("Tag List Fetching error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch tags");
    }
  }
);

/** --------------- Slice --------------- **/
const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearTagState(state) {
      state.status = "idle";
      state.error = null;
      state.tags = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Tags
      .addCase(handleFetchAllTagList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllTagList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.tags = action.payload.data;
      })
      .addCase(handleFetchAllTagList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Tag list fetch failed";
      })

      // Fetch All Catalog Tags
      .addCase(handleFetchAllCatalogTagList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCatalogTagList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.catalogTag = action.payload.data;
      })
      .addCase(handleFetchAllCatalogTagList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Tag list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearTagState } = tagSlice.actions;
export default tagSlice.reducer;
