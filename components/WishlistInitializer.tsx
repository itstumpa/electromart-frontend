// components/WishlistInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useWishlist } from '@/hooks/useWishlistCount';

export default function WishlistInitializer() {
  const refresh = useWishlist((state) => state.refresh);
  const initialized = useWishlist((state) => state.initialized);

  useEffect(() => {
    if (!initialized) refresh();
  }, [initialized, refresh]);

  return null;
}