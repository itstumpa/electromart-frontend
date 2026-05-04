'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Save, CheckCircle2,
  Eye, EyeOff, Lock, Smartphone, ShoppingBag,
  Tag, Truck, Star, Trash2,
} from 'lucide-react';

type Tab = 'account' | 'notifications' | 'security';

function SaveButton({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${saved ? 'bg-green-600 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'}`}>
      <AnimatePresence mode="wait">
        {saving ? (
          <motion.span key="s" className="flex items-center gap-2">
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" /> Saving...
          </motion.span>
        ) : saved ? (
          <motion.span key="d" className="flex items-center gap-2"><CheckCircle2 size={15} /> Saved!</motion.span>
        ) : (
          <motion.span key="i" className="flex items-center gap-2"><Save size={15} /> Save Changes</motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function Toggle({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${value ? 'bg-amber-600' : 'bg-slate-200'}`}>
        <motion.span animate={{ x: value ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );
}

export default function CustomerSettingsClient() {
  const [tab, setTab] = useState<Tab>('account');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const [prefs, setPrefs] = useState({
    language: 'en',
    currency: 'USD',
    newsletter: true,
    smsAlerts: false,
    saveSearchHistory: true,
    personalisedAds: false,
  });

  const [notifs, setNotifs] = useState({
    orderUpdates:   true,
    promotions:     true,
    wishlistSale:   true,
    reviewReminder: false,
    deliveryAlerts: true,
    weeklyDigest:   false,
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPw,    setShowPw]    = useState({ current: false, new: false, confirm: false });
  const [twoFA,     setTwoFA]     = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'account',       label: 'Preferences',    icon: User },
    { key: 'notifications', label: 'Notifications',  icon: Bell },
    { key: 'security',      label: 'Security',       icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account preferences and security</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <aside className="lg:w-48 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={['flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap w-full text-left',
                  tab === key ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25' : 'text-slate-600 hover:bg-white hover:text-slate-900',
                ].join(' ')}>
                <Icon size={16} className={tab === key ? 'text-white' : 'text-slate-400'} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

              {/* ── Preferences ── */}
              {tab === 'account' && (
                <div className="space-y-5">
                  <h2 className="font-black text-slate-900 mb-4">Account Preferences</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Language</label>
                      <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
                        <option value="en">English</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="ar">العربية (Arabic)</option>
                        <option value="es">Español (Spanish)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Currency</label>
                      <select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
                        <option value="USD">USD — US Dollar</option>
                        <option value="BDT">BDT — Taka</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GBP">GBP — Pound</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl px-5 divide-y divide-slate-100">
                    <Toggle label="Newsletter"          sub="Receive weekly deals and product updates via email"     value={prefs.newsletter}         onChange={(v) => setPrefs({ ...prefs, newsletter: v })} />
                    <Toggle label="SMS Alerts"          sub="Receive order and delivery updates via text message"    value={prefs.smsAlerts}          onChange={(v) => setPrefs({ ...prefs, smsAlerts: v })} />
                    <Toggle label="Save Search History" sub="Let us remember your recent searches"                  value={prefs.saveSearchHistory}  onChange={(v) => setPrefs({ ...prefs, saveSearchHistory: v })} />
                    <Toggle label="Personalised Ads"    sub="Allow us to show you ads based on your browsing"       value={prefs.personalisedAds}    onChange={(v) => setPrefs({ ...prefs, personalisedAds: v })} />
                  </div>

                  {/* Danger zone */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-700 mb-3">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-2xl flex-wrap gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Delete Account</p>
                        <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border-2 border-red-400 text-red-600 hover:bg-red-50 text-sm font-bold rounded-xl transition-colors">
                        <Trash2 size={14} /> Delete Account
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end"><SaveButton saving={saving} saved={saved} onClick={save} /></div>
                </div>
              )}

              {/* ── Notifications ── */}
              {tab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="font-black text-slate-900">Notification Preferences</h2>
                  {[
                    {
                      title: 'Orders & Delivery', icon: ShoppingBag,
                      items: [
                        { k: 'orderUpdates',   label: 'Order Status Updates', sub: 'Confirmed, shipped, delivered, etc.' },
                        { k: 'deliveryAlerts', label: 'Delivery Alerts',      sub: 'Real-time alerts when your order is nearby' },
                      ],
                    },
                    {
                      title: 'Deals & Offers', icon: Tag,
                      items: [
                        { k: 'promotions',    label: 'Promotions & Deals', sub: 'Exclusive discounts and flash sales' },
                        { k: 'wishlistSale',  label: 'Wishlist Price Drop', sub: 'Alert when a wishlist item goes on sale' },
                        { k: 'weeklyDigest',  label: 'Weekly Digest',       sub: 'A summary of top deals every Monday' },
                      ],
                    },
                    {
                      title: 'Activity', icon: Star,
                      items: [
                        { k: 'reviewReminder', label: 'Review Reminder', sub: 'Remind me to review delivered products' },
                      ],
                    },
                  ].map(({ title, icon: Icon, items }) => (
                    <div key={title}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Icon size={12} /> {title}
                      </p>
                      <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50">
                        {items.map(({ k, label, sub }) => (
                          <Toggle key={k} label={label} sub={sub} value={(notifs as any)[k]} onChange={(v) => setNotifs({ ...notifs, [k]: v })} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end"><SaveButton saving={saving} saved={saved} onClick={save} /></div>
                </div>
              )}

              {/* ── Security ── */}
              {tab === 'security' && (
                <div className="space-y-6">
                  <h2 className="font-black text-slate-900">Security</h2>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-700">Change Password</h3>
                    {[
                      { key: 'current' as const, label: 'Current Password' },
                      { key: 'new'     as const, label: 'New Password'     },
                      { key: 'confirm' as const, label: 'Confirm Password' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
                        <div className="relative">
                          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input type={showPw[key] ? 'text' : 'password'} placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                          <button type="button" onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                            {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start"><SaveButton saving={saving} saved={saved} onClick={save} /></div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <Smartphone size={18} className="text-amber-700" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-xs">
                            Add an extra verification step when signing in.
                          </p>
                          {twoFA && <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full mt-2"><CheckCircle2 size={11} /> Enabled</span>}
                        </div>
                      </div>
                      <button onClick={() => setTwoFA(!twoFA)}
                        className={`shrink-0 w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${twoFA ? 'bg-amber-600' : 'bg-slate-300'}`}>
                        <motion.span animate={{ x: twoFA ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-5 h-5 bg-white rounded-full shadow-sm" />
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