import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchLogin,
  fetchRegister,
  fetchVerifyOtp,
  fetchResendOtp,
  LoginResponse,
  RegisterResponse,
  OTPResponse,
} from "@/redux/api/auth/authApi";

/** --------------- State Interfaces --------------- **/
interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
  registerMessage: string | null;
  otpMessage: string | null; // success message for OTP verification/resend
}

/** --------------- Payload Interfaces --------------- **/
interface LoginPayload {
  credential: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  shopName: string;
  gender: string;
  credential: string;
  password: string;
}

interface OtpPayload {
  phone: string;
  otp: string;
}

interface ResendOtpPayload {
  phone: string;
}

/** --------------- Initial State --------------- **/
const initialState: AuthState = {
  token: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  registerMessage: null,
  otpMessage: null,
};

/** --------------- Async Thunks --------------- **/

// Load token from AsyncStorage on app start
export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  const storedToken = await AsyncStorage.getItem("authToken");
  return storedToken;
});

// Login Thunk
export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ credential, password }, { rejectWithValue }) => {
  try {
    const response = await fetchLogin(credential, password);
    // Store token in AsyncStorage
    await AsyncStorage.setItem("authToken", response.data.access_token);

    console.log("Login success:", response);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

// Register Thunk
export const register = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>(
  "auth/register",
  async (
    { username: name, shopName: shop_name, gender, credential, password },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchRegister(
        name,
        shop_name,
        gender,
        credential,
        password
      );
      // console.log("Register success:", response);
      return response;
    } catch (error: any) {
      console.error("Register error:", error);
      return rejectWithValue(error.response?.data || "Register failed");
    }
  }
);

// Verify OTP Thunk
export const verifyOtp = createAsyncThunk<
  OTPResponse,
  OtpPayload,
  { rejectValue: string }
>("auth/verifyOtp", async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const response = await fetchVerifyOtp(phone, otp);
    console.log("Verify OTP success:", response);
    return response; // { message: string }
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return rejectWithValue(error.response?.data || "Verify OTP failed");
  }
});

// Resend OTP Thunk
export const resendOtp = createAsyncThunk<
  OTPResponse,
  ResendOtpPayload,
  { rejectValue: string }
>("auth/resendOtp", async ({ phone }, { rejectWithValue }) => {
  try {
    const response = await fetchResendOtp(phone);
    console.log("Resend OTP success:", response);
    return response; // { message: string }
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return rejectWithValue(error.response?.data || "Resend OTP failed");
  }
});

// Logout Thunk
export const logout = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.removeItem("authToken");
});

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
      // Load Token
      .addCase(loadToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      })

      // Login
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

      // Register
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

      // Verify OTP
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

      // Resend OTP
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

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthState, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
