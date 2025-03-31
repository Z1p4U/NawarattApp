import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/services/auth/authSlice";
import productReducer from "@/redux/services/product/productSlice";
import brandReducer from "@/redux/services/brand/brandSlice";
import categoryReducer from "@/redux/services/category/categorySlice";
import userReducer from "@/redux/services/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    brand: brandReducer,
    category: categoryReducer,
    user: userReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
