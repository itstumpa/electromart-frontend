'use client';

import { useState, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronUp, ChevronDown, ChevronLeft,
  ChevronRight, X,
} from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface Props<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  pageSize?: number;
  actions?: (row: T) => ReactNode;
  filterSlot?: ReactNode;           // extra filter UI injected from parent
  emptyMessage?: string;
}

type SortDir = 'asc' | 'desc';

export default function AdminDataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  pageSize = 10,
  actions,
  filterSlot,
  emptyMessage = 'No records found.',
}: Props<T>) {
  const [search,   setSearch]   = useState('');
  const [sortKey,  setSortKey]  = useState<string>('');
  const [sortDir,  setSortDir]  = useState<SortDir>('asc');
  const [page,     setPage]     = useState(1);

  /* ── Search + sort ── */
  const processed = useMemo(() => {
    let list = [...data];

    if (search && searchKeys.length > 0) {
      const q = search.toLowerCase();
      list = list.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
      );
    }

    if (sortKey) {
      list.sort((a, b) => {
        const av = String((a as any)[sortKey] ?? '');
        const bv = String((b as any)[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    return list;
  }, [data, search, searchKeys, sortKey, sortDir]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const paginated  = processed.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const SortIcon = ({ col }: { col: string }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : (
      <ChevronDown size={13} className="opacity-30" />
    );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-50">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Extra filter slot */}
        {filterSlot}

        {/* Results count */}
        <p className="text-xs text-slate-400 font-medium shrink-0">
          {processed.length} result{processed.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap ${col.className ?? ''} ${col.sortable ? 'cursor-pointer select-none hover:text-slate-700 transition-colors' : ''}`}
                  onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon col={String(col.key)} />}
                  </span>
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="wait">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-16 text-center">
                    <p className="text-slate-400 text-sm">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className="hover:bg-amber-50/40 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className={`px-5 py-3.5 text-sm text-slate-700 ${col.className ?? ''}`}>
                        {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-5 py-3.5 text-right">
                        {actions(row)}
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 flex-wrap gap-3">
          <p className="text-xs text-slate-400 font-medium">
            Page {page} of {totalPages} · {processed.length} total
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    p === page
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}