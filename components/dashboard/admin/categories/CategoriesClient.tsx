'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Tag, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category, Brand } from '@/types';
import ConfirmModal from '../Confirmmodal';
// import ConfirmModal from '@/components/dashboard/admin/ConfirmModal';

/* ── Category Form Modal ─────────────────────────── */
function CategoryModal({
  open, initial, onSave, onClose,
}: {
  open: boolean;
  initial?: Category | null;
  onSave: (data: Partial<Category>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    slug:        initial?.slug        ?? '',
    description: initial?.description ?? '',
    image:       initial?.image       ?? '',
  });

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <X size={15} />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-5">
              {initial ? 'Edit Category' : 'Add Category'}
            </h3>
            <div className="space-y-4">
              {[
                { key: 'name',        label: 'Category Name *', placeholder: 'e.g. Smartphones' },
                { key: 'slug',        label: 'Slug',             placeholder: 'e.g. smartphones (auto-generated)' },
                { key: 'description', label: 'Description',      placeholder: 'Brief description...' },
                { key: 'image',       label: 'Image URL',        placeholder: 'https://...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors">
                {initial ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Brand Form Modal ─────────────────────────────── */
function BrandModal({
  open, initial, onSave, onClose,
}: {
  open: boolean;
  initial?: Brand | null;
  onSave: (data: Partial<Brand>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    slug:        initial?.slug        ?? '',
    logo:        initial?.logo        ?? '',
    description: initial?.description ?? '',
  });

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <X size={15} />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-5">
              {initial ? 'Edit Brand' : 'Add Brand'}
            </h3>
            <div className="space-y-4">
              {[
                { key: 'name',        label: 'Brand Name *', placeholder: 'e.g. Apple' },
                { key: 'slug',        label: 'Slug',          placeholder: 'e.g. apple (auto-generated)' },
                { key: 'logo',        label: 'Logo URL',      placeholder: 'https://...' },
                { key: 'description', label: 'Description',   placeholder: 'Brief description...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input type="text" placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors">
                {initial ? 'Save Changes' : 'Add Brand'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Component ──────────────────────────────── */
export default function CategoriesClient({
  initialCategories,
  initialBrands,
}: {
  initialCategories: Category[];
  initialBrands: Brand[];
}) {
  const [categories,  setCategories]  = useState(initialCategories);
  const [brands,      setBrands]      = useState(initialBrands);
  const [activeTab,   setActiveTab]   = useState<'categories' | 'brands'>('categories');

  // Category state
  const [catModal,    setCatModal]    = useState(false);
  const [editCat,     setEditCat]     = useState<Category | null>(null);
  const [deleteCat,   setDeleteCat]   = useState<Category | null>(null);

  // Brand state
  const [brandModal,  setBrandModal]  = useState(false);
  const [editBrand,   setEditBrand]   = useState<Brand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);

  /* ── Category CRUD ── */
  const handleSaveCategory = (data: Partial<Category>) => {
    if (editCat) {
      setCategories((prev) => prev.map((c) => c.id === editCat.id ? { ...c, ...data } : c));
      setEditCat(null);
    } else {
      const newCat: Category = {
        id:           `cat-${Date.now()}`,
        name:         data.name!,
        slug:         data.slug!,
        description:  data.description ?? '',
        image:        data.image ?? '',
        productCount: 0,
        createdAt:    new Date().toISOString(),
        updatedAt:    new Date().toISOString(),
      };
      setCategories((prev) => [newCat, ...prev]);
    }
  };

  /* ── Brand CRUD ── */
  const handleSaveBrand = (data: Partial<Brand>) => {
    if (editBrand) {
      setBrands((prev) => prev.map((b) => b.id === editBrand.id ? { ...b, ...data } : b));
      setEditBrand(null);
    } else {
      const newBrand: Brand = {
        id:           `brand-${Date.now()}`,
        name:         data.name!,
        slug:         data.slug!,
        logo:         data.logo ?? '',
        description:  data.description,
        productCount: 0,
        createdAt:    new Date().toISOString(),
      };
      setBrands((prev) => [newBrand, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {(['categories', 'brands'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => activeTab === 'categories' ? (setCatModal(true), setEditCat(null)) : (setBrandModal(true), setEditBrand(null))}
          className="ml-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
        >
          <Plus size={16} />
          Add {activeTab === 'categories' ? 'Category' : 'Brand'}
        </button>
      </div>

      {/* ── Categories grid ── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md hover:shadow-amber-50 overflow-hidden transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-32 bg-slate-50 overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag size={32} className="text-slate-300" />
                  </div>
                )}
                {/* Action overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => { setEditCat(cat); setCatModal(true); }}
                    className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-700 hover:bg-amber-100 hover:text-amber-700 transition-colors shadow-sm"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteCat(cat)}
                    className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-700 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-black text-slate-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 mb-2 line-clamp-2">{cat.description || '—'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    {cat.productCount} products
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{cat.slug}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Brands grid ── */}
      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md hover:shadow-amber-50 p-5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-xl object-cover bg-slate-50" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Bookmark size={20} className="text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{brand.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{brand.slug}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditBrand(brand); setBrandModal(true); }}
                    className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => setDeleteBrand(brand)}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {brand.description && (
                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{brand.description}</p>
              )}
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                {brand.productCount} products
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <CategoryModal
        open={catModal}
        initial={editCat}
        onSave={handleSaveCategory}
        onClose={() => { setCatModal(false); setEditCat(null); }}
      />
      <BrandModal
        open={brandModal}
        initial={editBrand}
        onSave={handleSaveBrand}
        onClose={() => { setBrandModal(false); setEditBrand(null); }}
      />

      {/* Delete confirms */}
      <ConfirmModal
        open={!!deleteCat}
        title={`Delete "${deleteCat?.name}"?`}
        description="This will permanently delete the category. Products in this category will not be deleted but will become uncategorized."
        confirmLabel="Delete Category"
        danger
        onConfirm={() => { setCategories((p) => p.filter((c) => c.id !== deleteCat!.id)); setDeleteCat(null); }}
        onCancel={() => setDeleteCat(null)}
      />
      <ConfirmModal
        open={!!deleteBrand}
        title={`Delete "${deleteBrand?.name}"?`}
        description="This will permanently delete the brand. Products under this brand will not be deleted."
        confirmLabel="Delete Brand"
        danger
        onConfirm={() => { setBrands((p) => p.filter((b) => b.id !== deleteBrand!.id)); setDeleteBrand(null); }}
        onCancel={() => setDeleteBrand(null)}
      />
    </div>
  );
}