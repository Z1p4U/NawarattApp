import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllPayments } from "@/redux/api/payment/paymentApi";
import { AllPaymentResponse, PaginationPayload } from "@/constants/config";

/** --------------- State Interfaces --------------- **/
interface PaymentState {
  payments: AllPaymentResponse["data"] | null;
  catalogPayment: AllPaymentResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: PaymentState = {
  payments: null,
  catalogPayment: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Payments
export const handleFetchAllPaymentList = createAsyncThunk<
  AllPaymentResponse, // Return type
  { pagination: PaginationPayload; is_highlight: boolean | null }, // Argument type
  { rejectValue: string } // Error handling type
>(
  "payments/fetchAll",
  async ({ pagination, is_highlight }, { rejectWithValue }) => {
    try {
      const response = await fetchAllPayments(pagination, is_highlight);
      // console.log("Payment List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("Payment List Fetching error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch payments"
      );
    }
  }
);

export const handleFetchAllCatalogPaymentList = createAsyncThunk<
  AllPaymentResponse, // Return type
  { pagination: PaginationPayload; is_highlight: boolean | null }, // Argument type
  { rejectValue: string } // Error handling type
>(
  "payments/fetchAllCatalogPayment",
  async ({ pagination, is_highlight }, { rejectWithValue }) => {
    try {
      const response = await fetchAllPayments(pagination, is_highlight);
      // console.log("Payment List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("Payment List Fetching error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch payments"
      );
    }
  }
);

/** --------------- Slice --------------- **/
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentState(state) {
      state.status = "idle";
      state.error = null;
      state.payments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Payments
      .addCase(handleFetchAllPaymentList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllPaymentList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.payments = action.payload.data;
      })
      .addCase(handleFetchAllPaymentList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Payment list fetch failed";
      })

      // Fetch All Catalog Payments
      .addCase(handleFetchAllCatalogPaymentList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCatalogPaymentList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.catalogPayment = action.payload.data;
      })
      .addCase(handleFetchAllCatalogPaymentList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Payment list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
