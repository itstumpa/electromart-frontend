"use client";

import { create } from 'zustand';
import { addToWishlist, getWishlist, removeFromWishlist } from "@/api/wishlist.api";
import { authStorage } from "@/utils/auth-storage";

interface WishlistStore {
  wishlistIds: Set<string>;
  initialized: boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  wishlistIds: new Set(),
  initialized: false,

  refresh: async () => {
    const user = authStorage.getAuthUser();
    if (!user) { set({ wishlistIds: new Set(), initialized: true }); return; }
    try {
      const res = await getWishlist();
      const ids = res.data.data?.map((item) => item.productId) ?? [];
      set({ wishlistIds: new Set(ids), initialized: true });
    } catch {
      set({ wishlistIds: new Set(), initialized: true });
    }
  },

  toggle: async (productId: string) => {
    const { wishlistIds } = get();
    const isInWishlist = wishlistIds.has(productId);

    // optimistic update
    set((state) => {
      const next = new Set(state.wishlistIds);
      isInWishlist ? next.delete(productId) : next.add(productId);
      return { wishlistIds: next };
    });

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (err) {
      // revert
      set((state) => {
        const next = new Set(state.wishlistIds);
        isInWishlist ? next.add(productId) : next.delete(productId);
        return { wishlistIds: next };
      });
      throw err;
    }
  },
}));

export function useWishlistCount() {
  const wishlistIds = useWishlist((state) => state.wishlistIds);
  return { count: wishlistIds.size };
}