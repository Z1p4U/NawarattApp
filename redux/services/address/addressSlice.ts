import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllAddress,
  fetchAddressDetail,
  fetchCreateAddress,
  fetchUpdateAddress,
  fetchDeleteAddress,
} from "@/redux/api/address/addressApi";
import {
  AllAddressResponse,
  AddressDetailResponse,
  AddressPayload,
  MessageResponse,
  PaginationPayload,
} from "@/constants/config";

interface AddressState {
  addresses: AllAddressResponse["data"] | [];
  totalAddress: number;
  addressDetail: AddressDetailResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  totalAddress: 0,
  addressDetail: null,
  status: "idle",
  error: null,
};

// Thunks
export const loadAddresses = createAsyncThunk<
  AllAddressResponse,
  { pagination: PaginationPayload },
  { rejectValue: string }
>("address/loadAll", async ({ pagination }, { rejectWithValue }) => {
  try {
    return await fetchAllAddress(pagination);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const loadAddressDetail = createAsyncThunk<
  AddressDetailResponse,
  number,
  { rejectValue: string }
>("address/loadDetail", async (id, { rejectWithValue }) => {
  try {
    return await fetchAddressDetail(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createAddress = createAsyncThunk<
  MessageResponse,
  AddressPayload,
  { rejectValue: string }
>("address/create", async (payload, { rejectWithValue }) => {
  try {
    return await fetchCreateAddress(payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateAddress = createAsyncThunk<
  MessageResponse,
  { id: number; payload: AddressPayload },
  { rejectValue: string }
>("address/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await fetchUpdateAddress(id, payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteAddress = createAsyncThunk<
  MessageResponse,
  number,
  { rejectValue: string }
>("address/delete", async (id, { rejectWithValue }) => {
  try {
    return await fetchDeleteAddress(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressState(state) {
      state.addresses = [];
      state.totalAddress = 0;
      state.status = "idle";
      state.error = null;
    },
    clearAddressDetail(state) {
      state.addressDetail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // -- loadAll
    builder
      .addCase(loadAddresses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAddresses.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.addresses =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.addresses ?? []), ...(action.payload.data ?? [])];

        state.totalAddress = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loadAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- loadDetail
    builder
      .addCase(loadAddressDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loadAddressDetail.fulfilled,
        (state, action: PayloadAction<AddressDetailResponse>) => {
          state.status = "succeeded";
          state.addressDetail = action.payload.data;
        }
      )
      .addCase(loadAddressDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- create
    builder
      .addCase(createAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createAddress.fulfilled,
        (state, action: PayloadAction<MessageResponse>) => {
          state.status = "succeeded";
          // if (state.addresses) {
          //   state.addresses.unshift(action.payload.data);
          // } else {
          //   state.addresses = [action.payload.data];
          // }
        }
      )
      .addCase(createAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- update
    builder
      .addCase(updateAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- delete
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        // remove from list if present
        if (state.addresses && action.meta.arg) {
          state.addresses = state.addresses.filter(
            (addr) => addr.id !== action.meta.arg
          );
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });
  },
});

export const { clearAddressState, clearAddressDetail } = addressSlice.actions;
export default addressSlice.reducer;
