'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Pencil, Check, X, Search,
} from 'lucide-react';
import { getMyProducts } from '@/src/services/api/product.api';
import { type ProductListItemDto } from '@/types/product';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';
import api from '@/src/services/api/axios';
import type { ApiResponse } from '@/types/api';

type StockFilter = 'all' | 'low' | 'out' | 'ok';

export default function VendorInventoryClient() {
  const [products,  setProducts]  = useState<ProductListItemDto[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState<StockFilter>('all');

  useEffect(() => {
    getMyProducts()
      .then((res) => setProducts(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, 'Failed to load inventory')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'out' ? p.stock === 0 :
      filter === 'low' ? p.stock > 0 && p.stock <= 10 :
      p.stock > 10;
    return matchSearch && matchFilter;
  });

  const startEdit = (p: ProductListItemDto) => {
    setEditId(p.id);
    setEditValue(String(p.stock));
  };

  const saveEdit = async (id: string) => {
    const val = parseInt(editValue);
    if (isNaN(val) || val < 0) { setEditId(null); return; }
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({ stock: val }));
      await api.patch<ApiResponse<null>>(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: val } : p));
      toast.success('Stock updated');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update stock'));
    }
    setEditId(null);
  };

  const cancelEdit = () => setEditId(null);

  const stockStatus = (stock: number) => {
    if (stock === 0)  return { label: 'Out of Stock', color: 'bg-red-100 text-red-700',       dot: 'bg-red-500',    bar: 'bg-red-500',    pct: 0 };
    if (stock <= 5)   return { label: 'Critical',     color: 'bg-red-100 text-red-700',       dot: 'bg-red-500',    bar: 'bg-red-500',    pct: Math.min(100, stock) };
    if (stock <= 10)  return { label: 'Low Stock',    color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', bar: 'bg-orange-500', pct: Math.min(100, stock) };
    if (stock <= 30)  return { label: 'Medium',       color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', bar: 'bg-yellow-500', pct: Math.min(100, stock) };
    return              { label: 'In Stock',      color: 'bg-green-100 text-green-700',   dot: 'bg-green-500',  bar: 'bg-green-500',  pct: Math.min(100, stock) };
  };

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowCount   = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outCount   = products.filter((p) => p.stock === 0).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Inventory & Stock</h1>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-14" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Inventory & Stock</h1>
        <p className="text-sm text-slate-400 mt-0.5">{products.length} products · {totalStock.toLocaleString()} total units</p>
      </div>

      {/* Alert banner */}
      {(lowCount > 0 || outCount > 0) && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-red-800">Stock Alert</p>
            <p className="text-xs text-red-600 mt-0.5">
              {outCount > 0 && `${outCount} product${outCount > 1 ? 's' : ''} out of stock`}
              {outCount > 0 && lowCount > 0 && ' · '}
              {lowCount > 0 && `${lowCount} product${lowCount > 1 ? 's' : ''} running low`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length,            color: 'text-slate-900',  bg: 'bg-white' },
          { label: 'Total Units',    value: totalStock.toLocaleString(), color: 'text-blue-700',   bg: 'bg-blue-50' },
          { label: 'Low Stock',      value: lowCount,                    color: 'text-orange-700', bg: 'bg-orange-50' },
          { label: 'Out of Stock',   value: outCount,                    color: 'text-red-700',    bg: 'bg-red-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl border border-slate-100 p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Search by name..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {([
            { key: 'all', label: 'All' },
            { key: 'low', label: '⚠ Low' },
            { key: 'out', label: '✗ Out' },
            { key: 'ok',  label: '✓ OK' },
          ] as { key: StockFilter; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === key ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Product', 'Category', 'Stock', 'Status', 'Stock Level', 'Edit'].map((h) => (
                  <th key={h} className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence initial={false}>
                {filtered.map((p, i) => {
                  const s = stockStatus(p.stock);
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }} className="hover:bg-amber-50/30 transition-colors">

                      {/* Product */}
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                            {p.images?.[0]?.url ? (
                              <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <div className="w-full h-full bg-slate-100" />
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-900 max-w-[180px] truncate">{p.name}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium text-slate-600">{p.category?.name ?? '—'}</span>
                      </td>

                      {/* Stock — inline edit */}
                      <td className="px-5 py-3.5">
                        {editId === p.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number" min="0"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(p.id); if (e.key === 'Escape') cancelEdit(); }}
                              className="w-20 px-2.5 py-1.5 border-2 border-amber-400 rounded-lg text-sm font-bold text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <button onClick={() => saveEdit(p.id)} className="w-7 h-7 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center justify-center transition-colors">
                              <Check size={13} />
                            </button>
                            <button onClick={cancelEdit} className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg flex items-center justify-center transition-colors">
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-base font-black ${p.stock === 0 ? 'text-red-600' : p.stock <= 10 ? 'text-orange-600' : 'text-slate-900'}`}>
                            {p.stock}
                          </span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>

                      {/* Stock bar */}
                      <td className="px-5 py-3.5">
                        <div className="w-24">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${s.bar} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{s.pct.toFixed(0)}% of 100</p>
                        </div>
                      </td>

                      {/* Edit */}
                      <td className="px-5 py-3.5">
                        <button onClick={() => startEdit(p)}
                          className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors">
                          <Pencil size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-16 text-center text-slate-400 text-sm">No products match your filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}