// ============================================================
// ElectroMart — Complete Type Definitions
// ============================================================

// ---------------------------
// ENUMS
// ---------------------------

export type UserRole = 'SUPER_ADMIN' | 'VENDOR' | 'CUSTOMER' | 'DELIVERY';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'SSLCommerz' | 'Cash on Delivery' | 'Bank Transfer';

export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

export type NotificationType = 'order' | 'review' | 'system' | 'promotion' | 'delivery';

// ---------------------------
// USER & AUTH
// ---------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isBanned: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  logo?: string;
  bio?: string;
  isApproved: boolean;
  totalProducts: number;
  totalSales: number;
  rating: number;
  createdAt: string;
}

export interface DeliveryProfile {
  id: string;
  userId: string;
  vehicleType: 'bike' | 'car' | 'van';
  isAvailable: boolean;
  totalDeliveries: number;
  createdAt: string;
}

// ---------------------------
// ADDRESS
// ---------------------------

export interface Address {
  id: string;
  userId: string;
  label: 'home' | 'office' | 'other';
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// ---------------------------
// CATEGORY
// ---------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------
// BRAND
// ---------------------------

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  productCount: number;
  createdAt: string;
}

// ---------------------------
// PRODUCT
// ---------------------------

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;      // e.g. "Storage", "Color"
  value: string;     // e.g. "256GB", "Midnight Black"
  priceModifier: number; // + or - from base price
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  stock: number;
  sku: string;
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------
// REVIEW
// ---------------------------

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------
// CART
// ---------------------------

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  price: number;
  quantity: number;
  total: number;
  stock: number;
  variant?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

// ---------------------------
// WISHLIST
// ---------------------------

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  rating: number;
  stock: number;
  addedAt: string;
}

// ---------------------------
// ORDER
// ---------------------------

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  price: number;
  total: number;
  variant?: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vendorId: string;
  vendorName: string;
  deliveryId?: string;
  deliveryPersonName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Omit<Address, 'id' | 'userId' | 'isDefault'>;
  trackingNumber?: string;
  estimatedDelivery?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------
// PAYMENT
// ---------------------------

export interface Payment {
  id: string;
  orderId: string;
  sslTransactionId?: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  gatewayResponse?: Record<string, unknown>;
  createdAt: string;
}

// ---------------------------
// NOTIFICATION
// ---------------------------

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ---------------------------
// ANALYTICS (Admin/Vendor)
// ---------------------------

export interface AnalyticsStat {
  label: string;
  value: number | string;
  change: number; // percentage change
  trend: 'up' | 'down';
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueData: RevenueDataPoint[];
  topProducts: Pick<Product, 'id' | 'name' | 'image' | 'price' | 'reviewCount'>[];
}

// ---------------------------
// API RESPONSE WRAPPERS
// ---------------------------

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}