// SERVER COMPONENT
import { Metadata } from 'next';
import { Tag } from 'lucide-react';
import { mockCategories, mockBrands } from '@/data/mock-data';
import CategoriesClient from '@/components/dashboard/admin/categories/CategoriesClient';
import { BrandDto } from '@/types/brand';



export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Categories & Brands — Admin' };

export default async function AdminCategoriesPage() {
  const API_BASE = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/v1`
    : (process.env.NEXT_PUBLIC_API_URL || "/api/v1");

  let categories = mockCategories;
  try {
    const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 0 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        categories = json.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image || '',
          productCount: c._count?.products ?? 0,
          createdAt: c.createdAt || new Date().toISOString(),
          updatedAt: c.updatedAt || new Date().toISOString(),
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch categories, using mock data", error);
  }

  let brands = mockBrands;
  try {
    const res = await fetch(`${API_BASE}/brands`, { next: { revalidate: 0 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        brands = json.data.map((b: BrandDto) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          logo: b.logo || '',
          description: b.description || '',
          productCount: b._count?.products ?? 0,
          createdAt: b.createdAt || new Date().toISOString(),
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch brands, using mock data", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <Tag size={20} className="text-green-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Categories & Brands
          </h1>
          <p className="text-sm text-slate-500">
            {categories.length} categories · {brands.length} brands
          </p>
        </div>
      </div>
      <CategoriesClient initialCategories={categories} initialBrands={brands} />
    </div>
  );
}