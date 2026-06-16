"use client";

import { getCategories, mapCategoriesToListItems } from "@/src/services/api/category.api";
import { getBrands } from "@/src/services/api/brand.api";
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  toggleProductVisibility,
  updateProduct,
  type CreateProductDto,
  type ProductImageResponse,
} from "@/src/services/api/product.api";
import ConfirmModal from "@/components/dashboard/admin/Confirmmodal";
import ProductImageManager from "@/components/dashboard/vendor/ProductImageManager";
import { toNumber, type ProductListItemDto } from "@/types/product";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import RichTextEditor from "@/components/ui/RichTextEditor";

// ─── Form types ───────────────────────────────────────────────
interface ProductForm {
  name: string;
  price: string;
  originalPrice: string;
  stock: string;
  categoryId: string;
  brandId: string;
  description: string;
  overview?: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
  highlights?: Record<string, unknown> | null;
  additionalInfo?: Record<string, unknown> | null;
  featured: boolean;
  isActive: boolean;
  imageUrl: string;
  specifications: { key: string; value: string }[];
}

const BLANK_FORM: ProductForm = {
  name: "",
  price: "",
  originalPrice: "",
  stock: "",
  categoryId: "",
  brandId: "",
  description: "",
  overview: null,
  details: null,
  highlights: null,
  additionalInfo: null,
  featured: false,
  isActive: true,
  imageUrl: "",
  specifications: [],
};

