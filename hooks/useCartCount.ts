'use client';

import { useCallback, useEffect, useState } from 'react';
import { getCart } from '@/api/cart.api';

export function useCartCount() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await getCart();
      const items = res.data.data?.items ?? [];
      setCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, [refresh]);

  return { count, refresh };
}

export const notifyCartUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'));
  }
};
