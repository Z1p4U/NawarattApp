import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AllChatMessageResponse,
  ChatMessagePayload,
  MessageResponse,
  PaginationPayload,
} from "@/constants/config";
import {
  fetchAllChatMessage,
  fetchSendChatMessage,
} from "@/redux/api/messages/messageApi";

interface ChatState {
  chatMessages: AllChatMessageResponse["data"] | [];
  totalChatMessage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ChatState = {
  chatMessages: [],
  totalChatMessage: 0,
  status: "idle",
  error: null,
};

// Thunks
export const loadChatMessages = createAsyncThunk<
  AllChatMessageResponse,
  { id: number; pagination: PaginationPayload },
  { rejectValue: string }
>("chatMessage/loadAll", async ({ id, pagination }, { rejectWithValue }) => {
  try {
    return await fetchAllChatMessage(id, pagination);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createChatMessage = createAsyncThunk<
  MessageResponse,
  { id: number; payload: ChatMessagePayload },
  { rejectValue: string }
>("chatMessage/create", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await fetchSendChatMessage(id, payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const messageSlice = createSlice({
  name: "chatMessage",
  initialState,
  reducers: {
    clearMessageState(state) {
      state.chatMessages = [];
      state.totalChatMessage = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // -- loadAll
    builder
      .addCase(loadChatMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadChatMessages.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.chatMessages =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.chatMessages ?? []), ...(action.payload.data ?? [])];

        state.totalChatMessage = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loadChatMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- create
    builder
      .addCase(createChatMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createChatMessage.fulfilled,
        (state, action: PayloadAction<MessageResponse>) => {
          state.status = "succeeded";
          // if (state.chats) {
          //   state.chats.unshift(action.payload.data);
          // } else {
          //   state.chats = [action.payload.data];
          // }
        }
      )
      .addCase(createChatMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });
  },
});

export const { clearMessageState } = messageSlice.actions;
export default messageSlice.reducer;
