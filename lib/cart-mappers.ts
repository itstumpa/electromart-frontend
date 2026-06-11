import type { CartItem } from "@/data/types";
import type { CartItemDto } from "@/types/cart";
import { toNumber } from "@/types/product";

export const mapCartItemDtoToUi = (dto: CartItemDto): CartItem => {
  const price = toNumber(dto.price);
  const variant = (dto as { variant?: { id: string; name: string } }).variant;
  return {
    id: dto.id,
    productId: dto.productId,
    productSlug: dto.productSlug,
    productName: dto.productName,
    productImage: dto.productImage,
    vendorId: "",
    vendorName: dto.vendorName,
    price,
    quantity: dto.quantity,
    total: price * dto.quantity,
    stock: dto.stock,
    variant: variant?.name,
    variantId: variant?.id,
  };
};

export const mapCartItemsToUi = (items: CartItemDto[]): CartItem[] =>
  items.map(mapCartItemDtoToUi);
