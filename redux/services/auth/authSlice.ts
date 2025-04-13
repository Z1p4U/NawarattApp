// redux/services/auth/authSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchLogin,
  fetchRegister,
  fetchVerifyOtp,
  fetchResendOtp,
} from "@/redux/api/auth/authApi";
import {
  LoginPayload,
  LoginResponse,
  OtpPayload,
  OTPResponse,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  ResendOTPResponse,
} from "@/constants/config";
import { AxiosError } from "axios";

interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
  registerMessage: string | null;
  otpMessage: string | null;
}

const initialState: AuthState = {
  token: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  registerMessage: null,
  otpMessage: null,
};

/** --------------- Thunks --------------- **/

// 1️⃣ Bootstrap token from AsyncStorage
export const loadToken = createAsyncThunk<string | null>(
  "auth/loadToken",
  async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch {
      return null;
    }
  }
);

// 2️⃣ Login
export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ credential, password }, { rejectWithValue }) => {
  try {
    const response = await fetchLogin(credential, password);
    const token = response.data.access_token;
    await AsyncStorage.setItem("authToken", token);
    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return rejectWithValue(err.response?.data || "Login failed");
  }
});

// 3️⃣ Register
export const register = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetchRegister(
      payload.username,
      payload.shopName,
      payload.gender,
      payload.credential,
      payload.password
    );
    return response;
  } catch (err: any) {
    console.error("Register error:", err);
    return rejectWithValue(err.response?.data || "Register failed");
  }
});

// 4️⃣ Verify OTP
export const verifyOtp = createAsyncThunk<
  OTPResponse,
  OtpPayload,
  { rejectValue: string }
>("auth/verifyOtp", async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const response = await fetchVerifyOtp(phone, otp);
    return response;
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return rejectWithValue(err.response?.data || "Verify OTP failed");
  }
});

// 5️⃣ Resend OTP
export const resendOtp = createAsyncThunk<
  ResendOTPResponse,
  ResendOtpPayload,
  { rejectValue: string }
>("auth/resendOtp", async ({ phone }, { rejectWithValue }) => {
  try {
    const response = await fetchResendOtp(phone);
    return response;
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return rejectWithValue(err.response?.data || "Resend OTP failed");
  }
});

// 6️⃣ Logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("authToken");
    } catch (err: unknown) {
      let message = "Logout failed";
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  }
);

/** --------------- Slice --------------- **/
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState(state) {
      state.status = "idle";
      state.error = null;
      state.registerMessage = null;
      state.otpMessage = null;
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadToken
      .addCase(loadToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = Boolean(action.payload);
      })

      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.data.access_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })

      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.registerMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.registerMessage = action.payload.message;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Register failed";
      })

      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.otpMessage = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.otpMessage = action.payload.message;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Verify OTP failed";
      })

      // resendOtp
      .addCase(resendOtp.pending, (state) => {
        state.status = "loading";
        state.otpMessage = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.otpMessage = action.payload.message;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Resend OTP failed";
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.registerMessage = null;
        state.otpMessage = null;
      });
  },
});

export const { clearAuthState, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
