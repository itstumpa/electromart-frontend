"use client";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/api/wishlist.api";
import { useCallback, useEffect, useState } from "react";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const res = await getWishlist();
      const ids = res.data.data?.map((item) => item.productId) ?? [];
      setWishlistIds(new Set(ids));
    } catch {
      setWishlistIds(new Set());
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("wishlist-updated", onUpdate);
    return () => window.removeEventListener("wishlist-updated", onUpdate);
  }, [refresh]);

  const toggle = useCallback(
    async (productId: string) => {
      const isInWishlist = wishlistIds.has(productId);

      // optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        isInWishlist ? next.delete(productId) : next.add(productId);
        return next;
      });

      try {
        if (isInWishlist) {
          await removeFromWishlist(productId);
        } else {
          await addToWishlist(productId);
        }
        notifyWishlistUpdated();
      } catch (err) {
        // revert on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          isInWishlist ? next.add(productId) : next.delete(productId);
          return next;
        });
        throw err; // ← rethrow so caller can handle it
      }
    },
    [wishlistIds],
  );

  return { wishlistIds, toggle, refresh };
}

export const notifyWishlistUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wishlist-updated"));
  }
};

export function useWishlistCount() {
  const { wishlistIds } = useWishlist();
  return { count: wishlistIds.size };
}
