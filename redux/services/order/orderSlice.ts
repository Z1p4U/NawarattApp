import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllOrder,
  fetchOrderDetail,
  fetchCreateOrder,
  fetchPayOrder,
} from "@/redux/api/order/orderApi";
import {
  AllOrderResponse,
  OrderDetailResponse,
  OrderPayload,
  MessageResponse,
  PaginationPayload,
  OrderPayPayload,
} from "@/constants/config";

interface OrderState {
  orders: AllOrderResponse["data"] | null;
  orderDetail: OrderDetailResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  orderDetail: null,
  status: "idle",
  error: null,
};

// Thunks
export const loadOrders = createAsyncThunk<
  AllOrderResponse,
  { pagination: PaginationPayload },
  { rejectValue: string }
>("order/loadAll", async ({ pagination }, { rejectWithValue }) => {
  try {
    return await fetchAllOrder(pagination);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const loadOrderDetail = createAsyncThunk<
  OrderDetailResponse,
  number,
  { rejectValue: string }
>("order/loadDetail", async (id, { rejectWithValue }) => {
  try {
    return await fetchOrderDetail(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createOrder = createAsyncThunk<
  MessageResponse,
  OrderPayload,
  { rejectValue: string }
>("order/create", async (payload, { rejectWithValue }) => {
  try {
    return await fetchCreateOrder(payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const payOrder = createAsyncThunk<
  MessageResponse,
  { id: number; payload: OrderPayPayload },
  { rejectValue: string }
>("order/pay", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await fetchPayOrder(id, payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderDetail(state) {
      state.orderDetail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // -- loadAll
    builder
      .addCase(loadOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loadOrders.fulfilled,
        (state, action: PayloadAction<AllOrderResponse>) => {
          state.status = "succeeded";
          state.orders = action.payload.data;
        }
      )
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })

      // -- loadDetail
      .addCase(loadOrderDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loadOrderDetail.fulfilled,
        (state, action: PayloadAction<OrderDetailResponse>) => {
          state.status = "succeeded";
          state.orderDetail = action.payload.data;
        }
      )
      .addCase(loadOrderDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })

      // -- create
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<MessageResponse>) => {
          state.status = "succeeded";
          // if (state.orders) {
          //   state.orders.unshift(action.payload.data);
          // } else {
          //   state.orders = [action.payload.data];
          // }
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })

      .addCase(payOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        payOrder.fulfilled,
        (state, action: PayloadAction<MessageResponse>) => {
          state.status = "succeeded";
          // if (state.orders) {
          //   state.orders.unshift(action.payload.data);
          // } else {
          //   state.orders = [action.payload.data];
          // }
        }
      )
      .addCase(payOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });
  },
});

export const { clearOrderDetail } = orderSlice.actions;
export default orderSlice.reducer;
