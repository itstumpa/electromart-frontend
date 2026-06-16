"use client";

import {
  adminCreateBanner,
  adminUpdateBanner,
  type BannerDto,
  type BannerType,
} from "@/src/services/api/banner.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  ImageIcon,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/* ── Props ─────────────────────────────────────────── */
type Props = {
  mode: "create" | "edit";
  initial?: BannerDto;
  onSave: () => void;
  onClose: () => void;
};

/* ── Predefined dropdown values ──────────────────── */

const BANNER_TYPES: BannerType[] = [
  "HOME_HERO_MAIN",
  "HOME_GRID_CELL",
  "HOME_PILL",
  "PRODUCT_HERO_SLIDE",
  "PRODUCT_FLOATING",
];

const GRADIENT_FROM = [
  "from-purple-950/85",
  "from-rose-950/90",
  "from-yellow-950/90",
  "from-cyan-950/90",
  "from-blue-950/90",
  "from-slate-950/90",
  "from-emerald-950/90",
];

const GRADIENT_VIA = [
  "via-purple-900/40",
  "via-rose-800/30",
  "via-yellow-800/20",
  "via-cyan-800/20",
  "via-blue-800/20",
  "via-slate-800/20",
  "via-emerald-800/20",
];

const BADGE_BG = [
  "bg-rose-500",
  "bg-yellow-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-600",
  "bg-amber-600",
  "bg-orange-500",
];

const PILL_SHADOW = [
  "shadow-rose-200",
  "shadow-yellow-200",
  "shadow-cyan-200",
  "shadow-blue-200",
  "shadow-emerald-200",
  "shadow-violet-200",
  "shadow-amber-200",
  "shadow-orange-200",
];

const SLIDE_BG_GRADIENT = [
  "from-amber-50 via-orange-50/50 to-yellow-50/30",
  "from-slate-50 via-amber-50/30 to-orange-50/20",
  "from-orange-50/60 via-amber-50 to-yellow-50/40",
];

const HERO_CTA_BG = [
  "bg-white hover:bg-purple-50 text-purple-900",
  "bg-white hover:bg-rose-50 text-rose-900",
  "bg-white hover:bg-blue-50 text-blue-900",
];

const HERO_ACCENT_COLOR = [
  "text-purple-300",
  "text-rose-300",
  "text-yellow-300",
  "text-cyan-300",
  "text-blue-300",
  "text-emerald-300",
];

const ICON_OPTIONS = [
  "Zap",
  "Truck",
  "Gift",
  "Tag",
  "RotateCcw",
  "Star",
  "Heart",
  "ShoppingBag",
];

/* ── Form fields helper ────────────────────────────── */

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select";
  placeholder?: string;
  options?: readonly string[];
  optional?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

