// lib/api/vendors.ts
import api from '@/api/axios';
import type { TopVendor } from '@/types/vendors';

// ✅ Server Component usage (TopVendors on home page)
export async function fetchTopVendors(): Promise<TopVendor[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/stores/top-vendors`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch top vendors');
  const json = await res.json();
  return json.data as TopVendor[];
}

// ✅ Client Component usage (stores page)
export async function fetchTopVendorsClient(): Promise<TopVendor[]> {
  const res = await api.get('/stores/top-vendors');
  return res.data.data as TopVendor[];
}