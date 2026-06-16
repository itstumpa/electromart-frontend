"use client";

import api from "@/src/services/api/axios";
import {
  getOrderTimeline,
  getVendorOrders,
  type TimelineEntryDto,
  type VendorOrderItemDto,
} from "@/src/services/api/order.api";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ItemStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const STATUS_OPTIONS: ItemStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
    icon: Clock,
  },
};

const getOrderUserLabel = (order: any) => {
  if (order.user?.id) return `User (${order.user.id})`;
  if (order.guestId) return `Guest (${order.guestId})`;
  return "Unknown User";
};

export default function VendorOrdersClient() {
  const [items, setItems] = useState<VendorOrderItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState<VendorOrderItemDto | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntryDto[]>(
    [],
  );
  const [timelineLoading, setTimelineLoading] = useState(false);

  useEffect(() => {
    if (!viewItem) {
      setTimelineEntries([]);
      return;
    }
    setTimelineLoading(true);
    getOrderTimeline(viewItem.orderId)
      .then((res) => setTimelineEntries(res.data.data?.timeline ?? []))
      .catch(() => setTimelineEntries([]))
      .finally(() => setTimelineLoading(false));
  }, [viewItem]);

  useEffect(() => {
    getVendorOrders()
      .then((res) => setItems(res.data.data ?? []))
      .catch((err) =>
        toast.error(getApiErrorMessage(err, "Failed to load orders")),
      )
      .finally(() => setLoading(false));
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = statusFilter
    ? items.filter((i) => i.status === statusFilter)
    : items;

  const updateStatus = async (itemId: string, status: ItemStatus) => {
    setUpdating(itemId);
    try {
      await api.patch<ApiResponse<null>>(
        `/orders/vendor/items/${itemId}/status`,
        { status },
      );
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status } : i)),
      );
      if (viewItem?.id === itemId)
        setViewItem((i) => (i ? { ...i, status } : null));
      toast.success("Status updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update status"));
    } finally {
      setUpdating(null);
    }
  };

  const revenue = items.reduce(
    (s, i) => s + Number(i.priceAtTime) * i.quantity,
    0,
  );
  const pending = items.filter((i) => i.status === "PENDING").length;
  const delivered = items.filter((i) => i.status === "DELIVERED").length;

  if (loading) {
    return (
      <div className="space-y-3">
        <h1
          className="text-2xl font-black text-slate-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Order Management
        </h1>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 animate-pulse rounded-2xl h-20"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1
              className="text-2xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Order Management
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {items.length} orders · $
              {revenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}{" "}
              revenue
            </p>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Total Orders",
              value: items.length,
              color: "text-slate-900",
              bg: "bg-white",
            },
            {
              label: "Pending",
              value: pending,
              color: "text-yellow-700",
              bg: "bg-yellow-50",
            },
            {
              label: "Delivered",
              value: delivered,
              color: "text-green-700",
              bg: "bg-green-50",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} rounded-2xl border border-slate-100 p-4 text-center`}
            >
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((item, i) => {
              const s = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;
              const isOpen = openDropdown === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all overflow-visible"
                >
                  <div className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-wrap">
                    {/* Product image */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url ?? item.productImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>

                    {/* Order info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-black text-amber-600">
                          #{item.orderId.slice(-6).toUpperCase()}
                        </p>
                        {/* Mobile-only price under order ID */}
                        <p className="sm:hidden text-sm font-black text-slate-900">
                          ${(Number(item.priceAtTime) * item.quantity).toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        <span className="sm:inline hidden">{getOrderUserLabel(item.order)} · </span>
                        {item.product.name} · qty{" "}
                        {item.quantity} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Total (desktop only) */}
                    <p className="hidden sm:block text-base font-black text-slate-900 shrink-0 whitespace-nowrap min-w-20 text-right">
                      ${(Number(item.priceAtTime) * item.quantity).toFixed(2)}
                    </p>

                    {/* Status update dropdown */}
                    <div className="relative shrink-0" data-dropdown>
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${s.color} hover:ring-2 hover:ring-offset-1 hover:ring-amber-300`}
                      >
                        {updating === item.id ? "Updating..." : "Update"}
                        <ChevronDown
                          size={11}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30">
                          {STATUS_OPTIONS.map((st) => {
                            const cfg = STATUS_CONFIG[st];
                            return (
                              <button
                                key={st}
                                onClick={() => {
                                  updateStatus(item.id, st);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-slate-50 ${item.status === st ? "bg-amber-50 text-amber-700" : "text-slate-700"}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${cfg.dot}`}
                                />
                                {cfg.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* View button */}
                    <button
                      onClick={() => setViewItem(item)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors shrink-0"
                    >
                      Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <ShoppingBag size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-semibold">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      <AnimatePresence>
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setViewItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">
                      Order Details
                    </p>
                    <h3 className="text-lg font-black text-slate-900">
                      #{viewItem.orderId.slice(-6).toUpperCase()}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewItem(null)}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Status update in modal */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    Update Status
                  </label>
                  <div className="relative">
                    <select
                      value={viewItem.status}
                      onChange={(e) =>
                        updateStatus(viewItem.id, e.target.value as ItemStatus)
                      }
                      disabled={updating === viewItem.id}
                      className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Product */}
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-4">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src={
                        viewItem.product.images?.[0]?.url ??
                        viewItem.productImage
                      }
                      alt={viewItem.product.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {viewItem.product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Qty: {viewItem.quantity}
                      {viewItem.variant ? ` · ${viewItem.variant}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-black text-slate-900 shrink-0">
                    $
                    {(Number(viewItem.priceAtTime) * viewItem.quantity).toFixed(
                      2,
                    )}
                  </p>
                </div>

                {/* ── Tracking timeline ── */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Order Tracking
                  </p>
                  {timelineLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                          <div className="h-4 bg-slate-200 animate-pulse rounded w-32" />
                        </div>
                      ))}
                    </div>
                  ) : timelineEntries.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No tracking updates available.
                    </p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-3.5 top-3.5 bottom-3.5 w-0.5 bg-slate-200" />
                      <div className="space-y-4">
                        {timelineEntries.map((entry, idx) => {
                          const ICONS: Record<string, React.ElementType> = {
                            PENDING: Clock,
                            PROCESSING: Package,
                            SHIPPED: Truck,
                            DELIVERED: CheckCircle2,
                            CANCELLED: X,
                          };
                          const LABELS: Record<string, string> = {
                            PENDING: "Pending",
                            PROCESSING: "Processing",
                            SHIPPED: "Shipped",
                            DELIVERED: "Delivered",
                            CANCELLED: "Cancelled",
                          };
                          const Icon = ICONS[entry.status] || Clock;
                          const isLast = idx === timelineEntries.length - 1;
                          const isCancelled = entry.status === "CANCELLED";
                          const label = LABELS[entry.status] || entry.status;
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center gap-3 relative"
                            >
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 z-10 ${
                                  isCancelled
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-600 text-white shadow-sm"
                                } ${isLast && !isCancelled ? "ring-2 ring-green-300 ring-offset-1" : ""}`}
                              >
                                <Icon size={13} />
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-bold ${isCancelled ? "text-red-600" : "text-slate-900"}`}
                                >
                                  {label}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {new Date(entry.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </p>
                                {entry.note && (
                                  <p className="text-xs text-slate-400/80 mt-0.5 italic">
                                    {entry.note}
                                  </p>
                                )}
                              </div>
                              {isLast && !isCancelled && (
                                <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer info */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-1 text-sm">
                  <p className="font-bold text-slate-700 mb-2">Customer</p>
                  <p className="text-slate-600">{viewItem.order.user?.name ?? "Guest"}</p>
                  <p className="text-slate-400 text-xs">
                    {viewItem.order.user?.email ?? "N/A"}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Ordered{" "}
                    {new Date(viewItem.order.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