/* ── Component ─────────────────────────────────────── */
export default function BannerForm({ mode, initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<Record<string, string | boolean | number>>(
    () => {
      if (initial) {
        const base: Record<string, string | boolean | number> = {
          type: initial.type,
          order: initial.order,
          isActive: initial.isActive,
          startsAt: initial.startsAt ? initial.startsAt.slice(0, 10) : "",
          expiresAt: initial.expiresAt ? initial.expiresAt.slice(0, 10) : "",
        };
        const stringFields = [
          "heroTitle", "heroLabel", "heroHref", "heroCtaText",
          "heroGradientFrom", "heroGradientVia", "heroAccentColor", "heroCtaBg",
          "gridLabel", "gridTitle", "gridHref", "gridOffer", "gridOfferIcon",
          "gridGradientFrom", "gridGradientVia", "gridBadgeBg",
          "pillLabel", "pillSub", "pillIcon", "pillBg", "pillShadow",
          "slideBadge", "slideTitle", "slideHighlight", "slideSubtitle",
          "slidePrice", "slideOriginalPrice", "slideDiscount", "slideBgGradient",
          "floatingName", "floatingPrice",
        ] as const;
        for (const k of stringFields) {
          base[k] = (initial as Record<string, unknown>)[k] as string ?? "";
        }
        base.floatingRating = initial.floatingRating ?? "";
        base.floatingReviews = initial.floatingReviews ?? "";
        return base;
      }
      return {
        type: "HOME_HERO_MAIN",
        order: 1,
        isActive: true,
        startsAt: "",
        expiresAt: "",
      };
    },
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedType = form.type as BannerType;

  const set = (key: string, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Conditional field sets ──────────────────────── */

  const COMMON_FIELDS: FieldDef[] = [];

  const HOME_HERO_MAIN_FIELDS: FieldDef[] = [
    { key: "heroTitle", label: "Hero Title", type: "textarea", placeholder: "Multi-line title…" },
    { key: "heroLabel", label: "Hero Label", type: "text", placeholder: "e.g. NEW ARRIVAL" },
    { key: "heroHref", label: "Hero Link", type: "text", placeholder: "/products/..." },
    { key: "heroCtaText", label: "CTA Text", type: "text", placeholder: "Shop Now" },
    { key: "heroGradientFrom", label: "Gradient From", type: "select", options: GRADIENT_FROM },
    { key: "heroGradientVia", label: "Gradient Via", type: "select", options: GRADIENT_VIA },
    { key: "heroAccentColor", label: "Accent Color", type: "select", options: HERO_ACCENT_COLOR },
    { key: "heroCtaBg", label: "CTA Button Style", type: "select", options: HERO_CTA_BG },
  ];

  const HOME_GRID_CELL_FIELDS: FieldDef[] = [
    { key: "gridLabel", label: "Grid Label", type: "text", placeholder: "e.g. BEST SELLER" },
    { key: "gridTitle", label: "Grid Title", type: "text", placeholder: "e.g. Wireless Earbuds" },
    { key: "gridHref", label: "Grid Link", type: "text", placeholder: "/products/..." },
    { key: "gridOffer", label: "Offer Text", type: "text", placeholder: "e.g. 20% OFF" },
    { key: "gridOfferIcon", label: "Offer Icon", type: "select", options: ICON_OPTIONS },
    { key: "gridGradientFrom", label: "Gradient From", type: "select", options: GRADIENT_FROM },
    { key: "gridGradientVia", label: "Gradient Via", type: "select", options: GRADIENT_VIA },
    { key: "gridBadgeBg", label: "Badge Background", type: "select", options: BADGE_BG },
  ];

  const HOME_PILL_FIELDS: FieldDef[] = [
    { key: "pillLabel", label: "Pill Label", type: "text", placeholder: "e.g. Free Delivery" },
    { key: "pillSub", label: "Pill Subtitle", type: "text", placeholder: "e.g. On all orders" },
    { key: "pillIcon", label: "Pill Icon", type: "select", options: ICON_OPTIONS },
    { key: "pillBg", label: "Pill Background", type: "select", options: BADGE_BG },
    { key: "pillShadow", label: "Pill Shadow", type: "select", options: PILL_SHADOW },
  ];

  const PRODUCT_HERO_SLIDE_FIELDS: FieldDef[] = [
    { key: "slideBadge", label: "Badge Text", type: "text", placeholder: "e.g. NEW RELEASE" },
    { key: "slideTitle", label: "Slide Title", type: "text", placeholder: "e.g. iPhone 15 Pro" },
    { key: "slideHighlight", label: "Highlight", type: "text", placeholder: "e.g. Titanium" },
    { key: "slideSubtitle", label: "Subtitle", type: "textarea", placeholder: "Description text…" },
    { key: "slidePrice", label: "Price", type: "text", placeholder: "৳159,999" },
    { key: "slideOriginalPrice", label: "Original Price", type: "text", placeholder: "৳179,999" },
    { key: "slideDiscount", label: "Discount Label", type: "text", placeholder: "11% OFF" },
    { key: "slideBgGradient", label: "Background Gradient", type: "select", options: SLIDE_BG_GRADIENT },
  ];

  const PRODUCT_FLOATING_FIELDS: FieldDef[] = [
    { key: "floatingName", label: "Product Name", type: "text", placeholder: "e.g. AirPods Pro" },
    { key: "floatingPrice", label: "Price", type: "text", placeholder: "৳29,999" },
    { key: "floatingRating", label: "Rating", type: "number", placeholder: "4.8", min: 0, max: 5, step: 0.1 },
    { key: "floatingReviews", label: "Review Count", type: "number", placeholder: "2340", min: 0 },
  ];

  const getTypeFields = (): FieldDef[] => {
    switch (selectedType) {
      case "HOME_HERO_MAIN": return HOME_HERO_MAIN_FIELDS;
      case "HOME_GRID_CELL": return HOME_GRID_CELL_FIELDS;
      case "HOME_PILL": return HOME_PILL_FIELDS;
      case "PRODUCT_HERO_SLIDE": return PRODUCT_HERO_SLIDE_FIELDS;
      case "PRODUCT_FLOATING": return PRODUCT_FLOATING_FIELDS;
      default: return [];
    }
  };

  /* ── Validation ────────────────────────────────── */
  const validate = (): boolean => {
    if (!selectedType) {
      toast.error("Banner type is required");
      return false;
    }
    return true;
  };

  /* ── Submit ─────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("type", selectedType);
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));

      if (form.startsAt) fd.append("startsAt", new Date(form.startsAt as string).toISOString());
      if (form.expiresAt) fd.append("expiresAt", new Date(form.expiresAt as string).toISOString());

      if (imageFile) fd.append("image", imageFile);

      const typeFields = getTypeFields();
      for (const f of typeFields) {
        const val = form[f.key];
        if (val !== "" && val !== undefined && val !== null) {
          fd.append(f.key, String(val));
        }
      }

      if (mode === "create") {
        await adminCreateBanner(fd);
        toast.success("Banner created successfully");
      } else if (initial) {
        await adminUpdateBanner(initial.id, fd);
        toast.success("Banner updated successfully");
      }

      onSave();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save banner"));
    } finally {
      setSaving(false);
    }
  };

  /* ── Render field ───────────────────────────────── */
  const renderField = (field: FieldDef) => {
    const value = form[field.key] ?? "";

    if (field.type === "textarea") {
      return (
        <div key={field.key}>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
            {field.label}
          </label>
          <textarea
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => set(field.key, e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
          />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.key}>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
            {field.label}
          </label>
          <select
            value={value as string}
            onChange={(e) => set(field.key, e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            <option value="">— Select —</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
          {field.label}
        </label>
        <input
          type={field.type}
          placeholder={field.placeholder}
          value={value as string | number}
          onChange={(e) =>
            set(
              field.key,
              field.type === "number" ? Number(e.target.value) : e.target.value,
            )
          }
          min={field.min}
          max={field.max}
          step={field.step}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>
    );
  };

  /* ── Render ─────────────────────────────────────── */
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
              <ImageIcon size={18} className="text-amber-700" />
            </div>
            <h3
              className="text-lg font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {mode === "create" ? "Create Banner" : "Edit Banner"}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                Banner Type *
              </label>
              <select
                value={form.type as string}
                onChange={(e) => set("type", e.target.value)}
                disabled={mode === "edit"}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {BANNER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                Order
              </label>
              <input
                type="number"
                placeholder="1"
                value={form.order as number}
                onChange={(e) => set("order", Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Active Status</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inactive banners are hidden from the frontend
                </p>
              </div>
              <button
                onClick={() => set("isActive", !form.isActive)}
                className="transition-colors"
                type="button"
              >
                {form.isActive ? (
                  <ToggleRight size={32} className="text-amber-600" />
                ) : (
                  <ToggleLeft size={32} className="text-slate-400" />
                )}
              </button>
            </div>

            {/* Date fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Starts At{" "}
                  <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={form.startsAt as string}
                  onChange={(e) => set("startsAt", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Expires At{" "}
                  <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={form.expiresAt as string}
                  onChange={(e) => set("expiresAt", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                Image{" "}
                <span className="text-slate-400 normal-case font-normal">(optional)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-colors"
              >
                {imagePreview ? (
                  <div className="relative w-full h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <ImageIcon size={28} className="text-slate-300" />
                    <p className="text-sm text-slate-400 font-medium">
                      Click to upload image
                    </p>
                    <p className="text-[10px] text-slate-300">
                      JPEG, PNG or WebP (max 2MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* ── Type-specific fields ── */}
            {getTypeFields().map(renderField)}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {mode === "create" ? "Create Banner" : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
