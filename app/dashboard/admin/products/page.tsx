// SERVER COMPONENT — stats are computed client-side inside ProductsClient
import { Metadata } from 'next';
import { Package } from 'lucide-react';
import { mockProducts } from '@/data/mock-data';
import ProductsClient from '@/components/dashboard/admin/products/ProductsClient';

export const metadata: Metadata = { title: 'Product Moderation — Admin' };

export default async function AdminProductsPage() {
  // mockProducts is kept as offline-fallback initial state; real data is fetched by ProductsClient
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Package size={20} className="text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Product Moderation
          </h1>
          <p className="text-sm text-slate-500">Review, publish and manage all products</p>
        </div>
      </div>
      <ProductsClient initialProducts={mockProducts} />
    </div>
  );
}