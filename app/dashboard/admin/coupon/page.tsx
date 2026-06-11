"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Copy,
  DollarSign,
  Eye,
  Hash,
  Loader2,
  Pencil,
  Percent,
  Plus,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
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

/* ── Types ─────────────────────────────────────────── */
export type DiscountType = "PERCENTAGE" | "FIXED";

// Re-export the API type for internal usage
type Coupon = AdminCoupon;

/* ── Coupon Form Modal ──────────────────────────────── */
interface CouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxDiscount: string;
  usageLimit: string;
  expiryDate: string;
  isActive: boolean;
}

const EMPTY_FORM: CouponFormData = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  expiryDate: "",
  isActive: true,
};

function couponToForm(c: Coupon): CouponFormData {
  return {
    code: c.code,
    discountType: c.discountType,
    discountValue: String(c.discountValue),
    minOrderAmount: c.minOrderAmount != null ? String(c.minOrderAmount) : "",
    maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : "",
    usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
    expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : "",
    isActive: c.isActive,
  };
}

function mapFormToPayload(data: CouponFormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    code: data.code,
    discountType: data.discountType,
    discountValue: Number(data.discountValue),
  };
  if (data.minOrderAmount) payload.minOrderAmount = Number(data.minOrderAmount);
  if (data.maxDiscount) payload.maxDiscount = Number(data.maxDiscount);
  if (data.usageLimit) payload.usageLimit = Number(data.usageLimit);
  if (data.expiryDate) payload.expiryDate = new Date(data.expiryDate).toISOString();
  payload.isActive = data.isActive;
  return payload;
}

