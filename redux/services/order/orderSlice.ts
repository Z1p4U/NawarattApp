import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllOrder,
  fetchOrderDetail,
  fetchCreateOrder,
} from "@/redux/api/order/orderApi";
import {
  AllOrderResponse,
  OrderDetailResponse,
  OrderPayload,
  MessageResponse,
  PaginationPayload,
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

// export const updateOrder = createAsyncThunk<
//   MessageResponse,
//   { id: number; payload: OrderPayload },
//   { rejectValue: string }
// >("order/update", async ({ id, payload }, { rejectWithValue }) => {
//   try {
//     return await fetchUpdateOrder(id, payload);
//   } catch (err: any) {
//     return rejectWithValue(err.message);
//   }
// });

// export const deleteOrder = createAsyncThunk<
//   MessageResponse,
//   number,
//   { rejectValue: string }
// >("order/delete", async (id, { rejectWithValue }) => {
//   try {
//     return await fetchDeleteOrder(id);
//   } catch (err: any) {
//     return rejectWithValue(err.message);
//   }
// });

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearDetail(state) {
      state.orderDetail = null;
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
      });

    // -- loadDetail
    builder
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
      });

    // -- create
    builder
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
      });
  },
});

export const { clearDetail } = orderSlice.actions;
export default orderSlice.reducer;
