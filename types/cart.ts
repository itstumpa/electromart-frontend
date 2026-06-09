export interface CartItemDto {
  id: string;
  quantity: number;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  vendorName: string;
  price: string | number;
  stock: number;
  /** Variant object returned by the backend formatter */
  variant?: { id: string; name: string };
  variantId?: string;
}

export interface CartResponseDto {
  items: CartItemDto[];
  /** Raw subtotal before any discount */
  cartTotal: number;
  /** couponId stored on the Cart row, null when no coupon applied */
  couponId: string | null;
  /** The human-readable coupon code, null when no coupon applied */
  couponCode: string | null;
  /** Discount percentage (e.g. 10 for 10%) */
  discountPercent: number;
  /** Computed discount amount in currency */
  discountAmount: number;
  /** cartTotal − discountAmount */
  finalTotal: number;
}
