"use client";

import { createAddress, getMyAddresses } from "@/api/address.api";
import {
  applyCartCoupon,
  applyGuestCartCoupon,
  getCart,
  getGuestCart,
  removeCartCoupon,
  removeGuestCartCoupon,
} from "@/api/cart.api";
import { placeGuestOrder, placeOrder } from "@/api/order.api";
import { initiatePayment, initiateGuestPayment } from "@/api/payment.api";
import type { Address, CartItem } from "@/data/types";
import { notifyCartUpdated } from "@/hooks/useCartCount";
import { mapAddressesToUi } from "@/lib/address-mappers";
import { mapCartItemsToUi } from "@/lib/cart-mappers";
import type { CreateAddressPayload } from "@/types/address";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  Home,
  Lock,
  MapPin,
  Plus,
  Shield,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────
type Step = "address" | "payment" | "review";

interface ShippingForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentForm {
  method: "card" | "cod" | "sslcommerz";
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

// ─── Step indicator ───────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "address", label: "Address", icon: MapPin },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "review", label: "Review", icon: ShoppingBag },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  done ? "bg-green-600 text-white" : "",
                  active
                    ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                    : "",
                  !done && !active ? "bg-slate-200 text-slate-400" : "",
                ].join(" ")}
              >
                {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <span
                className={`text-xs font-bold hidden sm:block ${active ? "text-amber-700" : done ? "text-green-700" : "text-slate-400"}`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors duration-300 ${i < idx ? "bg-green-500" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field outside AddressStep (fixes remount/typing bug) ────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  half,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  half?: boolean;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ─── Step 1: Address ──────────────────────────────────────────────────────────
function AddressStep({
  addresses,
  onNext,
  onAddressCreated,
  isGuest,
}: {
  addresses: Address[];
  onNext: (data: ShippingForm) => void;
  onAddressCreated: () => Promise<void>;
  isGuest?: boolean;
}) {
  const defaultId =
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "";
  const [useExisting, setUseExisting] = useState<string>(defaultId);
  const [showNewForm, setShowNewForm] = useState(addresses.length === 0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });

  const handleContinue = async () => {
    if (!showNewForm) {
      const addr = addresses.find((a) => a.id === useExisting);
      if (!addr) {
        toast.error("Please select a shipping address");
        return;
      }
      onNext({
        fullName: addr.fullName,
        phone: addr.phone,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
      });
    } else {
      if (
        !form.fullName ||
        !form.phone ||
        !form.street ||
        !form.city ||
        !form.zipCode
      )
        return;
      setSaving(true);
      try {
        if (!isGuest) {
          const payload: CreateAddressPayload = {
            label: "home",
            fullName: form.fullName,
            phone: form.phone,
            street: form.street,
            city: form.city,
            state: form.state,
            country: form.country,
            zipCode: form.zipCode,
            isDefault: addresses.length === 0,
          };
          await createAddress(payload);
          await onAddressCreated();
        }
        onNext(form);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to save address"));
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">
          Shipping Address
        </h2>
        <p className="text-sm text-slate-400">
          Where should we deliver your order?
        </p>
      </div>

      {/* Saved addresses */}
      {!showNewForm && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                useExisting === addr.id
                  ? "border-amber-600 bg-amber-50"
                  : "border-slate-200 bg-white hover:border-amber-300"
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={useExisting === addr.id}
                onChange={() => setUseExisting(addr.id)}
                className="mt-1 accent-amber-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {addr.label === "home" ? (
                    <Home size={14} className="text-amber-600" />
                  ) : (
                    <Briefcase size={14} className="text-blue-600" />
                  )}
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {addr.fullName}
                </p>
                <p className="text-sm text-slate-500">
                  {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p className="text-sm text-slate-400">{addr.phone}</p>
              </div>
            </label>
          ))}

          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-400 text-slate-500 hover:text-amber-700 text-sm font-semibold transition-all"
          >
            <Plus size={16} /> Use a different address
          </button>
        </div>
      )}

      {!showNewForm && addresses.length === 0 && (
        <p className="text-sm text-slate-500">
          No saved addresses. Add one below.
        </p>
      )}

      {/* New address form */}
      {showNewForm && (
        <motion.div className="space-y-4">
          {addresses.length > 0 && (
            <button
              onClick={() => setShowNewForm(false)}
              className="text-sm text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1"
            >
              ← Back to saved addresses
            </button>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Full Name"
              value={form.fullName}
              onChange={(v) => setForm({ ...form, fullName: v })}
              placeholder="John Smith"
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="+1 (555) 000-0000"
            />
            <Field
              label="Street Address"
              value={form.street}
              onChange={(v) => setForm({ ...form, street: v })}
              placeholder="123 Main Street, Apt 4B"
            />
            <Field
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              placeholder="New York"
              half
            />
            <Field
              label="State"
              value={form.state}
              onChange={(v) => setForm({ ...form, state: v })}
              placeholder="NY"
              half
            />
            <Field
              label="ZIP Code"
              value={form.zipCode}
              onChange={(v) => setForm({ ...form, zipCode: v })}
              placeholder="10001"
              half
            />
            <Field
              label="Country"
              value={form.country}
              onChange={(v) => setForm({ ...form, country: v })}
              placeholder="USA"
              half
            />
          </div>
        </motion.div>
      )}

      <button
        onClick={handleContinue}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-3.5 rounded-xl transition-colors shadow-md shadow-amber-200"
      >
        {saving ? (
          "Saving..."
        ) : (
          <>
            Continue to Payment <ChevronRight size={17} />
          </>
        )}
      </button>
    </div>
  );
}
// ─── Step 2: Payment ─────────────────────────────────────────
function PaymentStep({
  onNext,
  onBack,
}: {
  onNext: (data: PaymentForm) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<PaymentForm>({
    method: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/^(\d{2})(\d)/, "$1/$2");

  const handleContinue = () => {
    if (form.method === "cod" || form.method === "sslcommerz") {
      onNext(form);
      return;
    }
    if (!form.cardNumber || !form.cardName || !form.expiry || !form.cvv) return;
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
          { value: "card", label: "Credit / Debit Card", icon: CreditCard },
          { value: "sslcommerz", label: "Online Payment", icon: Globe },
          { value: "cod", label: "Cash on Delivery", icon: ShoppingBag },
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
                  method: value as "card" | "cod" | "sslcommerz",
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

      {/* Card details */}
      <AnimatePresence>
        {form.method === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {/* Card preview */}
            <div className="relative h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 rounded-2xl p-5 mb-5 overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 50%, #fff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute top-3 right-5 opacity-30">
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded-full bg-amber-400" />
                  <div className="w-8 h-8 rounded-full bg-amber-600 -ml-4" />
                </div>
              </div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                ElectroMart Pay
              </p>
              <p className="text-white font-mono text-base tracking-widest mb-4">
                {form.cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between">
                <div>
                  <p className="text-white/50 text-[9px] uppercase">
                    Card Holder
                  </p>
                  <p className="text-white text-xs font-bold">
                    {form.cardName || "YOUR NAME"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[9px] uppercase">Expires</p>
                  <p className="text-white text-xs font-bold">
                    {form.expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={(e) =>
                    setForm({ ...form, cardNumber: formatCard(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={form.cardName}
                  onChange={(e) =>
                    setForm({ ...form, cardName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) =>
                      setForm({ ...form, expiry: formatExpiry(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={form.cvv}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <Lock size={12} /> Your payment information is encrypted with SSL
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

// ─── Step 3: Review ───────────────────────────────────────────
function ReviewStep({
  address,
  payment,
  items,
  subtotal,
  shipping,
  tax,
  total,
  discountAmt,
  couponCode,
  onBack,
  onPlace,
}: {
  address: ShippingForm;
  payment: PaymentForm;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discountAmt: number;
  couponCode: string;
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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">
          Review Your Order
        </h2>
        <p className="text-sm text-slate-400">
          Double-check everything before placing your order.
        </p>
      </div>

      {/* Items */}
      <div className="bg-slate-50 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Items ({items.length})
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {item.productName}
                </p>
                {item.variant && (
                  <p className="text-xs text-slate-400">{item.variant}</p>
                )}
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-slate-900 shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Payment summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <MapPin size={12} /> Ship To
          </p>
          <p className="text-sm font-bold text-slate-900">{address.fullName}</p>
          <p className="text-sm text-slate-600">{address.street}</p>
          <p className="text-sm text-slate-600">
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p className="text-sm text-slate-400 mt-1">{address.phone}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CreditCard size={12} /> Payment
          </p>
          {payment.method === "card" ? (
            <>
              <p className="text-sm font-bold text-slate-900">
                Credit / Debit Card
              </p>
              <p className="text-sm text-slate-500 font-mono mt-1">
                •••• •••• •••• {payment.cardNumber.replace(/\s/g, "").slice(-4)}
              </p>
              <p className="text-sm text-slate-400">{payment.cardName}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-900">
                Cash on Delivery
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Pay when you receive your order
              </p>
            </>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {discountAmt > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag size={12} /> Coupon ({couponCode})
            </span>
            <span className="font-bold">-${discountAmt.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Tax (9%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-black text-base border-t border-slate-100 pt-2.5 mt-1">
          <span>Total</span>
          <span className="text-amber-700">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
        <Shield size={13} className="text-green-600 shrink-0" />
        Your order is protected by ElectroMart Buyer Protection.
      </div>

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
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<ShippingForm | null>(null);
  const [payment, setPayment] = useState<PaymentForm | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmt, setDiscountAmt] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isGuest, setIsGuest] = useState(false);

  const loadCheckoutData = useCallback(async () => {
    const user = (await import('@/utils/auth-storage')).authStorage.getAuthUser();
    const guest = !user;
    setIsGuest(guest);
    try {
      const cartProm = guest ? getGuestCart() : getCart();
      const addrProm = guest ? Promise.resolve({ data: { data: [] } }) : getMyAddresses();
      const [cartRes, addrRes] = await Promise.all([cartProm, addrProm]);
      const cartData = cartRes.data.data;
      setCartItems(mapCartItemsToUi(cartData?.items ?? []));
      setAddresses(mapAddressesToUi(addrRes.data.data ?? []));
      // Sync coupon state from backend — cart is the source of truth
      setCouponCode(cartData?.couponCode ?? "");
      setCouponInput(cartData?.couponCode ?? "");
      setDiscountAmt(cartData?.discountAmount ?? 0);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load checkout"));
      setCartItems([]);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  const applyCouponHandler = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponApplying(true);
    try {
      if (isGuest) {
        await applyGuestCartCoupon(code);
      } else {
        await applyCartCoupon(code);
      }
      await loadCheckoutData();
      setCouponError("");
      toast.success("Coupon applied successfully");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Invalid coupon code");
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponApplying(false);
    }
  };

  const removeCheckoutCoupon = async () => {
    try {
      if (isGuest) {
        await removeGuestCartCoupon();
      } else {
        await removeCartCoupon();
      }
      await loadCheckoutData();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove coupon"));
    }
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 14.99;
  const tax = Math.max(0, (subtotal - discountAmt) * 0.09);
  const total = subtotal - discountAmt + shipping + tax;

  const [guestInfo, setGuestInfo] = useState({
    guestEmail: "",
    guestName: "",
    guestPhone: "",
  });

  const handlePlaceOrder = async () => {
    if (!address || !payment) return;
    try {
      let orderRes;
      if (isGuest) {
        if (!guestInfo.guestEmail || !guestInfo.guestName || !guestInfo.guestPhone) {
          toast.error("Please fill in your contact information");
          return;
        }
        orderRes = await placeGuestOrder({
          guestEmail: guestInfo.guestEmail,
          guestName: guestInfo.guestName,
          guestPhone: guestInfo.guestPhone,
          shippingAddress: {
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
          },
          couponCode: couponCode || undefined,
        });
      } else {
        orderRes = await placeOrder(
          {
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
          },
          couponCode || undefined,
        );
      }
      const order = orderRes.data.data;
      if (!order?.id) throw new Error("Order not created");
      notifyCartUpdated();

      if (payment.method === "cod") {
        router.push(`/order-confirmation/${order.id}`);
        return;
      }

      const payRes = isGuest
        ? await initiateGuestPayment({
            orderId: order.id,
            gateway: "SSLCOMMERZ",
          })
        : await initiatePayment({
            orderId: order.id,
            gateway: "SSLCOMMERZ",
          });
      const gatewayUrl = payRes.data.data?.gatewayUrl as string | undefined;
      if (gatewayUrl) {
        window.location.href = gatewayUrl;
        return;
      }
      // If no gateway URL (payment already processed), redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to place order"));
      throw err;
    }
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <p className="text-slate-500 font-medium">Loading checkout...</p>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div className="min-h-screen bg-[#FFFBEB] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-slate-600 font-semibold">Your cart is empty</p>
        <Link
          href="/cart"
          className="text-amber-600 font-bold hover:text-amber-700"
        >
          Back to cart
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={11} />
            <Link
              href="/cart"
              className="hover:text-amber-600 transition-colors"
            >
              Cart
            </Link>
            <ChevronRight size={11} />
            <span className="text-slate-700 font-semibold capitalize">
              Checkout
            </span>
          </div>
          <h1
            className="text-2xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Form area ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === "address" && (
                    <>
                      {isGuest && (
                        <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">
                              Contact Information
                            </h3>
                            <p className="text-xs text-amber-700 mt-0.5">
                              You&apos;ll use this to track your order later.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                placeholder="you@example.com"
                                value={guestInfo.guestEmail}
                                onChange={(e) =>
                                  setGuestInfo({ ...guestInfo, guestEmail: e.target.value })
                                }
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                              />
                            </div>
                            <Field
                              label="Full Name *"
                              value={guestInfo.guestName}
                              onChange={(v) => setGuestInfo({ ...guestInfo, guestName: v })}
                              placeholder="John Smith"
                            />
                            <Field
                              label="Phone *"
                              value={guestInfo.guestPhone}
                              onChange={(v) => setGuestInfo({ ...guestInfo, guestPhone: v })}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      )}
                      <AddressStep
                        addresses={addresses}
                        onAddressCreated={loadCheckoutData}
                        isGuest={isGuest}
                        onNext={(data) => {
                          setAddress(data);
                          setStep("payment");
                        }}
                      />
                    </>
                  )}
                  {step === "payment" && (
                    <PaymentStep
                      onNext={(data) => {
                        setPayment(data);
                        setStep("review");
                      }}
                      onBack={() => setStep("address")}
                    />
                  )}
                  {step === "review" && address && payment && (
                    <ReviewStep
                      address={address}
                      payment={payment}
                      items={cartItems}
                      subtotal={subtotal}
                      shipping={shipping}
                      tax={tax}
                      total={total}
                      discountAmt={discountAmt}
                      couponCode={couponCode}
                      onBack={() => setStep("payment")}
                      onPlace={handlePlaceOrder}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Mini order summary (sticky) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
              <h3 className="font-black text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.productName}
                      </p>
                      {item.variant && (
                        <p className="text-[10px] text-slate-400">
                          {item.variant}
                        </p>
                      )}
                    </div>
                    <p className="text-xs font-black text-slate-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={11} /> {couponCode}
                    </span>
                    <span className="font-bold">
                      -${discountAmt.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-base border-t border-slate-100 pt-2">
                  <span>Total</span>
                  <span className="text-amber-700">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon section */}
              <div className="mt-4">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span className="text-xs font-bold text-green-800">
                        {couponCode} — ${discountAmt.toFixed(2)} off
                      </span>
                    </div>
                    <button
                      onClick={removeCheckoutCoupon}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && applyCouponHandler()
                        }
                        placeholder="Coupon code"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition placeholder-slate-400"
                      />
                      <button
                        onClick={applyCouponHandler}
                        disabled={couponApplying}
                        className="px-3 py-2 bg-slate-900 hover:bg-amber-600 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        {couponApplying ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-500 font-medium mt-1">
                        {couponError}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
