"use client";

import { getLeaderboard, type LeaderboardEntryDto } from "@/src/services/api/leaderboard.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronRight, ShoppingBag, Star, Package, DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RANK_COLORS = [
  { bg: "bg-amber-50 border-amber-300", medal: "text-amber-500", rankBg: "bg-amber-500", label: "Gold" },
  { bg: "bg-slate-50 border-slate-300", medal: "text-slate-400", rankBg: "bg-slate-400", label: "Silver" },
  { bg: "bg-orange-50 border-orange-300", medal: "text-orange-600", rankBg: "bg-orange-500", label: "Bronze" },
];

export default function LeaderboardClient() {
  const [entries, setEntries] = useState<LeaderboardEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    getLeaderboard()
      .then((res) => setEntries(res.data.data ?? []))
      .catch((err) => {
        const msg = getApiErrorMessage(err, "Failed to load leaderboard");
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="h-4 bg-slate-200 rounded w-96" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <TrendingUp size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-semibold mb-4">Failed to load leaderboard</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Award size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-semibold">No vendor leaderboard data available yet.</p>
            <p className="text-slate-400 text-sm mt-1">Data will appear once vendors have sales and reviews.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award size={28} className="text-amber-600" />
            <h1
              className="text-2xl sm:text-3xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Vendor Leaderboard
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Top-performing vendors ranked by revenue, orders, and customer ratings
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {entries.slice(0, 3).map((entry, index) => {
            const rankStyle = RANK_COLORS[index];
            const rank = index + 1;
            const position = index === 0 ? "order-2" : index === 1 ? "order-1 sm:order-1" : "order-3";
            return (
              <div
                key={entry.storeId}
                className={`${position} ${rankStyle.bg} rounded-2xl border-2 ${rankStyle.bg.split(" ")[1]} p-5 sm:p-6 text-center relative overflow-hidden`}
              >
                {/* Crown/medal */}
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 rounded-full ${rankStyle.rankBg} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-black text-lg">{rank}</span>
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-lg truncate">{entry.storeName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">by {entry.owner.name}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-black text-slate-900">${entry.totalRevenue.toLocaleString()}</p>
                    <p className="text-slate-400">Revenue</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{entry.totalOrders}</p>
                    <p className="text-slate-400">Orders</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{entry.averageRating}</p>
                    <p className="text-slate-400">Rating</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{entry.totalProducts}</p>
                    <p className="text-slate-400">Products</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full ranking table */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          {/* Table header (desktop) */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Store</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2 text-right">Revenue</div>
            <div className="col-span-1 text-right">Orders</div>
            <div className="col-span-1 text-center">Rating</div>
            <div className="col-span-1 text-right">Products</div>
            <div className="col-span-1 text-right">Score</div>
          </div>

          <AnimatePresence initial={false}>
            {entries.map((entry, i) => {
              const isTop3 = i < 3;
              return (
                <motion.div
                  key={entry.storeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 px-5 py-4 items-center border-b border-slate-50 last:border-0 hover:bg-amber-50/50 transition-colors ${
                    isTop3 ? "bg-amber-50/30" : ""
                  }`}
                >
                  {/* Rank (desktop) */}
                  <div className="hidden sm:flex col-span-1 items-center gap-2">
                    {isTop3 ? (
                      <span className={`text-sm font-black ${RANK_COLORS[i].medal}`}>#{i + 1}</span>
                    ) : (
                      <span className="text-sm font-bold text-slate-400">#{i + 1}</span>
                    )}
                  </div>

                  {/* Mobile card content */}
                  <div className="sm:hidden flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {isTop3 ? (
                        <span className={`text-sm font-black ${RANK_COLORS[i].medal}`}>#{i + 1}</span>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">#{i + 1}</span>
                      )}
                      <h3 className="font-black text-slate-900 text-sm">{entry.storeName}</h3>
                    </div>
                    <span className="text-xs text-slate-400">by {entry.owner.name}</span>
                  </div>

                  {/* Store (desktop) */}
                  <div className="hidden sm:flex col-span-3 items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">{entry.storeName}</span>
                  </div>

                  {/* Owner (desktop) */}
                  <div className="hidden sm:block col-span-2 text-sm text-slate-500 truncate">
                    {entry.owner.name}
                  </div>

                  {/* Stats */}
                  <div className="sm:hidden grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <DollarSign size={12} className="inline text-slate-400" />
                      <span className="font-bold text-slate-900 ml-0.5">${entry.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <ShoppingBag size={12} className="inline text-slate-400" />
                      <span className="font-bold text-slate-900 ml-0.5">{entry.totalOrders}</span>
                    </div>
                    <div>
                      <Star size={12} className="inline text-slate-400" />
                      <span className="font-bold text-slate-900 ml-0.5">{entry.averageRating}</span>
                    </div>
                    <div>
                      <Package size={12} className="inline text-slate-400" />
                      <span className="font-bold text-slate-900 ml-0.5">{entry.totalProducts}</span>
                    </div>
                  </div>

                  {/* Desktop stat columns */}
                  <div className="hidden sm:block col-span-2 text-right text-sm font-bold text-slate-900">
                    ${entry.totalRevenue.toLocaleString()}
                  </div>
                  <div className="hidden sm:block col-span-1 text-right text-sm font-bold text-slate-900">
                    {entry.totalOrders}
                  </div>
                  <div className="hidden sm:flex col-span-1 justify-center">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-slate-900">{entry.averageRating}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block col-span-1 text-right text-sm text-slate-600">
                    {entry.totalProducts}
                  </div>
                  <div className="hidden sm:block col-span-1 text-right text-sm font-mono text-slate-500">
                    {Math.round(entry.score)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
