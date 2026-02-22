// SERVER COMPONENT
import { Metadata } from 'next';
import { Tag } from 'lucide-react';
import { mockCategories, mockBrands } from '@/data/mock-data';
import CategoriesClient from '@/components/dashboard/admin/categories/CategoriesClient';

export const metadata: Metadata = { title: 'Categories & Brands — Admin' };

export default async function AdminCategoriesPage() {
  const categories = mockCategories;
  const brands     = mockBrands;
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