"use client";

import { createAddress } from "@/src/services/api/address.api";
import type { Address } from "@/data/types";
import type { CreateAddressPayload } from "@/types/address";
import { getApiErrorMessage } from "@/utils/api-error";
import { motion } from "framer-motion";
import { Briefcase, ChevronRight, Home, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────
interface ShippingForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ─── Field component ─────────────────────────────────────────
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

// ─── ShippingAddressSection ──────────────────────────────────
export default function ShippingAddressSection({
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
