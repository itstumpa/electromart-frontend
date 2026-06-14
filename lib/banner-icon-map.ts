import {
  Zap,
  Truck,
  Gift,
  Tag,
  RotateCcw,
  Star,
  Heart,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const BANNER_ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Truck,
  Gift,
  Tag,
  RotateCcw,
  Star,
  Heart,
  ShoppingBag,
};

export const getBannerIcon = (name: string | null): LucideIcon => {
  if (name && BANNER_ICON_MAP[name]) {
    return BANNER_ICON_MAP[name];
  }
  return Zap;
};
