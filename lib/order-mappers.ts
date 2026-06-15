import type { Order, OrderItem, OrderStatus, PaymentStatus } from "@/data/types";
import type { OrderDto, OrderItemDto } from "@/types/order";
import { toNumber } from "@/types/product";

const STATUS_MAP: Record<string, OrderStatus> = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const PAYMENT_STATUS_MAP: Record<string, PaymentStatus> = {
  PENDING: "unpaid",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const mapBackendOrderStatus = (status: string): OrderStatus =>
  STATUS_MAP[status.toUpperCase()] ?? "pending";

export const mapBackendPaymentStatus = (status?: string): PaymentStatus =>
  status ? PAYMENT_STATUS_MAP[status.toUpperCase()] ?? "unpaid" : "unpaid";

const mapOrderItem = (item: OrderItemDto): OrderItem => ({
  id: item.id,
  productId: item.productId,
  productName: item.product?.name ?? "Product",
  productImage:
    item.productImage ??
    item.product?.images?.[0]?.url ??
    "",
  vendorId: item.storeId,
  vendorName: item.store?.name ?? "Store",
  quantity: item.quantity,
  price: toNumber(item.priceAtTime),
  total: toNumber(item.priceAtTime) * item.quantity,
  variant: item.variant ?? undefined,
  deliveredAt: item.deliveredAt ?? undefined,
});

export const mapOrderDtoToUi = (dto: OrderDto): Order => {
  const items = dto.items.map(mapOrderItem);
  const shipping = dto.shipping;

  return {
    id: dto.id,
    orderNumber: dto.id.slice(-8).toUpperCase(),
    customerId: dto.userId,
    customerName: dto.user?.name ?? "",
    customerEmail: dto.user?.email ?? "",
    customerPhone: shipping?.phone ?? "",
    vendorId: items[0]?.vendorId ?? "",
    vendorName: items[0]?.vendorName ?? "",
    items,
    subtotal: toNumber(dto.subtotal),
    shippingCost: toNumber(dto.shippingCost),
    tax: toNumber(dto.tax),
    discount: toNumber(dto.discount),
    total: toNumber(dto.total),
    status: mapBackendOrderStatus(dto.status),
    paymentStatus: mapBackendPaymentStatus(dto.payment?.status),
    paymentMethod: (() => {
      if (!dto.payment?.gateway) return "SSLCommerz";
      switch (dto.payment.gateway.toUpperCase()) {
        case "STRIPE":
          return "Stripe";
        case "SSLCOMMERZ":
          return "SSLCommerz";
        default:
          return "SSLCommerz";
      }
    })(),
    shippingAddress: {
      label: "home",
      fullName: shipping?.fullName ?? "",
      phone: shipping?.phone ?? "",
      street: shipping?.street ?? "",
      city: shipping?.city ?? "",
      state: shipping?.state ?? "",
      zipCode: shipping?.zipCode ?? "",
      country: shipping?.country ?? "",
    },
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

export const mapOrdersToUi = (orders: OrderDto[]): Order[] =>
  orders.map(mapOrderDtoToUi);
