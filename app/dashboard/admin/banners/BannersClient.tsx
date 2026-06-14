"use client";

import {
  adminDeleteBanner,
  adminGetAllBanners,
  type BannerDto,
  type BannerType,
} from "@/api/banner.api";
import ConfirmModal from "@/components/dashboard/admin/Confirmmodal";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit3,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BannerForm from "./BannerForm";

/* ── Type colour map ──────────────────────────────────── */
const TYPE_COLORS: Record<BannerType, string> = {
  HOME_HERO_MAIN: "bg-purple-100 text-purple-700",
  HOME_GRID_CELL: "bg-cyan-100 text-cyan-700",
  HOME_PILL: "bg-pink-100 text-pink-700",
  PRODUCT_HERO_SLIDE: "bg-amber-100 text-amber-700",
  PRODUCT_FLOATING: "bg-blue-100 text-blue-700",
};

const TYPE_LABELS: Record<BannerType, string> = {
  HOME_HERO_MAIN: "Hero Main",
  HOME_GRID_CELL: "Grid Cell",
  HOME_PILL: "Pill",
  PRODUCT_HERO_SLIDE: "Slide",
  PRODUCT_FLOATING: "Floating",
};

const createStubBanner = (type: BannerType): BannerDto => ({
  id: "new",
  type,
  order: 1,
  isActive: true,
  startsAt: null,
  expiresAt: null,
  imageUrl: null,
  publicId: null,
  heroTitle: null,
  heroLabel: null,
  heroHref: null,
  heroCtaText: null,
  heroGradientFrom: null,
  heroGradientVia: null,
  heroAccentColor: null,
  heroCtaBg: null,
  gridLabel: null,
  gridTitle: null,
  gridHref: null,
  gridOffer: null,
  gridOfferIcon: null,
  gridGradientFrom: null,
  gridGradientVia: null,
  gridBadgeBg: null,
  pillLabel: null,
  pillSub: null,
  pillIcon: null,
  pillBg: null,
  pillShadow: null,
  slideBadge: null,
  slideTitle: null,
  slideHighlight: null,
  slideSubtitle: null,
  slidePrice: null,
  slideOriginalPrice: null,
  slideDiscount: null,
  slideBgGradient: null,
  floatingName: null,
  floatingPrice: null,
  floatingRating: null,
  floatingReviews: null,
});

/* ── Helpers ──────────────────────────────────────────── */
const getContentPreview = (b: BannerDto): string => {
  switch (b.type) {
    case "HOME_HERO_MAIN":
      return b.heroTitle || b.heroLabel || "—";
    case "HOME_GRID_CELL":
      return b.gridTitle || b.gridLabel || "—";
    case "HOME_PILL":
      return b.pillLabel || "—";
    case "PRODUCT_HERO_SLIDE":
      return b.slideTitle || b.slideBadge || "—";
    case "PRODUCT_FLOATING":
      return b.floatingName || "—";
    default:
      return "—";
  }
};

/* ── Component ────────────────────────────────────────── */
export function BannersClient() {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"homepage" | "product">("homepage");
  const [activeSubTab, setActiveSubTab] = useState<BannerType>("HOME_HERO_MAIN");
  const [searchQuery, setSearchQuery] = useState("");
  const [formModal, setFormModal] = useState<{
    mode: "create" | "edit";
    initial?: BannerDto;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BannerDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await adminGetAllBanners();
      setBanners(res.data.data ?? []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load banners"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-switch sub-tab when top tab changes
  useEffect(() => {
    setActiveSubTab(activeTab === "homepage" ? "HOME_HERO_MAIN" : "PRODUCT_HERO_SLIDE");
  }, [activeTab]);

  /* ── Filter & search ─────────────────────────────── */
  const filtered = banners.filter((b) => {
    if (b.type !== activeSubTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const preview = getContentPreview(b).toLowerCase();
      return preview.includes(q);
    }
    return true;
  });

  const stats = {
    total: banners.length,
    active: banners.filter((b) => b.isActive).length,
  };

  /* ── Delete handler ──────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteBanner(deleteTarget.id);
      toast.success("Banner deleted");
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete banner"));
    } finally {
      setDeleting(false);
    }
  };

  /* ── Render ───────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Banners", value: stats.total, icon: ImageIcon, color: "bg-amber-100 text-amber-700" },
          { label: "Active", value: stats.active, icon: Eye, color: "bg-green-100 text-green-700" },
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

      {/* ── Search & Create ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search banners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setFormModal({ mode: "create" })}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
        >
          <Plus size={16} />
          New Banner
        </button>
      </div>

      {/* ── Top-level tabs ── */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {[
            { key: "homepage" as const, label: "Homepage Banners" },
            { key: "product" as const, label: "Product Page Banners" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-amber-600 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => fetchBanners()}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Sub-tabs with counts ── */}
      <div className="flex bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
        {(activeTab === "homepage"
          ? [
              { key: "HOME_HERO_MAIN" as BannerType, label: "Hero Cell" },
              { key: "HOME_GRID_CELL" as BannerType, label: "Grid Cells" },
              { key: "HOME_PILL" as BannerType, label: "Offer Pills" },
            ]
          : [
              { key: "PRODUCT_HERO_SLIDE" as BannerType, label: "Hero Slides" },
              { key: "PRODUCT_FLOATING" as BannerType, label: "Floating Cards" },
            ]
        ).map((st) => {
          const count = banners.filter((b) => b.type === st.key).length;
          return (
            <button
              key={st.key}
              onClick={() => setActiveSubTab(st.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSubTab === st.key
                  ? "bg-amber-600 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {st.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeSubTab === st.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-3">
          <Loader2 size={32} className="animate-spin text-amber-600" />
          <p className="text-sm font-medium">Loading banners…</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-3">
          <ImageIcon size={40} className="text-slate-200" />
          <p className="text-sm font-medium text-slate-400">
            {banners.length === 0
              ? "No banners yet. Create your first banner!"
              : `No ${activeSubTab.replace(/_/g, " ").toLowerCase()} banners found.`}
          </p>
        </div>
      )}

      {/* ── Banner grid ── */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((banner) => (
              <motion.div
                key={banner.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 transition-all overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-36 bg-slate-50 overflow-hidden">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={getContentPreview(banner)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <ImageIcon size={36} />
                    </div>
                  )}
                  {/* Type badge */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      TYPE_COLORS[banner.type] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {TYPE_LABELS[banner.type] ?? banner.type}
                  </span>
                  {/* Active indicator */}
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {banner.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {getContentPreview(banner)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Order #{banner.order}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                    {banner.startsAt && (
                      <span>From: {new Date(banner.startsAt).toLocaleDateString()}</span>
                    )}
                    {banner.expiresAt && (
                      <span>Until: {new Date(banner.expiresAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-slate-50">
                    <button
                      onClick={() => setFormModal({ mode: "edit", initial: banner })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <Edit3 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(banner)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Form modal ── */}
      {formModal && (
        <BannerForm
          mode={formModal.mode}
          initial={formModal.mode === "create" ? createStubBanner(activeSubTab) : formModal.initial}
          onSave={() => {
            setFormModal(null);
            fetchBanners();
          }}
          onClose={() => setFormModal(null)}
        />
      )}

      {/* ── Delete confirmation ── */}
      {deleteTarget && (
        <ConfirmModal
          open={true}
          title="Delete Banner"
          description={`Are you sure you want to delete "${getContentPreview(deleteTarget)}"? This action cannot be undone.`}
          confirmLabel={deleting ? "Deleting…" : "Delete"}
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
