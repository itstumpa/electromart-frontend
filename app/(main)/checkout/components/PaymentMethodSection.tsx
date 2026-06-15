"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  Lock,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────
interface PaymentForm {
  method: "stripe" | "cod" | "sslcommerz";
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

// ─── PaymentMethodSection ────────────────────────────────────
export default function PaymentMethodSection({
  onNext,
  onBack,
}: {
  onNext: (data: PaymentForm) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<PaymentForm>({
    method: "cod",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleContinue = () => {
    onNext(form);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">
          Payment Method
        </h2>
        <p className="text-sm text-slate-400">
          All transactions are encrypted and secure.
        </p>
      </div>

      {/* Method selection */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: "cod", label: "Cash on Delivery", icon: ShoppingBag },
          { value: "stripe", label: "Stripe", icon: CreditCard },
          { value: "sslcommerz", label: "Online Payment", icon: Globe },
        ].map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
              form.method === value
                ? "border-amber-600 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white hover:border-amber-300 text-slate-600"
            }`}
          >
            <input
              type="radio"
              name="method"
              value={value}
              checked={form.method === value}
              onChange={() =>
                setForm({
                  ...form,
                  method: value as "stripe" | "cod" | "sslcommerz",
                })
              }
              className="sr-only"
            />
            <Icon
              size={22}
              className={
                form.method === value ? "text-amber-600" : "text-slate-400"
              }
            />
            <span className="text-xs font-bold">{label}</span>
          </label>
        ))}
      </div>

      {/* Stripe info */}
      <AnimatePresence>
        {form.method === "stripe" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                <span className="text-sm font-bold text-purple-800">
                  Pay via Stripe
                </span>
              </div>
              <p className="text-sm text-purple-700">
                You&apos;ll be redirected to Stripe&apos;s secure checkout
                page. Supports all major credit and debit cards.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-purple-500 pt-1">
                <Lock size={11} /> Secured by Stripe
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SSLCommerz info */}
      <AnimatePresence>
        {form.method === "sslcommerz" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-800">
                  Pay via SSLCommerz
                </span>
              </div>
              <p className="text-sm text-blue-700">
                You&apos;ll be redirected to SSLCommerz&apos;s secure payment
                page. Supports bKash, Nagad, Rocket, cards, and more.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-blue-500 pt-1">
                <Lock size={11} /> Secured by SSLCommerz
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COD info */}
      {form.method === "cod" && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-amber-800 font-medium">
          💵 Pay in cash when your order arrives. Have the exact amount ready.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-5 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3 rounded-xl transition-colors shadow-md shadow-amber-200"
        >
          Review Order <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
