import api from "./axios";
import type { ApiResponse } from "@/types/api";

export type BannerType =
  | "HOME_HERO_MAIN"
  | "HOME_GRID_CELL"
  | "HOME_PILL"
  | "PRODUCT_HERO_SLIDE"
  | "PRODUCT_FLOATING";

export type BannerDto = {
  id: string;
  type: BannerType;
  isActive: boolean;
  order: number;
  startsAt: string | null;
  expiresAt: string | null;
  imageUrl: string | null;
  publicId: string | null;

  // HOME_HERO_MAIN
  heroTitle: string | null;
  heroLabel: string | null;
  heroHref: string | null;
  heroCtaText: string | null;
  heroGradientFrom: string | null;
  heroGradientVia: string | null;
  heroAccentColor: string | null;
  heroCtaBg: string | null;

  // HOME_GRID_CELL
  gridLabel: string | null;
  gridTitle: string | null;
  gridHref: string | null;
  gridOffer: string | null;
  gridOfferIcon: string | null;
  gridGradientFrom: string | null;
  gridGradientVia: string | null;
  gridBadgeBg: string | null;

  // HOME_PILL
  pillLabel: string | null;
  pillSub: string | null;
  pillIcon: string | null;
  pillBg: string | null;
  pillShadow: string | null;

  // PRODUCT_HERO_SLIDE
  slideBadge: string | null;
  slideTitle: string | null;
  slideHighlight: string | null;
  slideSubtitle: string | null;
  slidePrice: string | null;
  slideOriginalPrice: string | null;
  slideDiscount: string | null;
  slideBgGradient: string | null;

  // PRODUCT_FLOATING
  floatingName: string | null;
  floatingPrice: string | null;
  floatingRating: number | null;
  floatingReviews: number | null;
};

// ── Public ───────────────────────────────────────────────────
export const getBannersByType = (type: BannerType) => {
  return api.get<ApiResponse<BannerDto[]>>(`/banners?type=${type}`);
};

// ── Admin ────────────────────────────────────────────────────
export const adminGetAllBanners = () => {
  return api.get<ApiResponse<BannerDto[]>>("/admin/banners");
};

export const adminGetBannerById = (id: string) => {
  return api.get<ApiResponse<BannerDto>>(`/admin/banners/${id}`);
};

export const adminCreateBanner = (data: FormData) => {
  return api.post<ApiResponse<BannerDto>>("/admin/banners", data);
};

export const adminUpdateBanner = (id: string, data: FormData) => {
  return api.patch<ApiResponse<BannerDto>>(`/admin/banners/${id}`, data);
};

export const adminDeleteBanner = (id: string) => {
  return api.delete<ApiResponse<null>>(`/admin/banners/${id}`);
};
