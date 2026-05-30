export interface TopVendor {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  coverImage: string | null;
  specialty: string | null;
  badge: string | null;
  offers: string | null;
  totalSales: number;
  rating: number;
  totalProducts: number;
}