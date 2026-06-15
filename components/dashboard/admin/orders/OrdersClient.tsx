"use client";

import { adminCancelOrder, getAllOrders, getOrderTimeline, OrderDto, updateOrderItemStatus } from "@/api/order.api";
import type { TimelineEntryDto } from "@/api/order.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Clock, Eye, Package, Truck, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminDataTable, { Column } from "../Admindatatable";

type ItemStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_OPTIONS: ItemStatus[] = [
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

const getAdminOrderUserLabel = (order: any) => {
  if (order.user?.id) return `User (${order.user.id})`;
  if (order.guestId) return `Guest (${order.guestId})`;
  return order.customerName || "Unknown User";
};

const mapMockOrderToOrderDto = (o: any): OrderDto => ({
  id: o.id,
  userId: o.customerId,
  status: (o.status || "PENDING").toUpperCase() as any,
  subtotal: o.subtotal,
  shippingCost: o.shippingCost,
  tax: o.tax,
  discount: o.discount,
  total: o.total,
  currency: "USD",
  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
  items: (o.items || []).map((item: any, idx: number) => ({
    id: `${o.id}-item-${idx}`,
    orderId: o.id,
    productId: item.productId,
    storeId: item.vendorId,
    quantity: item.quantity,
    productImage: item.productImage,
    priceAtTime: item.price,
    status: (o.status || "PENDING").toUpperCase(),
    createdAt: o.createdAt,
  })),
  user: {
    id: o.customerId,
    name: o.customerName,
    email: o.customerEmail,
  },
});

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders?: any[];
}) {
  const [orders, setOrders] = useState<OrderDto[]>(() =>
    (initialOrders || []).map(mapMockOrderToOrderDto),
  );
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<OrderDto | null>(null);
  const [cancelTarget, setCancelTarget] = useState<OrderDto | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntryDto[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  // Load timeline when viewing an order
  useEffect(() => {
    if (!viewOrder) {
      setTimelineEntries([]);
      return;
    }
    setTimelineLoading(true);
    getOrderTimeline(viewOrder.id)
      .then((res) => setTimelineEntries(res.data.data?.timeline ?? []))
      .catch(() => setTimelineEntries([]))
      .finally(() => setTimelineLoading(false));
  }, [viewOrder]);

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

  useEffect(() => {
    getAllOrders()
      .then((res) => {
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      })
      .catch((err) => {
        toast.error(
          getApiErrorMessage(err, "Failed to load orders, using offline data."),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateItemStatus = async (itemId: string, status: ItemStatus) => {
    setUpdatingItem(itemId);
    try {
      await updateOrderItemStatus(itemId, status);
      setOrders((prev) =>
        prev.map((o) => ({
          ...o,
          items: o.items.map((item) =>
            item.id === itemId ? { ...item, status } : item,
          ),
        })),
      );
      if (viewOrder) {
        setViewOrder((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((item) =>
                  item.id === itemId ? { ...item, status } : item,
                ),
              }
            : null,
        );
      }
      toast.success("Delivery status updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update status"));
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    setIsCancelling(true);
    try {
      await adminCancelOrder(cancelTarget.id, cancelReason.trim());
      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelTarget!.id ? { ...o, status: "CANCELLED" } : o,
        ),
      );
      toast.success("Order cancelled successfully");
      if (viewOrder?.id === cancelTarget.id) {
        setViewOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      }
      setCancelReason("");
      setCancelTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to cancel order"));
    } finally {
      setIsCancelling(false);
    }
  };

  const columns: Column<OrderDto>[] = [
    {
      key: "id",
      label: "Order #",
      sortable: true,
      render: (o) => (
        <span className="font-medium text-slate-900">#{o.id}</span>
      ),
    },
    {
      key: "customer" as any,
      label: "Customer",
      render: (o) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">
            {getAdminOrderUserLabel(o)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (o) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            o.status === "DELIVERED"
              ? "bg-emerald-100 text-emerald-700"
              : o.status === "CANCELLED"
                ? "bg-red-100 text-red-600"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {o.status}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (o) => (
        <span className="font-medium">${Number(o.total).toFixed(2)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (o) => (
        <span className="text-xs text-slate-400">
          {new Date(o.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const actions = (o: OrderDto) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          setViewOrder(o);
        }}
        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors"
        title="View details"
      >
        <Eye size={14} />
      </button>
      {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
        <button
          onClick={() => {
            setCancelTarget(o);
            setCancelReason("");
          }}
          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
          title="Cancel order"
        >
          <XCircle size={14} />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 animate-pulse rounded-2xl h-14"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <AdminDataTable
        data={orders}
        columns={columns}
        searchKeys={["id", "user.name", "customerName"] as any[]}
        searchPlaceholder="Search orders..."
        actions={actions}
        pageSize={8}
        emptyMessage="No orders available."
      />

      {/* View order modal */}
      <AnimatePresence>
        {viewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setViewOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">
                      Order Details
                    </p>
                    <h3 className="text-lg font-black text-slate-900">
                      Order #{viewOrder.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewOrder(null)}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-6 ${
                    viewOrder.status === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-700"
                      : viewOrder.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {viewOrder.status}
                </span>

                {/* ── Customer Information ── */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Customer Information
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Name</span>
                      <p className="font-medium text-slate-800">
                        {viewOrder.user?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Email</span>
                      <p className="font-medium text-slate-800">
                        {viewOrder.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone</span>
                      <p className="font-medium text-slate-800">
                        {viewOrder.user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Store Information ── */}
                {viewOrder.items?.some((i) => i.store?.name) && (
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Store Information
                    </p>
                    <div className="space-y-2 text-sm">
                      {[
                        ...new Set(
                          viewOrder.items
                            .filter((i) => i.store?.name)
                            .map((i) => i.store!.name),
                        ),
                      ].map((storeName, idx) => (
                        <div key={idx} className="font-medium text-slate-800">
                          {storeName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Order Information ── */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Order Information
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Order ID</span>
                      <p className="font-medium text-slate-800 font-mono text-xs">
                        #{viewOrder.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Status</span>
                      <p className="font-medium text-slate-800">
                        {viewOrder.status}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Payment Status</span>
                      <p className="font-medium text-slate-800">
                        {viewOrder.payment?.status || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Payment Method</span>
                      <p className="font-medium text-slate-800 capitalize">
                        {viewOrder.payment?.method?.replace(/_/g, " ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Order Date</span>
                      <p className="font-medium text-slate-800">
                        {new Date(viewOrder.createdAt).toLocaleDateString(
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
                    </div>
                    <div>
                      <span className="text-slate-400">Total Amount</span>
                      <p className="font-bold text-slate-900">
                        ${Number(viewOrder.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Products (with delivery status) ── */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Products
                  </p>
                  <div className="space-y-3">
                    {viewOrder.items?.map((item, idx) => {
                      const s = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;
                      const isOpen = openDropdown === item.id;
                      return (
                        <div
                          key={item.id || idx}
                          className="bg-white rounded-xl p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.product?.name || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={20} className="text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                {item.product?.name || `Product #${item.productId}`}
                              </p>
                              <p className="text-xs text-slate-400">
                                {item.store?.name && `by ${item.store.name}`}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-medium text-slate-800">
                                ${Number(item.priceAtTime).toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right shrink-0 min-w-[72px]">
                              <p className="text-sm font-bold text-slate-900">
                                $
                                {(Number(item.priceAtTime) * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-400">Subtotal</p>
                            </div>
                          </div>
                          {/* Delivery status row */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Delivery:
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                {s.label}
                              </span>
                            </div>
                            <div className="relative shrink-0" data-dropdown>
                              <button
                                onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                                className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all ${s.color} hover:ring-2 hover:ring-offset-1 hover:ring-amber-300`}
                              >
                                {updatingItem === item.id ? "Updating..." : "Update"}
                                <ChevronDown
                                  size={10}
                                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              {isOpen && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30">
                                  {STATUS_OPTIONS.map((st) => {
                                    const cfg = STATUS_CONFIG[st];
                                    return (
                                      <button
                                        key={st}
                                        onClick={() => {
                                          handleUpdateItemStatus(item.id, st);
                                          setOpenDropdown(null);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors hover:bg-slate-50 ${item.status === st ? "bg-amber-50 text-amber-700" : "text-slate-700"}`}
                                      >
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        {cfg.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Order Tracking Timeline ── */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
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

                {/* ── Shipping Information ── */}
                {viewOrder.shipping && (
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Shipping Address
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-400">Full Name</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.fullName}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Phone</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.phone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400">Address</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.street}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">City</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.city}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">State</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.state}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Zip Code</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.zipCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Country</span>
                        <p className="font-medium text-slate-800">
                          {viewOrder.shipping.country}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Cancellation Reason (view-only) ── */}
                {viewOrder.status === "CANCELLED" && (
                  <div className="bg-red-50 rounded-2xl p-4 mb-4">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">
                      Cancellation Details
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {viewOrder.statusHistory?.find(
                        (h) => h.status === "CANCELLED",
                      )?.note || "No cancellation reason provided."}
                    </p>
                  </div>
                )}

                {/* ── Close button ── */}
                <button
                  onClick={() => setViewOrder(null)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel order modal */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setCancelTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-0.5">
                      Cancel Order
                    </p>
                    <h3 className="text-lg font-black text-slate-900">
                      Order #{cancelTarget.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCancelTarget(null)}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>

                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setCancelTarget(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isCancelling ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                        />
                        Cancelling...
                      </>
                    ) : (
                      "Confirm Cancellation"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
