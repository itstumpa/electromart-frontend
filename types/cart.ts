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
}

export interface CartResponseDto {
  items: CartItemDto[];
}
