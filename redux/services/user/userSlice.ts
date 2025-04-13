import {
  ProfilePayload,
  ProfileResponse,
  ProfileUpdateResponse,
} from "@/constants/config";
import { fetchProfile, fetchUpdateProfile } from "@/redux/api/user/userApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/** --------------- State Interfaces --------------- **/
interface ProfileState {
  profile: ProfileResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: ProfileState = {
  profile: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

export const handleFetchProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchProfile();
    return response;
  } catch (error: any) {
    console.error("Profile data Fetching error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch profile");
  }
});

export const handleFetchUpdateProfile = createAsyncThunk<
  ProfileUpdateResponse,
  ProfilePayload,
  { rejectValue: string }
>("user/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    return await fetchUpdateProfile(payload);
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

/** --------------- Slice --------------- **/
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfileState(state) {
      state.status = "idle";
      state.error = null;
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleFetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(handleFetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Profile data fetch failed";
      })

      .addCase(handleFetchUpdateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchUpdateProfile.fulfilled, (state) => {
        state.status = "succeeded";
        // state.profile = action.payload;
        state.error = null;
      })
      .addCase(handleFetchUpdateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Profile data update failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearProfileState } = userSlice.actions;
export default userSlice.reducer;
