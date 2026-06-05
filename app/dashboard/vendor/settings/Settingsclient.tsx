"use client";

import { changePassword } from "@/api/auth.api";
import { getMyStore, updateStoreSettings } from "@/api/store.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Package,
  Save,
  Shield,
  Smartphone,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Tab = "account" | "notifications" | "security";

export function SaveButton({
  saving,
  saved,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${saved ? "bg-green-600 text-white" : "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200"}`}
    >
      <AnimatePresence mode="wait">
        {saving ? (
          <motion.span key="s" className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
            />{" "}
            Saving...
          </motion.span>
        ) : saved ? (
          <motion.span key="d" className="flex items-center gap-2">
            <CheckCircle2 size={15} /> Saved!
          </motion.span>
        ) : (
          <motion.span key="i" className="flex items-center gap-2">
            <Save size={15} /> Save Changes
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function Toggle({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${value ? "bg-amber-600" : "bg-slate-200"}`}
      >
        <motion.span
          animate={{ x: value ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

export default function VendorSettingsClient() {
  const [tab, setTab] = useState<Tab>("account");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Account state
  const [account, setAccount] = useState({
    businessName: "TechStore Pro Ltd.",
    taxId: "TX-2026-88421",
    currency: "USD",
    payoutCycle: "monthly",
    minPayout: "100",
    autoAcceptOrders: true,
    autoUpdateStock: true,
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    newOrder: true,
    orderCancelled: true,
    lowStock: true,
    newReview: true,
    payoutSent: true,
    returnRequest: true,
    weeklyReport: false,
    marketingTips: false,
  });

  // Security
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFA, setTwoFA] = useState(false);

  useEffect(() => {
    getMyStore()
      .then((res) => {
        const store = res.data.data;
        setStoreId(store.id);
        setAccount({
          businessName: store.name || "",
          taxId: store.taxId || "",
          currency: store.currency || "USD",
          payoutCycle: store.payoutCycle || "monthly",
          minPayout: store.minPayout || "100",
          autoAcceptOrders: store.autoAcceptOrders ?? true,
          autoUpdateStock: store.autoUpdateStock ?? true,
        });
        setNotifs({
          newOrder: store.notifNewOrder ?? true,
          orderCancelled: store.notifOrderCancelled ?? true,
          lowStock: store.notifLowStock ?? true,
          newReview: store.notifNewReview ?? true,
          payoutSent: store.notifPayoutSent ?? true,
          returnRequest: store.notifReturnRequest ?? true,
          weeklyReport: store.notifWeeklyReport ?? false,
          marketingTips: store.notifMarketingTips ?? false,
        });
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err, "Failed to load settings"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (tab === "account") {
        if (!storeId) throw new Error("Store profile not found");
        await updateStoreSettings(storeId, {
          name: account.businessName,
          taxId: account.taxId,
          currency: account.currency,
          payoutCycle: account.payoutCycle,
          minPayout: account.minPayout,
          autoAcceptOrders: account.autoAcceptOrders,
          autoUpdateStock: account.autoUpdateStock,
        });
        toast.success("Account settings saved");
      } else if (tab === "notifications") {
        if (!storeId) throw new Error("Store profile not found");
        await updateStoreSettings(storeId, {
          notifNewOrder: notifs.newOrder,
          notifOrderCancelled: notifs.orderCancelled,
          notifLowStock: notifs.lowStock,
          notifNewReview: notifs.newReview,
          notifPayoutSent: notifs.payoutSent,
          notifReturnRequest: notifs.returnRequest,
          notifWeeklyReport: notifs.weeklyReport,
          notifMarketingTips: notifs.marketingTips,
        });
        toast.success("Notification preferences saved");
      } else if (tab === "security") {
        if (!passwords.current || !passwords.newPass || !passwords.confirm) {
          throw new Error("Please fill all password fields");
        }
        if (passwords.newPass !== passwords.confirm) {
          throw new Error("Passwords do not match");
        }
        await changePassword(passwords.current, passwords.newPass);
        setPasswords({ current: "", newPass: "", confirm: "" });
        toast.success("Password changed successfully");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err) || err.message);
    } finally {
      setSaving(false);
    }
  };

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "account", label: "Account", icon: Store },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <h1
          className="text-2xl font-black text-slate-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Settings
        </h1>
        <div className="bg-slate-100 animate-pulse rounded-2xl h-48" />
        <div className="bg-slate-100 animate-pulse rounded-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-black text-slate-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Settings
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage your vendor account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab nav */}
        <aside className="lg:w-48 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap w-full text-left",
                  tab === key
                    ? "bg-amber-600 text-white shadow-md shadow-amber-500/25"
                    : "text-slate-600 hover:bg-white hover:text-slate-900",
                ].join(" ")}
              >
                <Icon
                  size={16}
                  className={tab === key ? "text-white" : "text-slate-400"}
                />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* ── Account ── */}
              {tab === "account" && (
                <div className="space-y-5">
                  <h2 className="font-black text-slate-900 mb-4">
                    Account Settings
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Business / Legal Name",
                        k: "businessName",
                        placeholder: "TechStore Pro Ltd.",
                      },
                      {
                        label: "Tax ID / VAT Number",
                        k: "taxId",
                        placeholder: "TX-2026-XXXXX",
                      },
                      {
                        label: "Min Payout Amount ($)",
                        k: "minPayout",
                        placeholder: "100",
                      },
                    ].map(({ label, k, placeholder }) => (
                      <div key={k}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                          {label}
                        </label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={(account as any)[k]}
                          onChange={(e) =>
                            setAccount({ ...account, [k]: e.target.value })
                          }
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                        Currency
                      </label>
                      <select
                        value={account.currency}
                        onChange={(e) =>
                          setAccount({ ...account, currency: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
                      >
                        <option value="USD">USD — US Dollar</option>
                        <option value="BDT">BDT — Bangladeshi Taka</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GBP">GBP — British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                        Payout Cycle
                      </label>
                      <select
                        value={account.payoutCycle}
                        onChange={(e) =>
                          setAccount({
                            ...account,
                            payoutCycle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl px-5 divide-y divide-slate-100">
                    <Toggle
                      label="Auto-accept Orders"
                      sub="Automatically confirm new orders without manual review"
                      value={account.autoAcceptOrders}
                      onChange={(v) =>
                        setAccount({ ...account, autoAcceptOrders: v })
                      }
                    />
                    <Toggle
                      label="Auto-update Stock"
                      sub="Reduce stock count automatically when orders are confirmed"
                      value={account.autoUpdateStock}
                      onChange={(v) =>
                        setAccount({ ...account, autoUpdateStock: v })
                      }
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <SaveButton saving={saving} saved={saved} onClick={save} />
                  </div>
                </div>
              )}

              {/* ── Notifications ── */}
              {tab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="font-black text-slate-900">
                    Notification Preferences
                  </h2>

                  {[
                    {
                      title: "Orders",
                      icon: Package,
                      items: [
                        {
                          k: "newOrder",
                          label: "New Order",
                          sub: "Alert when a customer places an order",
                        },
                        {
                          k: "orderCancelled",
                          label: "Order Cancelled",
                          sub: "Alert when a customer cancels an order",
                        },
                        {
                          k: "returnRequest",
                          label: "Return Request",
                          sub: "Alert when a return is submitted",
                        },
                      ],
                    },
                    {
                      title: "Store",
                      icon: Store,
                      items: [
                        {
                          k: "lowStock",
                          label: "Low Stock Alert",
                          sub: "Alert when any product falls below 10 units",
                        },
                        {
                          k: "newReview",
                          label: "New Review",
                          sub: "Alert when a customer writes a review",
                        },
                        {
                          k: "payoutSent",
                          label: "Payout Sent",
                          sub: "Alert when your payout is processed",
                        },
                      ],
                    },
                    {
                      title: "Marketing",
                      icon: Mail,
                      items: [
                        {
                          k: "weeklyReport",
                          label: "Weekly Report",
                          sub: "Summary of store performance every Monday",
                        },
                        {
                          k: "marketingTips",
                          label: "Marketing Tips",
                          sub: "Seller tips and growth insights from ElectroMart",
                        },
                      ],
                    },
                  ].map(({ title, icon: Icon, items }) => (
                    <div key={title}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Icon size={12} /> {title}
                      </p>
                      <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50">
                        {items.map(({ k, label, sub }) => (
                          <Toggle
                            key={k}
                            label={label}
                            sub={sub}
                            value={(notifs as any)[k]}
                            onChange={(v) => setNotifs({ ...notifs, [k]: v })}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <SaveButton saving={saving} saved={saved} onClick={save} />
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {tab === "security" && (
                <div className="space-y-6">
                  <h2 className="font-black text-slate-900">Security</h2>

                  {/* Change password */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-700">
                      Change Password
                    </h3>
                    {[
                      { key: "current" as const, label: "Current Password" },
                      { key: "new" as const, label: "New Password" },
                      { key: "confirm" as const, label: "Confirm Password" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                          {label}
                        </label>
                        <div className="relative">
                          <Lock
                            size={14}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          />
                          <input
                            type={showPw[key] ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwords[key === "new" ? "newPass" : key]}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                [key === "new" ? "newPass" : key]:
                                  e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPw({ ...showPw, [key]: !showPw[key] })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          >
                            {showPw[key] ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start">
                      <SaveButton
                        saving={saving}
                        saved={saved}
                        onClick={save}
                      />
                    </div>
                  </div>

                  {/* 2FA */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <Smartphone size={18} className="text-amber-700" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            Two-Factor Authentication
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-xs">
                            Protect your vendor account with an extra layer of
                            security.
                          </p>
                          {twoFA && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full mt-2">
                              <CheckCircle2 size={11} /> Enabled
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setTwoFA(!twoFA)}
                        className={`shrink-0 w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${twoFA ? "bg-amber-600" : "bg-slate-300"}`}
                      >
                        <motion.span
                          animate={{ x: twoFA ? 24 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
