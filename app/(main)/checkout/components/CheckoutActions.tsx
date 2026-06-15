"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

// ─── CheckoutActions ─────────────────────────────────────────
export default function CheckoutActions({
  total,
  onBack,
  onPlace,
}: {
  total: number;
  onBack: () => void;
  onPlace: () => Promise<void>;
}) {
  const [placing, setPlacing] = useState(false);

  const handlePlace = async () => {
    setPlacing(true);
    try {
      await onPlace();
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 px-5 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
      >
        <ChevronLeft size={16} /> Back
      </button>
      <motion.button
        onClick={handlePlace}
        disabled={placing}
        whileTap={{ scale: 0.97 }}
        className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-3 rounded-xl transition-colors shadow-md shadow-amber-200"
      >
        {placing ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
            />
            Placing Order...
          </>
        ) : (
          <>Place Order — ${total.toFixed(2)}</>
        )}
      </motion.button>
    </div>
  );
}
