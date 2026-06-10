export interface ProductImageDto {
  id: string;
  url: string;
  productId?: string;
  publicId?: string | null;
}

export interface ProductVariantDto {
  id: string;
  name: string;
  value: string;
  price?: string | number | null;
  stock: number;
  productId?: string;
}

export interface ProductCategoryDto {
  id: string;
  name: string;
  slug: string;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface ProductStoreDto {
  id: string;
  name: string;
  slug: string;
}

export interface ProductListItemDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string | number;
  originalPrice?: string | number | null;
  stock: number;
  storeId: string;
  categoryId: string;
  isActive: boolean;
  featured?: boolean;       
  bestseller?: boolean;     
  rating?: number;       
  reviewCount?: number;    
  createdAt: string;
  updatedAt?: string;
  images: ProductImageDto[];
  category: ProductCategoryDto;
  store: ProductStoreDto;
}

export interface ProductDetailDto {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  price: string | number;
  stock: number;
  storeId: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  images: ProductImageDto[];
  variants: ProductVariantDto[];
  category: ProductCategoryDto;
  store: ProductStoreDto;
}

export interface ProductsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// UI model aligned to existing `ProductCard` expectations
export interface UiProductCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  images: string[];
  brandName: string;
  categoryId: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  isPublished: boolean;
  createdAt: string;
}

export const toNumber = (value: string | number | null | undefined): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export const mapProductToUiCard = (dto: ProductListItemDto): UiProductCard => {
  const images = dto.images?.map((i) => i.url).filter(Boolean) ?? [];
  const primaryImage = images[0] ?? "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80";

  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description ?? "",
    price: toNumber(dto.price),
    originalPrice: dto.originalPrice != null ? toNumber(dto.originalPrice) : undefined, // ← add this
    stock: dto.stock,
    image: primaryImage,
    images,
    brandName: dto.store?.name ?? "ElectroMart",
    categoryId: dto.categoryId,
    categoryName: dto.category?.name ?? "",
    rating: dto.rating ?? 0,
    reviewCount: dto.reviewCount ?? 0,
    featured: dto.featured ?? false,
    bestseller: dto.bestseller ?? false,
    isPublished: dto.isActive ?? false,
    createdAt: dto.createdAt,
  };
};

