'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  X, Upload, Star, Package, Search,
  ChevronDown, CheckCircle2, ImageIcon,
} from 'lucide-react';
import { mockProducts, mockCategories } from '@/data/mock-data';
import type { Product } from '@/data/types';
import ConfirmModal from '@/components/dashboard/admin/Confirmmodal';


// ─── Product form modal ───────────────────────────────────────
interface ProductForm {
  name: string; price: string; originalPrice: string;
  stock: string; sku: string; categoryId: string;
  description: string; featured: boolean; isPublished: boolean;
  image: string;
}

const BLANK_FORM: ProductForm = {
  name: '', price: '', originalPrice: '', stock: '', sku: '',
  categoryId: '', description: '', featured: false, isPublished: true, image: '',
};

function ProductModal({ initial, onSave, onClose }: {
  initial?: Product | null;
  onSave: (data: ProductForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProductForm>(
    initial ? {
      name: initial.name, price: String(initial.price),
      originalPrice: String(initial.originalPrice ?? ''), stock: String(initial.stock),
      sku: initial.sku, categoryId: initial.categoryId,
      description: initial.description, featured: initial.featured,
      isPublished: initial.isPublished, image: initial.image,
    } : BLANK_FORM
  );
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState(initial?.image ?? '');

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSave(form);
    setSaving(false);
    onClose();
  };

  const Field = ({ label, k, type = 'text', placeholder, half }: {
    label: string; k: keyof ProductForm; type?: string; placeholder?: string; half?: boolean;
  }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={form[k] as string}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
          <h3 className="font-black text-slate-900">{initial ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image preview + URL */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Product Image</label>
            <div className="flex gap-3 items-start">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                {previewImg ? (
                  <Image src={previewImg} alt="preview" fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input type="url" placeholder="https://image-url.com/photo.jpg" value={form.image}
                  onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreviewImg(e.target.value); }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                <p className="text-xs text-slate-400">Paste an image URL above. Image upload via Cloudinary is connected to the backend API.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" k="name"          placeholder="iPhone 15 Pro Max" />
            <Field label="SKU"            k="sku"           placeholder="APL-IP15PM-256" half />
            <Field label="Price *"        k="price"         placeholder="999.99"  type="number" half />
            <Field label="Original Price" k="originalPrice" placeholder="1099.99" type="number" half />
            <Field label="Stock *"        k="stock"         placeholder="100"     type="number" half />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Category</label>
            <div className="relative">
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer">
                <option value="">Select category</option>
                {mockCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Description</label>
            <textarea rows={3} placeholder="Describe your product..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none" />
          </div>

          {/* Toggles */}
          <div className="flex gap-4 flex-wrap">
            {([
              { k: 'isPublished', label: 'Published' },
              { k: 'featured',    label: 'Featured' },
            ] as { k: keyof ProductForm; label: string }[]).map(({ k, label }) => (
              <label key={k} className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setForm((f) => ({ ...f, [k]: !f[k] }))}
                  className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                    form[k] ? 'bg-amber-600 border-amber-600' : 'border-slate-300'
                  }`}>
                  {form[k] && <CheckCircle2 size={11} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-slate-700 font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
            {saving ? (
              <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />Saving...</>
            ) : (initial ? 'Save Changes' : 'Add Product')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function VendorProductsClient() {
  const vendorProducts = mockProducts.filter((p) => p.vendorId === 'vendor-1');
  const [products,    setProducts]    = useState<Product[]>(vendorProducts);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !catFilter || p.categoryId === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (data: ProductForm) => {
    if (editTarget) {
      setProducts((prev) => prev.map((p) => p.id === editTarget.id ? {
        ...p, name: data.name, price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        stock: parseInt(data.stock), sku: data.sku, categoryId: data.categoryId,
        description: data.description, featured: data.featured, isPublished: data.isPublished,
        image: data.image || p.image,
      } : p));
      setEditTarget(null);
    } else {
      const newP: Product = {
        id: `prod-new-${Date.now()}`, vendorId: 'vendor-1', vendorName: 'TechStore Pro',
        categoryId: data.categoryId, categoryName: mockCategories.find(c => c.id === data.categoryId)?.name ?? '',
        brandId: '', brandName: '', name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description, price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        image: data.image || 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400',
        images: [], stock: parseInt(data.stock), sku: data.sku,
        specifications: [], variants: [], rating: 0, reviewCount: 0,
        featured: data.featured, bestseller: false, isPublished: data.isPublished,
        tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      } as unknown as Product;
      setProducts((prev) => [newP, ...prev]);
    }
  };

  const handleTogglePublish = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const categories = [...new Set(products.map((p) => p.categoryId))];
  const disc = (p: Product) => p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Products</h1>
            <p className="text-sm text-slate-400 mt-0.5">{products.length} products · {products.filter(p => !p.isPublished).length} hidden</p>
          </div>
          <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200">
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Search by name or SKU..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
          </div>
          <div className="relative">
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
              <option value="">All Categories</option>
              {mockCategories.filter(c => categories.includes(c.id)).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-400 self-center font-medium">{filtered.length} results</p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-400" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  {disc(p) > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      -{disc(p)}%
                    </span>
                  )}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.isPublished ? 'Live' : 'Hidden'}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] font-semibold text-amber-600 mb-1">{p.categoryName}</p>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-black text-slate-900">${p.price.toLocaleString()}</span>
                    {p.originalPrice && <span className="text-xs text-slate-400 line-through">${p.originalPrice.toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" />{p.rating}</span>
                    <span className={`font-bold ${p.stock <= 10 ? 'text-red-600' : 'text-green-700'}`}>{p.stock} in stock</span>
                    <span className="font-mono text-slate-400">{p.sku}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handleTogglePublish(p.id)}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                        p.isPublished ? 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600' : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}>
                      {p.isPublished ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Publish</>}
                    </button>
                    <button onClick={() => { setEditTarget(p); setModalOpen(true); }}
                      className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(p)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Package size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No products found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && <ProductModal initial={editTarget} onSave={handleSave} onClose={() => { setModalOpen(false); setEditTarget(null); }} />}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This product will be permanently deleted and removed from the storefront."
        confirmLabel="Delete Product"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}