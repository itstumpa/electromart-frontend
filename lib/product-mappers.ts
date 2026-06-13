import type { Product } from "@/data/types";
import type { ProductDetailDto, ProductListItemDto } from "@/types/product";
import { mapProductToUiCard, toNumber } from "@/types/product";

type ProductSpecificationRow = {
  key?: string;
  label?: string;
  value: string;
};

type ProductDetailExtras = ProductDetailDto & {
  originalPrice?: string | number | null;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  bestseller?: boolean;
  tags?: string[];
  brand?: { id: string; name: string; slug?: string } | null;
  specifications?: ProductSpecificationRow[];
};

export const mapListItemDtoToProduct = (dto: ProductListItemDto): Product => {
  const card = mapProductToUiCard(dto);
  return {
    id: card.id,
    vendorId: dto.storeId,
    vendorName: card.storeName || "ElectroMart", // Store/vendor name
    categoryId: card.categoryId,
    categoryName: card.categoryName,
    brandId: dto.brand?.id ?? dto.storeId,
    brandName: card.brandName || "ElectroMart", // Brand name
    storeName: card.storeName, // Store name (same as vendorName for display)
    name: card.name,
    slug: card.slug,
    description: card.description,
    overview: dto.overview ?? null,
    details: dto.details ?? null,
    highlights: dto.highlights ?? null,
    additionalInfo: dto.additionalInfo ?? null,
    price: card.price,
    originalPrice: card.originalPrice,
    image: card.image,
    images: card.images,
    stock: card.stock,
    sku: dto.slug,
    specifications: [],
    rating: card.rating,
    reviewCount: card.reviewCount,
    featured: card.featured,
    bestseller: card.bestseller,
    isPublished: dto.isActive,
    tags: [],
    createdAt:
      typeof dto.createdAt === "string"
        ? dto.createdAt
        : new Date(dto.createdAt).toISOString(),
    updatedAt: dto.updatedAt
      ? typeof dto.updatedAt === "string"
        ? dto.updatedAt
        : new Date(dto.updatedAt).toISOString()
      : new Date().toISOString(),
  };
};

export const mapDetailDtoToProduct = (dto: ProductDetailExtras): Product => {
  const images = dto.images?.map((i) => i.url).filter(Boolean) ?? [];
  const primaryImage = images[0] ?? "";

  return {
    id: dto.id,
    vendorId: dto.storeId,
    vendorName: dto.store.name,
    categoryId: dto.categoryId,
    categoryName: dto.category.name,
    brandId: dto.brand?.id ?? dto.storeId,
    brandName: dto.brand?.name ?? dto.store.name,
    name: dto.name,
    slug: dto.slug ?? "",
    description: dto.description ?? "",
    overview: dto.overview ?? null,
    details: dto.details ?? null,
    highlights: dto.highlights ?? null,
    additionalInfo: dto.additionalInfo ?? null,
    price: toNumber(dto.price),
    originalPrice: dto.originalPrice != null ? toNumber(dto.originalPrice) : undefined,
    image: primaryImage,
    images,
    stock: dto.stock,
    sku: dto.slug ?? dto.id,
    specifications: (dto.specifications ?? []).map((s: ProductSpecificationRow) => ({
      label: s.key ?? s.label ?? "",
      value: s.value,
    })),
    variants: dto.variants?.map((v) => ({
      id: v.id,
      productId: dto.id,
      name: v.name,
      value: v.value,
      priceModifier: v.price != null ? toNumber(v.price) - toNumber(dto.price) : 0,
      stock: v.stock,
      sku: `${dto.id}-${v.id}`,
    })),
    rating: dto.rating ?? 0,
    reviewCount: dto.reviewCount ?? 0,
    featured: dto.featured ?? false,
    bestseller: dto.bestseller ?? false,
    isPublished: dto.isActive,
    tags: dto.tags ?? [],
    createdAt:
      typeof dto.createdAt === "string"
        ? dto.createdAt
        : new Date(dto.createdAt).toISOString(),
    updatedAt: dto.updatedAt
      ? typeof dto.updatedAt === "string"
        ? dto.updatedAt
        : new Date(dto.updatedAt).toISOString()
      : new Date().toISOString(),
  };
};