function Field({
  label,
  k,
  type = "text",
  placeholder,
  half,
  form,
  setForm,
}: {
  label: string;
  k: keyof ProductForm;
  type?: string;
  placeholder?: string;
  half?: boolean;
  form: ProductForm;
  setForm: (f: ProductForm) => void;
}) {
  return (
    <div className={half ? "" : "col-span-2"}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[k] as string}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ─── Product modal ────────────────────────────────────────────
function ProductModal({
  initial,
  categories,
  brands,
  onSave,
  onClose,
}: {
  initial?: ProductListItemDto | null;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  onSave: (data: ProductForm, newFiles: File[], primaryImageId: string | null, existingImages: ProductImageResponse[]) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProductForm>(
    initial
      ? {
          name: initial.name,
          price: String(toNumber(initial.price)),
          originalPrice: initial.originalPrice
            ? String(toNumber(initial.originalPrice))
            : "",
          stock: String(initial.stock),
          categoryId: initial.categoryId,
          brandId: initial.brand?.id ?? "",
          description: initial.description ?? "",
          overview: initial.overview ?? null,
          details: initial.details ?? null,
          highlights: initial.highlights ?? null,
          additionalInfo: initial.additionalInfo ?? null,
          featured: initial.featured ?? false,
          isActive: initial.isActive,
          imageUrl: initial.images?.[0]?.url ?? "",
          specifications: initial.specifications ?? [],
        }
      : BLANK_FORM,
  );
  const [saving, setSaving] = useState(false);

  // Multi-image state — lazily initialised from `initial` prop
  const [existingImages, setExistingImages] = useState<ProductImageResponse[]>(
    () =>
      initial?.images?.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId ?? null,
        isPrimary: img.isPrimary ?? false,
        order: img.order ?? 0,
        productId: initial.id,
      })) ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(() => {
    if (!initial?.images?.length) return null;
    const primary = initial.images.find((img) => img.isPrimary);
    return primary?.id ?? initial.images[0].id ?? null;
  });
  const [imageError, setImageError] = useState("");

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error("Name, price and stock are required");
      return;
    }

    // If images exist, require a primary image
    if (existingImages.length + newFiles.length > 0 && !primaryImageId) {
      setImageError("Please select a primary image");
      toast.error("Please select a primary image");
      return;
    }

    setImageError("");
    setSaving(true);
    try {
      await onSave(form, newFiles, primaryImageId, existingImages);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
          <h3 className="font-black text-slate-900">
            {initial ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Multi-image manager */}
          <ProductImageManager
            productId={initial?.id}
            initialImages={undefined}
            newFiles={newFiles}
            onNewFilesChange={setNewFiles}
            existingImages={existingImages}
            onExistingImagesChange={setExistingImages}
            primaryImageId={primaryImageId}
            onPrimaryImageIdChange={setPrimaryImageId}
            error={imageError}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Product Name *"
              k="name"
              placeholder="iPhone 15 Pro Max"
              form={form}
              setForm={setForm}
            />
            <Field
              label="Price *"
              k="price"
              placeholder="999.99"
              type="number"
              half
              form={form}
              setForm={setForm}
            />
            <Field
              label="Original Price"
              k="originalPrice"
              placeholder="1099.99"
              type="number"
              half
              form={form}
              setForm={setForm}
            />
            <Field
              label="Stock *"
              k="stock"
              placeholder="100"
              type="number"
              half
              form={form}
              setForm={setForm}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Brand
            </label>
            <div className="relative">
              <select
                value={form.brandId}
                onChange={(e) =>
                  setForm({ ...form, brandId: e.target.value })
                }
                className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
              >
                <option value="">Select brand (optional)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Description (plain text — for SEO, search, metadata) */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Short Description
            </label>
            <textarea
              rows={3}
              placeholder="A brief plain‑text summary for search engines and listings..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Product Overview (rich text) */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Product Overview
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Rich description — key features, benefits, use cases…
            </p>
            <RichTextEditor
              key={initial?.id ?? "create-overview"}
              content={form.overview}
              placeholder="Describe your product in detail — key features, benefits, use cases, target audience, and what makes it special..."
              onChange={(json) => setForm({ ...form, overview: json })}
            />
          </div>

          {/* Details Section (rich text) */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Details Section
            </label>
            <p className="text-xs text-slate-400 mb-2">
              In‑depth product details, specifications, features…
            </p>
            <RichTextEditor
              key={initial?.id ?? "create-details"}
              content={form.details}
              placeholder="Add detailed product information, highlights, and more..."
              onChange={(json) => setForm({ ...form, details: json })}
            />
          </div>

          {/* Highlights (rich text) */}
          {/* <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Key Highlights
            </label>
            <RichTextEditor
              key={initial?.id ?? "create-highlights"}
              content={form.highlights}
              placeholder="List the key selling points and highlights..."
              onChange={(json) => setForm({ ...form, highlights: json })}
              minHeight={120}
            />
          </div> */}

          {/* Additional Information (rich text) */}
          {/* <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Additional Information
            </label>
            <RichTextEditor
              key={initial?.id ?? "create-additional-info"}
              content={form.additionalInfo}
              placeholder="Warranty info, shipping details, care instructions, etc..."
              onChange={(json) => setForm({ ...form, additionalInfo: json })}
              minHeight={120}
            />
          </div> */}

          {/* Specifications */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Specifications
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Key Features", "What's in the Box", "Warranty", "Compatibility"].map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => {
                    if (form.specifications.some((s) => s.key === tmpl)) return;
                    setForm({
                      ...form,
                      specifications: [...form.specifications, { key: tmpl, value: "" }],
                    });
                  }}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700 transition-colors font-medium"
                >
                  + {tmpl}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {form.specifications.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Key (e.g. RAM)"
                    value={spec.key}
                    onChange={(e) => {
                      const specs = [...form.specifications];
                      specs[idx] = { ...specs[idx], key: e.target.value };
                      setForm({ ...form, specifications: specs });
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 16GB)"
                    value={spec.value}
                    onChange={(e) => {
                      const specs = [...form.specifications];
                      specs[idx] = { ...specs[idx], value: e.target.value };
                      setForm({ ...form, specifications: specs });
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        specifications: form.specifications.filter((_, i) => i !== idx),
                      });
                    }}
                    className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  specifications: [...form.specifications, { key: "", value: "" }],
                })
              }
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Plus size={13} /> Add Specification
            </button>
          </div>

          {/* Toggles */}
          <div className="flex gap-4 flex-wrap">
            {(
              [
                { k: "isActive", label: "Published" },
                { k: "featured", label: "Featured" },
              ] as { k: keyof ProductForm; label: string }[]
            ).map(({ k, label }) => (
              <label
                key={k}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div
                  onClick={() => setForm((f) => ({ ...f, [k]: !f[k] }))}
                  className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                    form[k]
                      ? "bg-amber-600 border-amber-600"
                      : "border-slate-300"
                  }`}
                >
                  {form[k] && (
                    <CheckCircle2
                      size={11}
                      className="text-white"
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span className="text-sm text-slate-700 font-medium">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    ease: "linear",
                  }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                />
                Saving...
              </>
            ) : initial ? (
              "Save Changes"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function VendorProductsClient() {
  const [products, setProducts] = useState<ProductListItemDto[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductListItemDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductListItemDto | null>(
    null,
  );


  useEffect(() => {
    Promise.all([getMyProducts(), getCategories(), getBrands()])
      .then(([prodRes, catRes, brandRes]) => {
        setProducts(prodRes.data.data ?? []);
        setCategories(
          mapCategoriesToListItems(catRes.data.data).map((c) => ({
            id: c.id,
            name: c.name,
          })),
        );
        setBrands(
          (brandRes.data.data ?? []).map((b) => ({
            id: b.id,
            name: b.name,
          })),
        );
      })
      .catch((err) =>
        toast.error(getApiErrorMessage(err, "Failed to load products")),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.categoryId === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async (
    data: ProductForm,
    newFiles: File[],
    primaryImageId: string | null,
    existingImages: ProductImageResponse[],
  ) => {
    // Determine which existing images to remove (those in original but no longer in current list)
    const originalImageIds = new Set(editTarget?.images?.map((img) => img.id) ?? []);
    const currentImageIds = new Set(existingImages.map((img) => img.id));
    const removeImageIds = editTarget
      ? Array.from(originalImageIds).filter((id) => !currentImageIds.has(id))
      : [];

    const payload: CreateProductDto = {
      name: data.name.trim(),
      price: parseFloat(data.price),
      originalPrice: data.originalPrice
        ? parseFloat(data.originalPrice)
        : undefined,
      stock: parseInt(data.stock),
      categoryId: data.categoryId,
      brandId: data.brandId || undefined,
      description: data.description || undefined,
      overview: data.overview ?? undefined,
      details: data.details ?? undefined,
      highlights: data.highlights ?? undefined,
      additionalInfo: data.additionalInfo ?? undefined,
      featured: data.featured,
      isActive: data.isActive,
      specifications:
        data.specifications.length > 0
          ? data.specifications.filter((s) => s.key.trim() && s.value.trim())
          : undefined,
      imageUrl: undefined,
    };

    try {
      if (editTarget) {
        // For edit: update product with image changes (extra fields flow via formData JSON)
        const updatePayload: Partial<CreateProductDto> & {
          removeImageIds: string[];
          primaryImageId: string | null;
        } = {
          ...payload,
          removeImageIds,
          primaryImageId,
        };

        const res = await updateProduct(
          editTarget.id,
          updatePayload as Partial<CreateProductDto>,
          newFiles.length > 0 ? newFiles : undefined,
        );
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editTarget.id
              ? { ...p, ...(res.data.data as ProductListItemDto) }
              : p,
          ),
        );
        toast.success("Product updated");
        setEditTarget(null);
      } else {
        // For create: the backend handles images via multipart upload
        const res = await createProduct(
          payload,
          newFiles.length > 0 ? newFiles : undefined,
        );
        const created = res.data.data as ProductListItemDto;
        setProducts((prev) => [created, ...prev]);
        toast.success("Product created");
      }
    } catch (raw: unknown) {
      const err = raw as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const status = err.response?.status;
      const errMsg = err.response?.data?.message ?? err.message ?? "";
      if (
        status === 413 ||
        errMsg.toLowerCase().includes("file too large") ||
        errMsg.toLowerCase().includes("file size") ||
        errMsg.toLowerCase().includes("image size")
      ) {
        toast.error("Upload failed. File size exceeds the allowed limit.");
      } else {
        toast.error(getApiErrorMessage(raw, "Failed to save product"));
      }
      throw raw;
    }
  };

  const handleToggleVisibility = async (p: ProductListItemDto) => {
    try {
      await toggleProductVisibility(p.id, !p.isActive);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, isActive: !p.isActive } : item,
        ),
      );
      toast.success(p.isActive ? "Product hidden" : "Product published");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update visibility"));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete product"));
    } finally {
      setDeleteTarget(null);
    }
  };

  const disc = (p: ProductListItemDto) => {
    if (!p.originalPrice) return 0;
    const orig = toNumber(p.originalPrice);
    const curr = toNumber(p.price);
    return orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1
          className="text-2xl font-black text-slate-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          My Products
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 animate-pulse rounded-2xl h-64"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1
              className="text-2xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              My Products
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {products.length} products ·{" "}
              {products.filter((p) => !p.isActive).length} hidden
            </p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          <p className="text-xs text-slate-400 self-center font-medium">
            {filtered.length} results
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const discount = disc(p);
              const image = p.images?.[0]?.url ?? "";
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
                    {image ? (
                      <Image
                        src={image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-400"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={32} className="text-slate-200" />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {p.isActive ? "Live" : "Hidden"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[10px] font-semibold text-amber-600 mb-1">
                      {p.category?.name}
                    </p>
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2 block hover:text-amber-600 transition-colors"
                    >
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base font-black text-slate-900">
                        ${toNumber(p.price).toLocaleString()}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${toNumber(p.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Star
                          size={10}
                          className="fill-amber-400 text-amber-400"
                        />
                        {p.rating ?? 0}
                      </span>
                      <span
                        className={`font-bold ${p.stock <= 10 ? "text-red-600" : "text-green-700"}`}
                      >
                        {p.stock} in stock
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleVisibility(p)}
                        className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                          p.isActive
                            ? "bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600"
                            : "bg-green-100 hover:bg-green-200 text-green-700"
                        }`}
                      >
                        {p.isActive ? (
                          <>
                            <EyeOff size={12} /> Hide
                          </>
                        ) : (
                          <>
                            <Eye size={12} /> Publish
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditTarget(p);
                          setModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Package size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No products found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            key={editTarget?.id ?? 'new'}
            initial={editTarget}
            categories={categories}
            brands={brands}
            onSave={handleSave}
            onClose={() => {
              setModalOpen(false);
              setEditTarget(null);
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This product will be permanently deleted and removed from the storefront."
        confirmLabel="Delete Product"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
