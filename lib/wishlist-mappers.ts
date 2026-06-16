import type { WishlistItem } from "@/data/types";
import type { WishlistItemDto } from "@/src/services/api/wishlist.api";

export const mapWishlistItemDtoToUi = (dto: WishlistItemDto): WishlistItem => ({
  id: dto.id,
  productId: dto.productId,
  productSlug: dto.productSlug,
  productName: dto.productName,
  productImage: dto.productImage,
  price: dto.price,
  originalPrice: dto.originalPrice ?? undefined,
  rating: dto.rating,
  stock: dto.stock,
  addedAt: dto.addedAt,
});

export const mapWishlistItemsToUi = (items: WishlistItemDto[]): WishlistItem[] =>
  items.map(mapWishlistItemDtoToUi);
