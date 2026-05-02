'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Wallet, TrendingUp, ArrowDownToLine,
  Clock, CheckCircle2, XCircle, ChevronDown,
  DollarSign, CreditCard, Building2,
} from 'lucide-react';

// ─── Mock payout history ──────────────────────────────────────
const PAYOUTS = [
  { id: 'pay-1', amount: 3240.50, status: 'completed', method: 'Bank Transfer', date: '2024-04-01', ref: 'PAY-2024-0401' },
  { id: 'pay-2', amount: 2890.00, status: 'completed', method: 'Bank Transfer', date: '2024-03-01', ref: 'PAY-2024-0301' },
  { id: 'pay-3', amount: 1560.75, status: 'pending',   method: 'Bank Transfer', date: '2024-05-01', ref: 'PAY-2024-0501' },
  { id: 'pay-4', amount: 4100.20, status: 'completed', method: 'Bank Transfer', date: '2024-02-01', ref: 'PAY-2024-0201' },
  { id: 'pay-5', amount: 980.00,  status: 'failed',    method: 'Bank Transfer', date: '2024-01-15', ref: 'PAY-2024-0115' },
];

const EARNINGS_DATA = [
  { month: 'Nov', gross: 4800, commission: 480, net: 4320 },
  { month: 'Dec', gross: 8900, commission: 890, net: 8010 },
  { month: 'Jan', gross: 5800, commission: 580, net: 5220 },
  { month: 'Feb', gross: 7200, commission: 720, net: 6480 },
  { month: 'Mar', gross: 10100, commission: 1010, net: 9090 },
  { month: 'Apr', gross: 12800, commission: 1280, net: 11520 },
];

// Recent transactions
const TRANSACTIONS = [
  { id: 't1', description: 'iPhone 15 Pro Max — Order #EM-2024-001', amount: 1199.99, type: 'credit', date: '2024-04-28' },
  { id: 't2', description: 'Platform commission (10%)',                amount: -119.99, type: 'debit',  date: '2024-04-28' },
  { id: 't3', description: 'MacBook Pro M3 — Order #EM-2024-002',     amount: 1999.99, type: 'credit', date: '2024-04-27' },
  { id: 't4', description: 'Platform commission (10%)',                amount: -199.99, type: 'debit',  date: '2024-04-27' },
  { id: 't5', description: 'Sony WH-1000XM5 — Order #EM-2024-003',   amount: 349.99,  type: 'credit', date: '2024-04-26' },
  { id: 't6', description: 'Platform commission (10%)',                amount: -34.99,  type: 'debit',  date: '2024-04-26' },
  { id: 't7', description: 'Monthly payout — April 2024',             amount: -3240.50, type: 'payout', date: '2024-04-01' },
];

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700',  dot: 'bg-green-500',  icon: CheckCircle2 },
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', icon: Clock },
  failed:    { label: 'Failed',    color: 'bg-red-100 text-red-600',       dot: 'bg-red-500',    icon: XCircle },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-500 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function VendorEarningsClient() {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const totalGross      = EARNINGS_DATA.reduce((s, d) => s + d.gross, 0);
  const totalNet        = EARNINGS_DATA.reduce((s, d) => s + d.net, 0);
  const totalCommission = EARNINGS_DATA.reduce((s, d) => s + d.commission, 0);
  const pendingPayout   = PAYOUTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const availableBalance = totalNet - PAYOUTS.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Earnings & Payouts</h1>
          <p className="text-sm text-slate-400 mt-0.5">Your store revenue and payout history</p>
        </div>
        <button onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200">
          <ArrowDownToLine size={15} /> Request Payout
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Available Balance',
            value: `$${availableBalance.toFixed(2)}`,
            sub: 'Ready to withdraw',
            icon: Wallet,
            bg: 'bg-amber-600',
            text: 'text-white',
            subText: 'text-amber-200',
            iconBg: 'bg-amber-500',
          },
          {
            label: 'Pending Payout',
            value: `$${pendingPayout.toFixed(2)}`,
            sub: 'Processing 1–3 business days',
            icon: Clock,
            bg: 'bg-white border border-slate-100',
            text: 'text-slate-900',
            subText: 'text-slate-400',
            iconBg: 'bg-yellow-100',
          },
          {
            label: 'Total Earned (6mo)',
            value: `$${totalNet.toLocaleString()}`,
            sub: `After ${((totalCommission / totalGross) * 100).toFixed(0)}% platform commission`,
            icon: TrendingUp,
            bg: 'bg-white border border-slate-100',
            text: 'text-slate-900',
            subText: 'text-slate-400',
            iconBg: 'bg-green-100',
          },
        ].map(({ label, value, sub, icon: Icon, bg, text, subText, iconBg }) => (
          <div key={label} className={`rounded-2xl p-5 ${bg} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={22} className={label === 'Available Balance' ? 'text-amber-100' : label === 'Pending Payout' ? 'text-yellow-600' : 'text-green-600'} />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${label === 'Available Balance' ? 'text-amber-200' : 'text-slate-400'}`}>{label}</p>
              <p className={`text-2xl font-black ${text}`}>{value}</p>
              <p className={`text-xs font-medium mt-0.5 ${subText}`}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Earnings chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-black text-slate-900">Earnings Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Gross vs Net after commission</p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['3m', '6m', '1y'] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {[
            { label: 'Gross Revenue', color: '#D97706' },
            { label: 'Net Earnings',  color: '#10B981' },
            { label: 'Commission',    color: '#F87171' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={EARNINGS_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#D97706" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FCD34D', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="gross" name="Gross" stroke="#D97706" strokeWidth={2} fill="url(#grossGrad)" dot={false} />
            <Area type="monotone" dataKey="net"   name="Net"   stroke="#10B981" strokeWidth={2} fill="url(#netGrad)"   dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom: transactions + payouts */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.type === 'credit' ? 'bg-green-100' : tx.type === 'payout' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {tx.type === 'credit'  ? <DollarSign size={16} className="text-green-700" />  :
                   tx.type === 'payout'  ? <ArrowDownToLine size={16} className="text-blue-700" /> :
                   <CreditCard size={16} className="text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">{tx.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <p className={`text-sm font-black shrink-0 ${tx.amount > 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payout history */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Payout History</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {PAYOUTS.map((p) => {
              const s = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG];
              const Icon = s.icon;
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color.split(' ')[0]}`}>
                    <Icon size={16} className={s.color.split(' ')[1]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">{p.ref}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {p.method}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout request modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowRequestModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-3xl shadow-2xl z-10 w-full max-w-sm p-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <ArrowDownToLine size={22} className="text-amber-700" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Request Payout</h3>
            <p className="text-sm text-slate-500 mb-5">Payouts are processed within 1–3 business days.</p>

            <div className="bg-amber-50 rounded-xl p-4 mb-4 text-center">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Available Balance</p>
              <p className="text-3xl font-black text-amber-800">${availableBalance.toFixed(2)}</p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Amount</label>
                <input type="number" defaultValue={availableBalance.toFixed(2)} max={availableBalance}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Payout Method</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Building2 size={16} className="text-slate-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Bank Transfer</p>
                    <p className="text-xs text-slate-400">Account ending ···· 4242</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors">
                Request Payout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}