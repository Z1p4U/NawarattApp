import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/services/auth/authSlice";
import productReducer from "@/redux/services/product/productSlice";
import campaignReducer from "@/redux/services/campaign/campaignSlice";
import brandReducer from "@/redux/services/brand/brandSlice";
import categoryReducer from "@/redux/services/category/categorySlice";
import tagReducer from "@/redux/services/tag/tagSlice";
import appBannerReducer from "@/redux/services/app-banner/appBannerSlice";
import userReducer from "@/redux/services/user/userSlice";
import notificationReducer from "@/redux/services/notification/notificationSlice";
import wishlistReducer from "@/redux/services/wishlist/wishlistSlice";
import locationReducer from "@/redux/services/location/locationSlice";
import addressReducer from "@/redux/services/address/addressSlice";
import orderReducer from "@/redux/services/order/orderSlice";
import chatReducer from "@/redux/services/chat/chatSlice";
import messageReducer from "@/redux/services/messages/messageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    campaign: campaignReducer,
    brand: brandReducer,
    category: categoryReducer,
    tag: tagReducer,
    banner: appBannerReducer,
    user: userReducer,
    notification: notificationReducer,
    wishlist: wishlistReducer,
    location: locationReducer,
    address: addressReducer,
    order: orderReducer,
    chat: chatReducer,
    message: messageReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
