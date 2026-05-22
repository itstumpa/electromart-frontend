export type BackendOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  storeId: string;
  quantity: number;
  productImage: string;
  variant?: string | null;
  priceAtTime: string | number;
  status: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    images?: { url: string }[];
  };
  store?: { id: string; name: string };
}

export interface OrderShippingDto {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderDto {
  id: string;
  userId: string;
  status: BackendOrderStatus;
  subtotal: string | number;
  shippingCost: string | number;
  tax: string | number;
  discount: string | number;
  total: string | number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDto[];
  shipping?: OrderShippingDto | null;
  user?: { id: string; name: string; email: string };
  payment?: {
    id: string;
    status: string;
    method?: string;
    amount?: string | number;
  } | null;
}
