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
  discount_price: number;
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

export type CountryResponse = Country[];
export type StateResponse = State[];
export type CityResponse = City[];

// Location

// Address
export interface Address {
  id: number;
  country: Country;
  state: State;
  city: City;
  address: string;
  phone_no: string;
  is_default: boolean | any;
  additional_info: string;
}
export interface AddressDetailResponse {
  data: Address;
}
export interface AddressPayload {
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  address: string;
  phone_no: string;
  is_default: boolean;
  additional_info: string;
}

export interface AllAddressResponse {
  data: Address[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
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
  order_stats: {
    total: number;
    submitted: number | null;
    confirmed: number | null;
    delivered: number | null;
    canceled: number | null;
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

// Campaign
export interface Campaign {
  id: number;
  title: string;
  body: string;
  type: string;
  image: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | string;
  is_notified: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface AllCampaignResponse {
  data: Campaign[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

// Campaign

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
  meta: Record<string, number>;
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

export interface SpecialCategory extends Category {
  products: Product[];
}
export interface AllCategoryResponse {
  data: Category[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

export interface AllSpecialCategoryResponse {
  data: SpecialCategory[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

// Category

// Product
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number;
  stock: number;
  status: string;
  is_highlight: boolean;
  show_stock: boolean;
  type: "single" | "combo" | string;
  brand: {
    id: number;
    name: string;
    status: string;
    is_highlight: boolean;
    image: string | null;
  };
  category: {
    id: number;
    name: string;
    status: string;
    is_highlight: boolean;
    image: string | null;
  };
  sub_category: {
    id: number;
    category_id: number;
    name: string;
    status: string;
    is_highlight: boolean;
    image: string | null;
  };
  tags: { id: number; name: string }[];
  thumbnail: string;
  images: { id: number; url: string }[];
  // only on detail:
  code?: number;
  group_code?: string;
  attributes?: Record<string, unknown> | null;
  discount_type?: string | null;
  discount_unit?: number | null;
  discount?: any;

  // combo-only
  combo_items?: ComboItem[];
  free_items?: FreeItem[];
  limited_qty?: number;
  limited_qty_per_customer?: number;
}

export interface ComboItem {
  id: number;
  product: Pick<
    Product,
    "id" | "name" | "thumbnail" | "price" | "stock"
  > | null;
  qty: number;
  discount_type: string | null;
  discount_unit: number | null;
}
export interface FreeItem {
  id: number;
  product: Pick<
    Product,
    "id" | "name" | "thumbnail" | "price" | "stock"
  > | null;
  qty: number;
}
export interface AllProductResponse {
  data: Product[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

export interface SpecialCategoryProductResponse {
  data: Product[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

export interface ProductDetailResponse {
  data: Product;
  related_product: Product[];
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
  meta: Record<string, number>;
}

export interface ToggleWishlistResponse {
  message: string;
  data: Wishlist;
}

// Wishlist

// Order

export interface Order {
  id: number;
  order_code: string;
  customer: UserData;
  address_book: Address;
  total_amount: number;
  paid_amount: number;
  total_qty: number;
  status: string;
  date: string;
  remark: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  payment_slips: PaymentSlip[];
  returnItems: any[];
}
export interface OrderItem {
  id: number;
  product: Product | null;
  discountable_item: {
    id: number;
    type: string;
    limited_qty: number;
    limited_qty_per_customer: number;
    unit: number;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    product: Product | null;
    discountable: {
      id: number;
      title: string;
      body: string;
      type: string;
      status: string;
      image: string | null;
      start_date: string;
      end_date: string;
    };
  } | null;
  combo_items: ComboItem[];
  qty: number;
  unit_price: number;
  option: string;
  sub_total_amount: number;
  created_at: string;
  updated_at: string;
}
export interface PaymentSlip {
  id: number;
  order_id: number;
  caption: string | null;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface AllOrderResponse {
  data: Order[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}
export interface OrderDetailResponse {
  data: Order;
}

export type OrderOption = "phone" | "remove";

export interface OrderItemPayload {
  product_id: number;
  qty: number;
  unit_price: number;
  option: OrderOption;
  discountable_item_id: number | null;
}

export interface OrderPayload {
  address_book_id: number;
  remark: string;
  items: OrderItemPayload[];
}

export interface SlipImage {
  image: string; // base64-encoded image string
  caption: string; // optional caption text
}

export interface OrderPayPayload {
  amount: number;
  slip_images: SlipImage[];
}

// Order

// Cart (local not form API)
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  thumbnail: string;
}

export interface CartItem {
  productId: string;
  pdData: ProductData;
  count: number;
  total: number;
}
// Cart

// Notification

export interface Notification {
  id: string;
  type: string;
  data: {
    type: string;
    order_id?: number;
    discountable_id?: number;
    alert_notification_id?: number;
    title: string;
    description: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AllNotificationResponse {
  data: Notification[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

// Notification

// Chat Message
export interface ChatMessage {
  id: number;
  sender: {
    id: number;
    name: string;
  };
  message: string;
  attachments: any[];
  message_type: "text" | "image" | "file" | string;
  reply_to: ChatMessage | null;
  created_at: string;
  updated_at: string;
}
export interface ChatMessagePayload {
  reply_to: number | null;
  message?: string;
  attachments?: any[]; // image , file
}
export interface AllChatMessageResponse {
  data: ChatMessage[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

// Chat Message

// Chat
export interface Chat {
  id: number;
  user: UserData;
  status: string;
  last_message: ChatMessage | string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatDetailResponse {
  data: Chat;
}
export interface ChatPayload {}

export interface AllChatResponse {
  data: Chat[];
  links: Record<string, unknown>;
  meta: Record<string, number>;
}

// Chat

// App Banner
export type BannerType = "info" | "campaign";
interface BaseBannerResponse {
  id: number;
  type: BannerType;
  order: string;
}
export interface InfoBannerResponse extends BaseBannerResponse {
  type: "info";
  image: string;
}
export interface CampaignBannerResponse extends BaseBannerResponse {
  type: "campaign";
  discountable: Campaign;
}
export type AppBanner = InfoBannerResponse | CampaignBannerResponse;
export interface AllAppBannerResponse {
  data: AppBanner[];
  links: Record<string, unknown>;
  meta: { total: number; last_page: number };
}
// App Banner
