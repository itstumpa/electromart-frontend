'use client';

import { useCallback, useEffect, useState } from 'react';
import { getWishlist } from '@/api/wishlist.api';

export function useWishlistCount() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await getWishlist();
      setCount(res.data.data?.length ?? 0);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener('wishlist-updated', onUpdate);
    return () => window.removeEventListener('wishlist-updated', onUpdate);
  }, [refresh]);

  return { count, refresh };
}

export const notifyWishlistUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wishlist-updated'));
  }
};