function CouponModal({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Coupon | null;
  onSave: (data: CouponFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CouponFormData>(
    initial ? couponToForm(initial) : EMPTY_FORM,
  );

  const set = (key: keyof CouponFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!form.discountValue) {
      toast.error("Discount value is required");
      return;
    }
    onSave(form);
    onClose();
  };

  const fields: {
    key: keyof CouponFormData;
    label: string;
    placeholder: string;
    type?: string;
    optional?: boolean;
  }[] = [
    {
      key: "discountValue",
      label:
        form.discountType === "PERCENTAGE"
          ? "Discount Value (%)"
          : "Discount Value ($)",
      placeholder: form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 15",
    },
    {
      key: "minOrderAmount",
      label: "Minimum Order Amount ($)",
      placeholder: "e.g. 100",
      optional: true,
    },
    ...(form.discountType === "PERCENTAGE"
      ? [
          {
            key: "maxDiscount" as keyof CouponFormData,
            label: "Maximum Discount ($)",
            placeholder: "e.g. 50",
            optional: true,
          },
        ]
      : []),
    {
      key: "usageLimit",
      label: "Usage Limit",
      placeholder: "e.g. 100 (unlimited if empty)",
      optional: true,
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      placeholder: "",
      type: "date",
      optional: true,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={15} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Tag size={18} className="text-amber-700" />
              </div>
              <h3
                className="text-lg font-black text-slate-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {initial ? "Edit Coupon" : "Create Coupon"}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent uppercase"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Discount Type *
                </label>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  {(["PERCENTAGE", "FIXED"] as DiscountType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => set("discountType", type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                        form.discountType === type
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {type === "PERCENTAGE" ? (
                        <Percent size={14} />
                      ) : (
                        <DollarSign size={14} />
                      )}
                      {type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic fields */}
              {fields.map(({ key, label, placeholder, type, optional }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    {label}{" "}
                    {optional && (
                      <span className="text-slate-400 normal-case font-normal">
                        (optional)
                      </span>
                    )}
                  </label>
                  <input
                    type={type || "number"}
                    placeholder={placeholder}
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value)}
                    min={type === "date" ? undefined : 0}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              ))}

              {/* Active status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Active Status
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Inactive coupons cannot be applied
                  </p>
                </div>
                <button
                  onClick={() => set("isActive", !form.isActive)}
                  className="transition-colors"
                >
                  {form.isActive ? (
                    <ToggleRight size={32} className="text-amber-600" />
                  ) : (
                    <ToggleLeft size={32} className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors"
              >
                {initial ? "Save Changes" : "Create Coupon"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── View Modal ─────────────────────────────────────── */
function ViewModal({
  coupon,
  onClose,
}: {
  coupon: Coupon;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const usagePct = coupon.usageLimit
    ? Math.round((coupon.usedCount / coupon.usageLimit) * 100)
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={15} />
          </button>

          {/* Code badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Tag size={16} className="text-amber-700 shrink-0" />
              <span className="font-mono font-black text-amber-800 text-lg tracking-wider">
                {coupon.code}
              </span>
            </div>
            <button
              onClick={copy}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              {copied ? (
                <CheckCircle2 size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Discount",
                value:
                  coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`,
              },
              {
                label: "Type",
                value:
                  coupon.discountType === "PERCENTAGE"
                    ? "Percentage"
                    : "Fixed Amount",
              },
              ...(coupon.minOrderAmount != null
                ? [{ label: "Min Order", value: `$${coupon.minOrderAmount}` }]
                : []),
              ...(coupon.maxDiscount != null
                ? [{ label: "Max Discount", value: `$${coupon.maxDiscount}` }]
                : []),
              ...(coupon.expiryDate
                ? [
                    {
                      label: "Expires",
                      value: new Date(coupon.expiryDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      ),
                    },
                  ]
                : []),
              {
                label: "Status",
                value: coupon.isActive ? "Active" : "Inactive",
              },
              {
                label: "Created",
                value: new Date(coupon.createdAt).toLocaleDateString(),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-slate-50"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    label === "Status"
                      ? value === "Active"
                        ? "text-green-600"
                        : "text-slate-400"
                      : "text-slate-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}

            {/* Usage bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Usage
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} used
                </span>
              </div>
              {usagePct !== null && (
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${usagePct >= 100 ? "bg-red-500" : usagePct >= 80 ? "bg-amber-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Status Badge ───────────────────────────────────── */
function StatusBadge({ coupon }: { coupon: Coupon }) {
  const isExpired = coupon.expiryDate
    ? new Date(coupon.expiryDate) < new Date()
    : false;
  const isExhausted =
    coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit;

  if (isExpired)
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
        Expired
      </span>
    );
  if (isExhausted)
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
        Exhausted
      </span>
    );
  if (coupon.isActive)
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
        Active
      </span>
    );
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
      Inactive
    </span>
  );
}

/* ── Main Component ─────────────────────────────────── */
export default function CouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    } finally {
      setDeleteId(null);
    }
  };

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive).length,
    totalUsed: coupons.reduce((s, c) => s + c.usedCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Coupons",
            value: stats.total,
            icon: Tag,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Active",
            value: stats.active,
            icon: TrendingUp,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Total Used",
            value: stats.totalUsed,
            icon: Hash,
            color: "bg-blue-100 text-blue-700",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
            >
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f
                  ? "bg-amber-600 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setEditCoupon(null);
            setModal(true);
          }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
        >
          <Plus size={16} />
          New Coupon
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Code",
                  "Type",
                  "Value",
                  "Min Order",
                  "Usage",
                  "Expiry",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Loader2 size={32} className="text-slate-300 mx-auto mb-3 animate-spin" />
                      <p className="text-sm font-bold text-slate-400">
                        Loading coupons...
                      </p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Tag size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-400">
                        No coupons found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((coupon, i) => (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* Code */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg tracking-wider">
                          {coupon.code}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
                            coupon.discountType === "PERCENTAGE"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {coupon.discountType === "PERCENTAGE" ? (
                            <Percent size={10} />
                          ) : (
                            <DollarSign size={10} />
                          )}
                          {coupon.discountType === "PERCENTAGE"
                            ? "Percentage"
                            : "Fixed"}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-black text-slate-900">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}
                        </span>
                        {coupon.maxDiscount && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            max ${coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      {/* Min order */}
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {coupon.minOrderAmount ? (
                          `$${coupon.minOrderAmount}`
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {coupon.usedCount}
                            {coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                          </span>
                          {coupon.usageLimit && (
                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  coupon.usedCount / coupon.usageLimit >= 1
                                    ? "bg-red-500"
                                    : coupon.usedCount / coupon.usageLimit >=
                                        0.8
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5">
                        {coupon.expiryDate ? (
                          <span
                            className={`text-xs font-semibold flex items-center gap-1 ${
                              new Date(coupon.expiryDate) < new Date()
                                ? "text-red-500"
                                : "text-slate-600"
                            }`}
                          >
                            <Calendar size={11} />
                            {new Date(coupon.expiryDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                              },
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge coupon={coupon} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewCoupon(coupon)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setEditCoupon(coupon);
                              setModal(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => toggleStatus(coupon.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              coupon.isActive
                                ? "bg-green-50 hover:bg-green-100 text-green-600"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-400"
                            }`}
                            title={coupon.isActive ? "Deactivate" : "Activate"}
                          >
                            {coupon.isActive ? (
                              <ToggleRight size={13} />
                            ) : (
                              <ToggleLeft size={13} />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteId(coupon.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      <CouponModal
        open={modal}
        initial={editCoupon}
        onSave={handleSave}
        onClose={() => {
          setModal(false);
          setEditCoupon(null);
        }}
      />

      {viewCoupon && (
        <ViewModal coupon={viewCoupon} onClose={() => setViewCoupon(null)} />
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            >
              <h3 className="text-base font-black text-slate-900 mb-2">
                Delete Coupon?
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                This will permanently delete the coupon{" "}
                <span className="font-mono font-bold text-slate-800">
                  {coupons.find((c) => c.id === deleteId)?.code}
                </span>
                . This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
