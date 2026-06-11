"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getPromotionalCoupons, type PromoCoupon } from "@/api/coupon.api";

export default function TopBar() {
  const [visible, setVisible] = useState(true);
  const [promo, setPromo] = useState<PromoCoupon | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPromotionalCoupons()
      .then((res) => {
        const coupons = res.data.data ?? [];
        setPromo(coupons.length > 0 ? coupons[0] : null);
      })
      .catch(() => setPromo(null))
      .finally(() => setLoaded(true));
  }, []);

  const discountText = promo
    ? promo.discountType === "PERCENTAGE"
      ? `${promo.discountValue}% off`
      : `$${promo.discountValue} off`
    : "";

  if (!loaded) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-amber-600 text-white overflow-hidden"
        >
          <div className="container mx-auto px-4 h-9 flex items-center justify-between text-sm">
            {/* Left spacer */}
            <div className="w-6 hidden sm:block" />

            {/* Center message */}
            <div className="flex items-center gap-2 font-medium tracking-wide flex-1 justify-center">
              <Tag size={14} className="shrink-0" />
              {promo ? (
                <>
                  {/* Mobile: short version */}
                  <span className="text-amber-50 text-xs sm:hidden">
                    Use code{" "}
                    <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white tracking-widest">
                      {promo.code}
                    </span>{" "}
                    for {discountText}
                  </span>
                  {/* Desktop: full version */}
                  <span className="text-amber-50 text-sm hidden sm:inline">
                    Free shipping on orders over{" "}
                    <span className="font-bold text-white">$99</span>
                    &nbsp;·&nbsp; Use code{" "}
                    <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white tracking-widest">
                      {promo.code}
                    </span>{" "}
                    for {discountText} on your first order
                  </span>
                </>
              ) : (
                <>
                  {/* Mobile — no promo */}
                  <span className="text-amber-50 text-xs sm:hidden">
                    Free shipping on orders over $99
                  </span>
                  {/* Desktop — no promo */}
                  <span className="text-amber-50 text-sm hidden sm:inline">
                    Free shipping on orders over{" "}
                    <span className="font-bold text-white">$99</span>
                  </span>
                </>
              )}
            </div>

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="text-amber-200 hover:text-white transition-colors shrink-0 p-1 rounded"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
