"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
  type AdminCoupon,
} from "@/api/admin.api";
import { mapFormToPayload, type CouponFormData } from "./types";
import CouponStatsCards from "./components/CouponStatsCards";
import CouponTable from "./components/CouponTable";
import CouponFormModal from "./components/CouponFormModal";
import CouponDetailModal from "./components/CouponDetailModal";

export default function CouponsClient() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<AdminCoupon | null>(null);
  const [viewCoupon, setViewCoupon] = useState<AdminCoupon | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // ── Fetch coupons from API ───────────────────────────
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getAdminCoupons();
      setCoupons(res.data.data ?? []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filtered = coupons.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "ALL" || (filter === "ACTIVE" ? c.isActive : !c.isActive);
    return matchSearch && matchFilter;
  });

  const handleSave = async (data: CouponFormData) => {
    try {
      const payload = mapFormToPayload(data);
      if (editCoupon) {
        await updateAdminCoupon(editCoupon.id, payload);
        toast.success("Coupon updated");
        setEditCoupon(null);
      } else {
        await createAdminCoupon(payload as Parameters<typeof createAdminCoupon>[0]);
        toast.success("Coupon created");
      }
      await fetchCoupons();
    } catch {
      toast.error(editCoupon ? "Failed to update coupon" : "Failed to create coupon");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await toggleAdminCoupon(id);
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: res.data.data?.isActive ?? !c.isActive } : c)),
      );
      toast.success(
        res.data.data?.isActive ? "Coupon activated" : "Coupon deactivated",
      );
    } catch {
      toast.error("Failed to toggle coupon");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive).length,
    totalUsed: coupons.reduce((s, c) => s + c.usedCount, 0),
  };

  return (
    <div className="space-y-6">
      <CouponStatsCards
        total={stats.total}
        active={stats.active}
        totalUsed={stats.totalUsed}
      />

      <CouponTable
        coupons={coupons}
        filtered={filtered}
        loading={loading}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        onView={(coupon) => setViewCoupon(coupon)}
        onEdit={(coupon) => {
          setEditCoupon(coupon);
          setModal(true);
        }}
        onToggle={toggleStatus}
        onDelete={handleDelete}
        onNew={() => {
          setEditCoupon(null);
          setModal(true);
        }}
      />

      <CouponFormModal
        open={modal}
        initial={editCoupon}
        onSave={handleSave}
        onClose={() => {
          setModal(false);
          setEditCoupon(null);
        }}
      />

      {viewCoupon && (
        <CouponDetailModal
          coupon={viewCoupon}
          onClose={() => setViewCoupon(null)}
        />
      )}
    </div>
  );
}
