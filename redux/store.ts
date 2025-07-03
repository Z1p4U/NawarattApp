import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/services/auth/authSlice";
import productReducer from "@/redux/services/product/productSlice";
import campaignReducer from "@/redux/services/campaign/campaignSlice";
import brandReducer from "@/redux/services/brand/brandSlice";
import categoryReducer from "@/redux/services/category/categorySlice";
import userReducer from "@/redux/services/user/userSlice";
import wishlistReducer from "@/redux/services/wishlist/wishlistSlice";
import locationReducer from "@/redux/services/location/locationSlice";
import addressReducer from "@/redux/services/address/addressSlice";
import orderReducer from "@/redux/services/order/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    campaign: campaignReducer,
    brand: brandReducer,
    category: categoryReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    location: locationReducer,
    address: addressReducer,
    order: orderReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
