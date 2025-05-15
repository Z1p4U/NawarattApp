// General
export interface PaginationPayload {
  page: number;
  size: number;
}

export interface CardProps {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
}
export interface MessageResponse {
  message: string;
}

// General

// Location

export interface Country {
  id: number;
  name_en: string;
  name_my: string;
  code: string;
}
export interface State {
  id: number;
  country_id: number;
  name_en: string;
  name_my: string;
  code: string;
}
export interface City {
  id: number;
  country_id: number;
  state_id: number;
  name_en: string;
  name_my: string;
  code: string;
}

export interface CountryResponse {
  data: Country[];
}
export interface StateResponse {
  data: State[];
}
export interface CityResponse {
  data: City[];
}

// Location

// Address
export interface Address {
  id: number;
  country: Country;
  state: State;
  city: City;
  address: string;
  phone_no: string;
  is_default: boolean;
  additional_info: string;
}
export interface AllAddressResponse {
  data: Address[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}
export interface AddressDetailResponse {
  data: Address;
}
export interface AddressPayload {
  country_id: number;
  state_id: number;
  city_id: number;
  address: string;
  phone_no: string;
  is_default: boolean;
  additional_info: string;
}

// Address

// Login
export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
  };
}
export interface LoginPayload {
  credential: string;
  password: string;
}
// Login

// Register
export interface RegisterResponse {
  message: string;
  error: string;
}
export interface RegisterPayload {
  username: string;
  shopName: string;
  gender: string;
  credential: string;
  password: string;
}
// Register

// OTP & Resend OTP
export interface OTPResponse {
  message: string;
}
export interface OtpPayload {
  phone: string;
  otp: string;
}
export interface ResendOTPResponse {
  message: string;
}
export interface ResendOtpPayload {
  phone: string;
}

export interface PinPayload {
  oldPin: string;
  newPin: string;
  confirmPin: string;
}
// OTP & Resend OTP

// User Profile
export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  verified: boolean;
  role: {
    id: number;
    name: string;
  };
  user_data: {
    id: number;
    shop_name: string;
    gender: string;
    avatar: string;
    age: number | null;
    state: string | null;
    city: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
  };
}
export interface ProfileResponse {
  data: UserData;
}

export interface ProfilePayload {
  name: string;
  shop_name: string;
  phone: string;
  email: string;
  gender: string;
}
export interface ProfileUpdateResponse {
  message: string;
}

// User Profile

// Brand
export interface Brand {
  id: number;
  name: string;
  status: string;
  is_highlight: boolean;
  image: string;
}
export interface AllBrandResponse {
  data: Brand[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}
// Brand

// Category
export interface Category {
  id: number;
  name: string;
  status: string;
  is_highlight: boolean;
  image: string;
}
export interface AllCategoryResponse {
  data: Category[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}
// Category

// Product
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: { id: number; name: string; image: string };
  category: { id: number; name: string };
  images: string[];
  thumbnail: string;
}
export interface AllProductResponse {
  data: Product[] | null;
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface SpecialCategory {
  id: number;
  name: string;
  status: string;
  image: string;
  created_at: string;
  updated_at: string;
  products: Product[];
}
export interface SpecialCategoryProductResponse {
  data: SpecialCategory[] | null;
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface ProductDetailResponse {
  data: Product;
  related_products: Product[];
}

// Product

// Wishlist

export interface Wishlist {
  id: number;
  product: Product;
}
export interface AllWishlistResponse {
  data: Wishlist[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface ToggleWishlistResponse {
  message: string;
  data: Wishlist;
}

// Wishlist
