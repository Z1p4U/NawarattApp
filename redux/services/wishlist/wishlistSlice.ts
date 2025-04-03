import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AllWishlistResponse,
  PaginationPayload,
  ToggleWishlistResponse,
} from "@/constants/config";
import {
  fetchAllWishlists,
  fetchToggleWishlist,
} from "@/redux/api/wishlist/wishlistApi";

/** --------------- State Interfaces --------------- **/
interface WishlistState {
  wishlists: AllWishlistResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: WishlistState = {
  wishlists: [],
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Wishlists
export const handleFetchAllWishList = createAsyncThunk<
  AllWishlistResponse, // Return type
  { token: string | null; pagination: PaginationPayload },
  { rejectValue: string } // Error handling type
>("wishlists/fetchAll", async ({ token, pagination }, { rejectWithValue }) => {
  try {
    const response = await fetchAllWishlists(token, pagination);
    return response;
  } catch (error: any) {
    console.error("Wishlist List Fetching error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch wishlists");
  }
});

// Toggle Wishlists
export const handleToggleWishlist = createAsyncThunk<
  ToggleWishlistResponse, // Return type
  { token: string | null; id: number | null },
  { rejectValue: string } // Error handling type
>("wishlists/toggle", async ({ token, id }, { rejectWithValue }) => {
  try {
    const response = await fetchToggleWishlist(token, id);
    // console.log("Process success:", response);
    return response;
  } catch (error: any) {
    console.error(" Fetching process error:", error);
    return rejectWithValue(error.response?.data || "Failed to process");
  }
});

/** --------------- Slice --------------- **/
const wishlistSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    clearWishlistState(state) {
      state.status = "idle";
      state.error = null;
      state.wishlists = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Wishlists
      .addCase(handleFetchAllWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllWishList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.wishlists =
          pagination.page === 1
            ? action.payload.data || [] // Ensure it's never null
            : [...(state.wishlists ?? []), ...(action.payload.data ?? [])]; // Ensure both are arrays
      })
      .addCase(handleFetchAllWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Wishlist list fetch failed";
      })

      // Toggle Wishlists
      .addCase(handleToggleWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleToggleWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const toggledId = action.meta.arg.id;
      })
      .addCase(handleToggleWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Product detail fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
