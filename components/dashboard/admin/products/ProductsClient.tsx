'use client';

import { useState } from 'react';
import { Eye, EyeOff, ExternalLink, Star, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Product } from '@/types';
import AdminDataTable, { Column } from '../Admindatatable';
import ConfirmModal from '../Confirmmodal';
// import AdminDataTable, { Column } from '@/components/dashboard/admin/AdminDataTable';
// import ConfirmModal from '@/components/dashboard/admin/ConfirmModal';

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products,     setProducts]     = useState(initialProducts);
  const [viewTarget,   setViewTarget]   = useState<Product | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Product | null>(null);
  const [catFilter,    setCatFilter]    = useState('');

  const categories = [...new Set(products.map((p) => p.categoryName))];
  const filtered   = catFilter ? products.filter((p) => p.categoryName === catFilter) : products;

  const handleTogglePublish = () => {
    if (!toggleTarget) return;
    setProducts((prev) =>
      prev.map((p) => p.id === toggleTarget.id ? { ...p, isPublished: !p.isPublished } : p)
    );
    setToggleTarget(null);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate max-w-[180px]">{p.name}</p>
            <p className="text-xs text-slate-400">{p.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'categoryName',
      label: 'Category',
      sortable: true,
      render: (p) => (
        <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
          {p.categoryName}
        </span>
      ),
    },
    {
      key: 'brandName',
      label: 'Brand',
      sortable: true,
      render: (p) => <span className="text-sm text-slate-600 font-medium">{p.brandName}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (p) => (
        <div>
          <p className="text-sm font-black text-slate-900">${p.price.toLocaleString()}</p>
          {p.originalPrice && (
            <p className="text-xs text-slate-400 line-through">${p.originalPrice.toLocaleString()}</p>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {p.rating} <span className="text-xs text-slate-400 font-normal">({p.reviewCount})</span>
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (p) => (
        <span className={`text-sm font-bold ${p.stock <= 10 ? 'text-red-600' : p.stock <= 30 ? 'text-yellow-600' : 'text-green-700'}`}>
          {p.stock}
        </span>
      ),
    },
    {
      key: 'isPublished',
      label: 'Status',
      render: (p) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.isPublished ? 'bg-green-500' : 'bg-slate-400'}`} />
          {p.isPublished ? 'Published' : 'Hidden'}
        </span>
      ),
    },
  ];

  const filterSlot = (
    <div className="relative">
      <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );

  const actions = (p: Product) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/products/${p.slug}`} target="_blank"
        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors" title="View live">
        <ExternalLink size={13} />
      </Link>
      <button onClick={() => setViewTarget(p)}
        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-700 flex items-center justify-center transition-colors" title="Details">
        <Eye size={14} />
      </button>
      <button onClick={() => setToggleTarget(p)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          p.isPublished ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'bg-green-100 hover:bg-green-200 text-green-700'
        }`} title={p.isPublished ? 'Unpublish' : 'Publish'}>
        {p.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',     value: products.length,                               color: 'text-slate-900' },
          { label: 'Published', value: products.filter((p) => p.isPublished).length,  color: 'text-green-700' },
          { label: 'Hidden',    value: products.filter((p) => !p.isPublished).length, color: 'text-slate-500' },
          { label: 'Low Stock', value: products.filter((p) => p.stock <= 10).length,  color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{label} Products</p>
          </div>
        ))}
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        searchKeys={['name', 'brandName', 'sku']}
        searchPlaceholder="Search by name, brand or SKU..."
        actions={actions}
        filterSlot={filterSlot}
        pageSize={8}
        emptyMessage="No products found."
      />

      {/* Toggle publish confirm */}
      <ConfirmModal
        open={!!toggleTarget}
        title={toggleTarget?.isPublished ? `Hide ${toggleTarget?.name}?` : `Publish ${toggleTarget?.name}?`}
        description={
          toggleTarget?.isPublished
            ? 'This product will be hidden from the storefront immediately. Customers will not be able to find or purchase it.'
            : 'This product will become visible on the storefront and available for purchase immediately.'
        }
        confirmLabel={toggleTarget?.isPublished ? 'Hide Product' : 'Publish Product'}
        danger={toggleTarget?.isPublished}
        onConfirm={handleTogglePublish}
        onCancel={() => setToggleTarget(null)}
      />

      {/* Product detail modal */}
      <AnimatePresence>
        {viewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 max-h-[85vh] overflow-y-auto"
            >
              <button onClick={() => setViewTarget(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={15} />
              </button>
              <img src={viewTarget.image} alt={viewTarget.name} className="w-full h-44 object-contain bg-slate-50 rounded-xl mb-5" />
              <h3 className="font-black text-slate-900 text-lg mb-1">{viewTarget.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{viewTarget.description}</p>
              <div className="space-y-2">
                {[
                  { label: 'SKU',       value: viewTarget.sku },
                  { label: 'Brand',     value: viewTarget.brandName },
                  { label: 'Category',  value: viewTarget.categoryName },
                  { label: 'Price',     value: `$${viewTarget.price.toLocaleString()}` },
                  { label: 'Stock',     value: viewTarget.stock },
                  { label: 'Rating',    value: `${viewTarget.rating} (${viewTarget.reviewCount} reviews)` },
                  { label: 'Featured',  value: viewTarget.featured ? 'Yes' : 'No' },
                  { label: 'Published', value: viewTarget.isPublished ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}