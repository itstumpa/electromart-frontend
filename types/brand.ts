export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isFeatured?: boolean;
  productCount: number;
  createdAt: string;
  _count?: { products: number };
}