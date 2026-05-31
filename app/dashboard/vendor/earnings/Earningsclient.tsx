'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Wallet, TrendingUp, ArrowDownToLine,
  Clock, CheckCircle2, XCircle,
  DollarSign, CreditCard, Building2,
} from 'lucide-react';
import {
  getMyPayouts, getMyTransactions, requestPayout,
  type PayoutDto, type TransactionDto,
} from '@/api/payout.api';
import { getMyAnalytics, type VendorAnalyticsDto } from '@/api/vendor-analytics.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  PENDING:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700',   dot: 'bg-green-500',  icon: CheckCircle2 },
  FAILED:    { label: 'Failed',    color: 'bg-red-100 text-red-600',       dot: 'bg-red-500',    icon: XCircle },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-500 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.color }}>
          {p.name}: ${Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function VendorEarningsClient() {
  const [payouts,      setPayouts]      = useState<PayoutDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [analytics,    setAnalytics]    = useState<VendorAnalyticsDto | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [period,       setPeriod]       = useState<'3m' | '6m' | '1y'>('6m');
  const [showModal,    setShowModal]    = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [requesting,   setRequesting]  = useState(false);

  useEffect(() => {
    Promise.all([getMyPayouts(), getMyTransactions(), getMyAnalytics()])
      .then(([payoutsRes, txRes, analyticsRes]) => {
        setPayouts(payoutsRes.data.data ?? []);
        setTransactions(txRes.data.data ?? []);
        setAnalytics(analyticsRes.data.data);
      })
      .catch((err) => toast.error(getApiErrorMessage(err, 'Failed to load earnings')))
      .finally(() => setLoading(false));
  }, []);

  // Build chart data from analytics monthlyRevenue
  const chartData = (analytics?.monthlyRevenue ?? []).map((r) => {
    const gross      = r.revenue;
    const commission = gross * 0.1;
    const net        = gross - commission;
    return {
      month:      r.month.slice(5), // "2024-03" → "03"
      gross,
      net,
      commission,
    };
  });

  const totalGross      = chartData.reduce((s, d) => s + d.gross, 0);
  const totalNet        = chartData.reduce((s, d) => s + d.net, 0);
  const totalCommission = chartData.reduce((s, d) => s + d.commission, 0);
  const pendingPayout   = payouts.filter((p) => p.status === 'PENDING').reduce((s, p) => s + Number(p.amount), 0);
  const completedPayout = payouts.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + Number(p.amount), 0);
  const availableBalance = totalNet - completedPayout;

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0 || amount > availableBalance) {
      toast.error('Invalid amount');
      return;
    }
    setRequesting(true);
    try {
      const res = await requestPayout(amount);
      setPayouts((prev) => [res.data.data, ...prev]);
      toast.success('Payout requested successfully');
      setShowModal(false);
      setPayoutAmount('');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to request payout'));
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Earnings & Payouts</h1>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-28" />
          ))}
        </div>
        <div className="bg-slate-100 animate-pulse rounded-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Earnings & Payouts</h1>
          <p className="text-sm text-slate-400 mt-0.5">Your store revenue and payout history</p>
        </div>
        <button onClick={() => { setPayoutAmount(availableBalance.toFixed(2)); setShowModal(true); }}
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
            iconColor: 'text-amber-100',
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
            iconColor: 'text-yellow-600',
          },
          {
            label: `Total Earned (${chartData.length}mo)`,
            value: `$${totalNet.toLocaleString()}`,
            sub: totalGross > 0 ? `After ${((totalCommission / totalGross) * 100).toFixed(0)}% platform commission` : 'No revenue yet',
            icon: TrendingUp,
            bg: 'bg-white border border-slate-100',
            text: 'text-slate-900',
            subText: 'text-slate-400',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
          },
        ].map(({ label, value, sub, icon: Icon, bg, text, subText, iconBg, iconColor }) => (
          <div key={label} className={`rounded-2xl p-5 ${bg} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={22} className={iconColor} />
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

        {chartData.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
            No revenue data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
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
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FCD34D', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="gross" name="Gross" stroke="#D97706" strokeWidth={2} fill="url(#grossGrad)" dot={false} />
              <Area type="monotone" dataKey="net"   name="Net"   stroke="#10B981" strokeWidth={2} fill="url(#netGrad)"   dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom: transactions + payouts */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Recent Transactions</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No transactions yet</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {transactions.map((tx) => {
                const amount = Number(tx.priceAtTime) * tx.quantity;
                const commission = amount * 0.1;
                return (
                  <div key={tx.id}>
                    {/* Sale credit */}
                    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <DollarSign size={16} className="text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {tx.product.name} — Order #{tx.order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(tx.order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <p className="text-sm font-black text-green-700 shrink-0">+${amount.toFixed(2)}</p>
                    </div>
                    {/* Commission debit */}
                    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <CreditCard size={16} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate">Platform commission (10%)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(tx.order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <p className="text-sm font-black text-red-600 shrink-0">-${commission.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payout history */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Payout History</h2>
          </div>
          {payouts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No payouts yet</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {payouts.map((p) => {
                const s = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;
                const Icon = s.icon;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color.split(' ')[0]}`}>
                      <Icon size={16} className={s.color.split(' ')[1]} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{p.reference ?? `PAY-${p.id.slice(-6).toUpperCase()}`}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {p.method}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-900">${Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payout request modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    max={availableBalance}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Payout Method</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <Building2 size={16} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Bank Transfer</p>
                      <p className="text-xs text-slate-400">Default payout method</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleRequestPayout} disabled={requesting}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                  {requesting ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />
                      Requesting...
                    </>
                  ) : 'Request Payout'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}