export interface CategoryCount {
  products: number;
}

// Backend: prisma.category.findMany({ include: { _count: { select: { products: true }}}})
export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  image?: string;        // optional — backend returns & accepts this
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count: CategoryCount;
}

// Category detail from GET /categories/slug/:slug
export interface CategoryDetailDto extends CategoryDto {
  description: string | null;
}

// UI model used by existing components (CategoryGrid, filters)
export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  image?: string;
  isFeatured?: boolean;
}
