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
  variant?: string;   // For display (e.g., "Size: M")
  variantId?: string;
}

export interface CartResponseDto {
  items: CartItemDto[];
}
