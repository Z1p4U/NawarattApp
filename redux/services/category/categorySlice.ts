import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllCategories } from "@/redux/api/category/categoryApi";
import { AllCategoryResponse, PaginationPayload } from "@/constants/config";

/** --------------- State Interfaces --------------- **/
interface CategoryState {
  categories: AllCategoryResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: CategoryState = {
  categories: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Categories
export const handleFetchAllCategoryList = createAsyncThunk<
  AllCategoryResponse, // Return type
  { pagination: PaginationPayload }, // Argument type
  { rejectValue: string } // Error handling type
>("categories/fetchAll", async ({ pagination }, { rejectWithValue }) => {
  try {
    const response = await fetchAllCategories(pagination);
    return response;
  } catch (error: any) {
    console.error("Category List Fetching error:", error);
    return rejectWithValue(
      error.response?.data || "Failed to fetch categories"
    );
  }
});

/** --------------- Slice --------------- **/
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryState(state) {
      state.status = "idle";
      state.error = null;
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All categories
      .addCase(handleFetchAllCategoryList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCategoryList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.categories = action.payload.data;
      })
      .addCase(handleFetchAllCategoryList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Category list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
