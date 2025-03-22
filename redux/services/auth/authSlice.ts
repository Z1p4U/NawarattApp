import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchLogin,
  fetchRegister,
  LoginResponse,
  RegisterResponse,
} from "@/redux/api/auth/authApi";

/** --------------- State Interfaces --------------- **/
interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
  registerMessage: string | null; // optional, to store register success message
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

/** --------------- Initial State --------------- **/
const initialState: AuthState = {
  token: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  registerMessage: null,
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
        // store the success message if you want
        state.registerMessage = action.payload.message;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Register failed";
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
