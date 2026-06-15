"use client";

// ─── DeliveryMethodSection ───────────────────────────────────
export default function DeliveryMethodSection({
  shipping,
}: {
  shipping: number;
}) {
  return (
    <div className="flex justify-between text-slate-500">
      <span>Shipping</span>
      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
    </div>
  );
}
