import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllChat,
  fetchChatDetail,
  fetchCreateChat,
} from "@/redux/api/chat/chatApi";
import {
  AllChatResponse,
  ChatDetailResponse,
  ChatPayload,
  MessageResponse,
  PaginationPayload,
} from "@/constants/config";

interface ChatState {
  chats: AllChatResponse["data"] | [];
  totalChat: number;
  chatDetail: ChatDetailResponse["data"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  totalChat: 0,
  chatDetail: null,
  status: "idle",
  error: null,
};

// Thunks
export const loadChats = createAsyncThunk<
  AllChatResponse,
  { pagination: PaginationPayload },
  { rejectValue: string }
>("chat/loadAll", async ({ pagination }, { rejectWithValue }) => {
  try {
    return await fetchAllChat(pagination);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const loadChatDetail = createAsyncThunk<
  ChatDetailResponse,
  number,
  { rejectValue: string }
>("chat/loadDetail", async (id, { rejectWithValue }) => {
  try {
    return await fetchChatDetail(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createChat = createAsyncThunk<
  MessageResponse,
  ChatPayload,
  { rejectValue: string }
>("chat/create", async (payload, { rejectWithValue }) => {
  try {
    return await fetchCreateChat(payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatState(state) {
      state.chats = [];
      state.totalChat = 0;
      state.status = "idle";
      state.error = null;
    },
    clearChatDetail(state) {
      state.chatDetail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // -- loadAll
    builder
      .addCase(loadChats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        const { pagination } = action.meta.arg as {
          pagination: PaginationPayload;
        };

        state.chats =
          pagination.page === 1
            ? action.payload.data || []
            : [...(state.chats ?? []), ...(action.payload.data ?? [])];

        state.totalChat = action.payload.meta.total;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- loadDetail
    builder
      .addCase(loadChatDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loadChatDetail.fulfilled,
        (state, action: PayloadAction<ChatDetailResponse>) => {
          state.status = "succeeded";
          state.chatDetail = action.payload.data;
        }
      )
      .addCase(loadChatDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });

    // -- create
    builder
      .addCase(createChat.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createChat.fulfilled,
        (state, action: PayloadAction<MessageResponse>) => {
          state.status = "succeeded";
          // if (state.chats) {
          //   state.chats.unshift(action.payload.data);
          // } else {
          //   state.chats = [action.payload.data];
          // }
        }
      )
      .addCase(createChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });
  },
});

export const { clearChatState, clearChatDetail } = chatSlice.actions;
export default chatSlice.reducer;
