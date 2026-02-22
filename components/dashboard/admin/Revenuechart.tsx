'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { RevenueDataPoint } from '@/types';

interface Props {
  revenueData: RevenueDataPoint[];
  totalRevenue: number;
  totalOrders: number;
}

type ChartMode = 'revenue' | 'orders';

const PIE_DATA = [
  { name: 'Smartphones', value: 38 },
  { name: 'Laptops',     value: 27 },
  { name: 'Audio',       value: 18 },
  { name: 'Gaming',      value: 11 },
  { name: 'Others',      value: 6  },
];
const PIE_COLORS = ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#94A3B8'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-black text-slate-900">
          {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart({ revenueData, totalRevenue, totalOrders }: Props) {
  const [mode, setMode] = useState<ChartMode>('revenue');

  return (
    <div className="grid lg:grid-cols-3 gap-5">

      {/* ── Area / Bar chart ── */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-black text-slate-900">Performance Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['revenue', 'orders'] as ChartMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  mode === m
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          {mode === 'revenue' ? (
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D97706" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FCD34D', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#D97706', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#D97706' }} />
            </AreaChart>
          ) : (
            <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef3c7' }} />
              <Bar dataKey="orders" fill="#D97706" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* ── Pie: Revenue by category ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-black text-slate-900 mb-1">Sales by Category</h3>
        <p className="text-xs text-slate-500 mb-4">Revenue distribution</p>

        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={PIE_DATA}
              cx="50%" cy="50%"
              innerRadius={45} outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {PIE_DATA.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-2 mt-3">
          {PIE_DATA.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-xs text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}