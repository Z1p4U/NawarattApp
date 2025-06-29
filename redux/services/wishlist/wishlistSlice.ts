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
  wishlists: AllWishlistResponse["data"];
  total: number; // ← total number of items on server
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: WishlistState = {
  wishlists: [],
  total: 0,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Wishlists
export const handleFetchAllWishList = createAsyncThunk<
  AllWishlistResponse, // Return type
  { pagination: PaginationPayload },
  { rejectValue: string } // Error handling type
>("wishlists/fetchAll", async ({ pagination }, { rejectWithValue }) => {
  try {
    const response = await fetchAllWishlists(pagination);
    return response;
  } catch (error: any) {
    console.error("Wishlist List Fetching error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch wishlists");
  }
});

// Toggle Wishlists
export const handleToggleWishlist = createAsyncThunk<
  ToggleWishlistResponse,
  { id: number | null },
  { rejectValue: string }
>("wishlists/toggle", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await fetchToggleWishlist(id);
    return response;
  } catch (error: any) {
    console.error("Fetching process error:", error);
    return rejectWithValue(error.response?.data || "Failed to process");
  }
});

/** --------------- Slice --------------- **/
const wishlistSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    clearWishlistState(state) {
      state.wishlists = [];
      state.total = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Wishlists
      .addCase(handleFetchAllWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllWishList.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.wishlists =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.wishlists ?? []), ...(action.payload.data ?? [])];

        state.total = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
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

        // const toggledId = action.meta.arg.id!;
        // const newItem = action.payload.data;

        // const idx = state.wishlists.findIndex((item) => item.id === toggledId);

        // if (idx !== -1) {
        //   state.wishlists.splice(idx, 1);
        // } else if (newItem) {
        //   console.log(newItem);
        //   state.wishlists.unshift(newItem);
        // }
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
