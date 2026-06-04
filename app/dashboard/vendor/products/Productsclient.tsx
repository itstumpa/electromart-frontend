'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  X, Star, Package, Search,
  ChevronDown, CheckCircle2, ImageIcon,
} from 'lucide-react';
import {
  getMyProducts, createProduct, updateProduct,
  deleteProduct, toggleProductVisibility,
  type CreateProductDto,
} from '@/api/product.api';
import { getCategories, mapCategoriesToListItems } from '@/api/category.api';
import { type ProductListItemDto, toNumber } from '@/types/product';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';
import ConfirmModal from '@/components/dashboard/admin/Confirmmodal';

// ─── Form types ───────────────────────────────────────────────
interface ProductForm {
  name: string;
  price: string;
  originalPrice: string;
  stock: string;
  categoryId: string;
  description: string;
  featured: boolean;
  isActive: boolean;
  imageUrl: string;
}

const BLANK_FORM: ProductForm = {
  name: '', price: '', originalPrice: '', stock: '',
  categoryId: '', description: '', featured: false,
  isActive: true, imageUrl: '',
};

function Field({ label, k, type = 'text', placeholder, half, form, setForm }: {
  label: string; k: keyof ProductForm; type?: string;
  placeholder?: string; half?: boolean;
  form: ProductForm; setForm: (f: ProductForm) => void;
}) {
  return (
    <div className={half ? '' : 'col-span-2'}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={form[k] as string}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
    </div>
  );
}

// ─── Product modal ────────────────────────────────────────────
function ProductModal({ initial, categories, onSave, onClose }: {
  initial?: ProductListItemDto | null;
  categories: { id: string; name: string }[];
  onSave: (data: ProductForm, imageFile?: File) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProductForm>(
    initial ? {
      name:          initial.name,
      price:         String(toNumber(initial.price)),
      originalPrice: initial.originalPrice ? String(toNumber(initial.originalPrice)) : '',
      stock:         String(initial.stock),
      categoryId:    initial.categoryId,
      description:   initial.description ?? '',
      featured:      initial.featured ?? false,
      isActive:      initial.isActive,
      imageUrl:      initial.images?.[0]?.url ?? '',
    } : BLANK_FORM
  );
  const [saving,     setSaving]     = useState(false);
  const [imageFile,  setImageFile]  = useState<File | undefined>();
  const [previewImg, setPreviewImg] = useState(initial?.images?.[0]?.url ?? '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form, imageFile);
      onClose();
    } finally {
      setSaving(false);
    }
  };

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
          {/* Image */}
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
                <label className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors w-fit">
                  <ImageIcon size={14} /> Upload Image
                  <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
                <p className="text-xs text-slate-400">Or paste a URL:</p>
                <input type="url" placeholder="https://image-url.com/photo.jpg" value={form.imageUrl}
                  onChange={(e) => { setForm({ ...form, imageUrl: e.target.value }); setPreviewImg(e.target.value); }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" k="name"          placeholder="iPhone 15 Pro Max" form={form} setForm={setForm} />
            <Field label="Price *"        k="price"         placeholder="999.99"  type="number" half form={form} setForm={setForm} />
            <Field label="Original Price" k="originalPrice" placeholder="1099.99" type="number" half form={form} setForm={setForm} />
            <Field label="Stock *"        k="stock"         placeholder="100"     type="number" half form={form} setForm={setForm} />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Category</label>
            <div className="relative">
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
              { k: 'isActive',  label: 'Published' },
              { k: 'featured',  label: 'Featured' },
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
  const [products,     setProducts]     = useState<ProductListItemDto[]>([]);
  const [categories,   setCategories]   = useState<{ id: string; name: string }[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [catFilter,    setCatFilter]    = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<ProductListItemDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductListItemDto | null>(null);

  useEffect(() => {
    Promise.all([getMyProducts(), getCategories()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.data ?? []);
        setCategories(mapCategoriesToListItems(catRes.data.data).map((c) => ({ id: c.id, name: c.name })));
      })
      .catch((err) => toast.error(getApiErrorMessage(err, 'Failed to load products')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !catFilter || p.categoryId === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async (data: ProductForm, imageFile?: File) => {
    const payload: CreateProductDto = {
      name:          data.name.trim(),
      price:         parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
      stock:         parseInt(data.stock),
      categoryId:    data.categoryId,
      description:   data.description || undefined,
      featured:      data.featured,
      isActive:      data.isActive,
    };

    const images = imageFile ? [imageFile] : undefined;

    if (editTarget) {
      const res = await updateProduct(editTarget.id, payload, images);
      setProducts((prev) => prev.map((p) => p.id === editTarget.id ? res.data.data as any : p));
      toast.success('Product updated');
      setEditTarget(null);
    } else {
      const res = await createProduct(payload, images);
      setProducts((prev) => [res.data.data as any, ...prev]);
      toast.success('Product created');
    }
  };

  const handleToggleVisibility = async (p: ProductListItemDto) => {
    try {
      await toggleProductVisibility(p.id, !p.isActive);
      setProducts((prev) => prev.map((item) => item.id === p.id ? { ...item, isActive: !p.isActive } : item));
      toast.success(p.isActive ? 'Product hidden' : 'Product published');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update visibility'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete product'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const disc = (p: ProductListItemDto) => {
    if (!p.originalPrice) return 0;
    const orig = toNumber(p.originalPrice);
    const curr = toNumber(p.price);
    return orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Products</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Products</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {products.length} products · {products.filter((p) => !p.isActive).length} hidden
            </p>
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
            <input type="text" placeholder="Search by name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
          </div>
          <div className="relative">
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-400 self-center font-medium">{filtered.length} results</p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const discount = disc(p);
              const image = p.images?.[0]?.url ?? '';
              return (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    {image ? (
                      <Image src={image} alt={p.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-400"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={32} className="text-slate-200" />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.isActive ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[10px] font-semibold text-amber-600 mb-1">{p.category?.name}</p>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2">{p.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base font-black text-slate-900">${toNumber(p.price).toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">${toNumber(p.originalPrice).toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Star size={10} className="fill-amber-400 text-amber-400" />{p.rating ?? 0}
                      </span>
                      <span className={`font-bold ${p.stock <= 10 ? 'text-red-600' : 'text-green-700'}`}>
                        {p.stock} in stock
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleVisibility(p)}
                        className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                          p.isActive
                            ? 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}>
                        {p.isActive ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Publish</>}
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
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Package size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No products found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            initial={editTarget}
            categories={categories}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditTarget(null); }}
          />
        )}
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