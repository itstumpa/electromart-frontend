import type { AdminCoupon } from "@/api/admin.api";

/* ── Status Badge ───────────────────────────────────── */
export default function CouponStatusBadge({
  coupon,
}: {
  coupon: AdminCoupon;
}) {
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
