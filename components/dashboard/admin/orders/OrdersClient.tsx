"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import AdminDataTable, { Column } from "../Admindatatable";
import ConfirmModal from "../Confirmmodal";
import { getAllOrders, OrderDto } from "@/api/order.api";
import api from "@/api/axios";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";

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
  }
});

export default function OrdersClient({ initialOrders }: { initialOrders?: any[] }) {
  const [orders, setOrders] = useState<OrderDto[]>(() => (initialOrders || []).map(mapMockOrderToOrderDto));
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<OrderDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrderDto | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getAllOrders()
      .then((res) => {
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err, "Failed to load orders, using offline data."));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setProcessing(true);
    try {
      await api.delete<ApiResponse<null>>(`/orders/${deleteTarget.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      toast.success("Order removed");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete order"));
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<OrderDto>[] = [
    {
      key: "id",
      label: "Order #",
      sortable: true,
      render: (o) => <span className="font-medium text-slate-900">#{o.id}</span>,
    },
    {
      key: "customer" as any,
      label: "Customer",
      render: (o) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">
            {o.user?.name || (o as any).customerName}
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
            o.status === 'DELIVERED'
              ? "bg-emerald-100 text-emerald-700"
              : o.status === 'CANCELLED'
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
      render: (o) => <span className="font-medium">${Number(o.total).toFixed(2)}</span>,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (o) => (
        <span className="text-xs text-slate-400">
          {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  const actions = (o: OrderDto) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewOrder(o)}
        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors"
        title="View details"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={() => setDeleteTarget(o)}
        className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
        title="Delete order"
      >
        <X size={14} />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-14" />
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

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete order #${deleteTarget?.id}?`}
        description="This action cannot be undone. The order will be permanently removed."
        confirmLabel="Yes, Delete"
        danger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
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
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            >
              <button
                onClick={() => setViewOrder(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={15} />
              </button>
              <h3 className="font-bold text-xl text-slate-900 mb-4">Order #{viewOrder.id}</h3>
              <div className="space-y-2">
                <p><strong>Customer:</strong> {viewOrder.user?.name || (viewOrder as any).customerName}</p>
                <p><strong>Status:</strong> {viewOrder.status}</p>
                <p><strong>Total:</strong> ${Number(viewOrder.total).toFixed(2)}</p>
                <p><strong>Created:</strong> {new Date(viewOrder.createdAt).toLocaleString()}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}