'use client';

import { BarChart2 } from 'lucide-react';
import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

// Format "YYYY-MM" → short month label e.g. "Jan 26"
function fmtMonth(ym: string): string {
  const [year, month] = ym.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

interface DataPoint { month: string; revenue: number; orders: number }

interface Props {
  data: DataPoint[];
  totalRevenue: number;
  totalOrders: number;
}

type Mode = 'revenue' | 'orders';

const PIE_DATA = [
  { name: 'Smartphones', value: 42 },
  { name: 'Laptops',     value: 31 },
  { name: 'Audio',       value: 15 },
  { name: 'Others',      value: 12 },
];
const COLORS = ['#D97706', '#F59E0B', '#FBBF24', '#94A3B8'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
      <p className="font-black text-slate-900">
        {payload[0].name === 'revenue'
          ? `$${payload[0].value.toLocaleString()}`
          : `${payload[0].value} orders`}
      </p>
    </div>
  );
}

export default function VendorRevenueChart({ data, totalRevenue, totalOrders }: Props) {
  const [mode, setMode] = useState<Mode>('revenue');

  // Format month labels for display
  const chartData = data.map((d) => ({ ...d, month: fmtMonth(d.month) }));

  // ── Empty state ──────────────────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-slate-900">Store Performance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-xl gap-3 text-center px-4">
            <BarChart2 size={32} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-400">No revenue data yet</p>
            <p className="text-xs text-slate-400">Revenue will appear here once orders are placed and processed.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-black text-slate-900 mb-1">Sales by Category</h2>
          <p className="text-xs text-slate-400 mb-4">Revenue distribution</p>
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-xl">
            <BarChart2 size={24} className="text-slate-300" />
            <p className="text-xs text-slate-400 mt-2">No data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">

      {/* ── Main chart ── */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-black text-slate-900">Store Performance</h2>
            <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['revenue', 'orders'] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  mode === m ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-xs text-amber-700 font-semibold mb-0.5">Total Revenue</p>
            <p className="text-xl font-black text-amber-800">${(totalRevenue / 1000).toFixed(1)}k</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-600 font-semibold mb-0.5">Total Orders</p>
            <p className="text-xl font-black text-slate-900">{totalOrders}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          {mode === 'revenue' ? (
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="vendorRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D97706" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FCD34D', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2.5}
                fill="url(#vendorRevGrad)" dot={{ fill: '#D97706', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#D97706' }} />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef3c7' }} />
              <Bar dataKey="orders" fill="#D97706" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* ── Sales by category pie ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <h2 className="font-black text-slate-900 mb-1">Sales by Category</h2>
        <p className="text-xs text-slate-400 mb-4">Revenue distribution</p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
              paddingAngle={3} dataKey="value">
              {PIE_DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v) => [`${v}%`, '']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-3">
          {PIE_DATA.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
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