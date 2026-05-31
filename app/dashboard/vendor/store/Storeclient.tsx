'use client';

import { type ElementType, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Camera, Globe, Phone, Mail,
  Save, CheckCircle2, AlertTriangle,
  Star, Package, ShoppingBag, Link as LinkIcon,
  MapPin, FileText, Shield,
} from 'lucide-react';
import { mockVendorProfiles, mockUsers } from '@/data/mock-data';

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ElementType;
};

function Field({ label, value, onChange, placeholder, type = 'text', icon: Icon }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition ${Icon ? 'pl-10 pr-4' : 'px-4'}`} />
      </div>
    </div>
  );
}

export default function VendorStoreClient() {
  const profile = mockVendorProfiles[0];
  const vendor  = mockUsers.find((u) => u.role === 'VENDOR')!;

  const [form, setForm] = useState({
    storeName:   profile.storeName,
    bio:         profile.bio ?? '',
    phone:       vendor.phone ?? '',
    email:       vendor.email,
    website:     'https://techstorepro.com',
    instagram:   '@techstorepro',
    twitter:     '@techstorepro',
    logo:        profile.logo ?? '',
    returnPolicy: '30-day hassle-free returns on all unused products. Items must be in original packaging.',
    shippingPolicy: 'Orders ship within 1–2 business days. Standard delivery 3–5 days. Free shipping on orders over $99.',
    address: '456 Tech Avenue, Floor 3, New York, NY 10001',
  });
  const [activeTab, setActiveTab] = useState<'general' | 'policies' | 'danger'>('general');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [logoPreview, setLogoPreview] = useState(form.logo);

  const handleSave = async () => {
    setSaveState('saving');
    await new Promise((r) => setTimeout(r, 1200));
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 2500);
  };

  const TABS = [
    { key: 'general',  label: 'General',  icon: Store },
    { key: 'policies', label: 'Policies', icon: FileText },
    { key: 'danger',   label: 'Danger',   icon: AlertTriangle },
  ] as const;

  return (
    <div className="space-y-6">

      {/* Header + store status */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Store Profile</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your store information and settings</p>
        </div>
        <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border ${
          profile.isApproved ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${profile.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {profile.isApproved ? 'Store Active' : 'Pending Approval'}
        </span>
      </div>

      {/* Store hero card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Cover banner */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="px-5 sm:px-6 pb-5 -mt-10">
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            {/* Logo */}
            <div className="relative shrink-0">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                {logoPreview ? (
                  <Image src={logoPreview} alt={form.storeName} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store size={28} className="text-slate-400" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-md">
                <Camera size={13} />
                <input type="file" className="sr-only" accept="image/*" />
              </label>
            </div>

            <div className="flex-1 min-w-0 pt-10 sm:pt-12">
              <h2 className="text-xl font-black text-slate-900">{form.storeName}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                  <Star size={12} className="fill-amber-500 text-amber-500" /> {profile.rating} rating
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Package size={12} /> {profile.totalProducts} products
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <ShoppingBag size={12} /> {profile.totalSales.toLocaleString()} sales
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === key
                ? key === 'danger' ? 'bg-red-600 text-white shadow-sm' : 'bg-amber-600 text-white shadow-sm'
                : `text-slate-600 hover:text-slate-900 ${key === 'danger' ? 'hover:text-red-600' : ''}`
            }`}>
            <Icon size={14} />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6"
        >

          {/* ── General ── */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="font-black text-slate-900 mb-4">Store Information</h3>

              <Field label="Store Name *"    value={form.storeName} onChange={(v) => setForm({ ...form, storeName: v })}  placeholder="TechStore Pro" icon={Store} />
              <Field label="Business Address" value={form.address}  onChange={(v) => setForm({ ...form, address: v })}    placeholder="123 Main St, City" icon={MapPin} />

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Store Bio</label>
                <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell customers about your store..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Logo URL</label>
                <input type="url" value={form.logo}
                  onChange={(e) => { setForm({ ...form, logo: e.target.value }); setLogoPreview(e.target.value); }}
                  placeholder="https://your-logo-url.com/logo.png"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                <p className="text-xs text-slate-400 mt-1.5">Paste a URL or use the camera icon above to upload.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Support Email"  value={form.email}    onChange={(v) => setForm({ ...form, email: v })}    icon={Mail}   type="email" />
                <Field label="Support Phone"  value={form.phone}    onChange={(v) => setForm({ ...form, phone: v })}    icon={Phone} />
                <Field label="Website"        value={form.website}  onChange={(v) => setForm({ ...form, website: v })}  icon={Globe} />
                <Field label="Instagram"      value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} icon={LinkIcon} placeholder="@yourstore" />
              </div>
            </div>
          )}

          {/* ── Policies ── */}
          {activeTab === 'policies' && (
            <div className="space-y-5">
              <h3 className="font-black text-slate-900 mb-4">Store Policies</h3>
              <p className="text-sm text-slate-500">These policies are shown to customers on your store page and during checkout.</p>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Return Policy</label>
                <textarea rows={4} value={form.returnPolicy}
                  onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Shipping Policy</label>
                <textarea rows={4} value={form.shippingPolicy}
                  onChange={(e) => setForm({ ...form, shippingPolicy: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition" />
              </div>

              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <Shield size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Clear return and shipping policies improve buyer trust and reduce disputes. ElectroMart&apos;s platform-wide policy also applies to all orders.
                </p>
              </div>
            </div>
          )}

          {/* ── Danger zone ── */}
          {activeTab === 'danger' && (
            <div className="space-y-5">
              <h3 className="font-black text-slate-900 mb-1">Danger Zone</h3>
              <p className="text-sm text-slate-500 mb-4">Actions here are permanent and may affect your store and orders.</p>

              {[
                {
                  title: 'Pause Store',
                  desc: 'Temporarily hide your store from the marketplace. Existing orders will still be processed.',
                  btnLabel: 'Pause Store',
                  btnColor: 'border-yellow-400 text-yellow-700 hover:bg-yellow-50',
                },
                {
                  title: 'Delete All Products',
                  desc: 'Permanently delete all your products. This cannot be undone and will affect live orders.',
                  btnLabel: 'Delete Products',
                  btnColor: 'border-red-400 text-red-700 hover:bg-red-50',
                },
                {
                  title: 'Close Store',
                  desc: 'Permanently close your store. You will lose all product listings and store data.',
                  btnLabel: 'Close Store',
                  btnColor: 'border-red-600 text-red-700 hover:bg-red-50',
                },
              ].map(({ title, desc, btnLabel, btnColor }) => (
                <div key={title} className="flex items-center justify-between gap-4 p-4 border border-red-100 rounded-2xl flex-wrap">
                  <div>
                    <p className="text-sm font-black text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-sm">{desc}</p>
                  </div>
                  <button className={`px-4 py-2 border-2 ${btnColor} text-sm font-bold rounded-xl transition-colors shrink-0`}>
                    {btnLabel}
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save button — not shown on danger tab */}
      {activeTab !== 'danger' && (
        <div className="flex justify-end">
          <motion.button onClick={handleSave} whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              saveState === 'saved' ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'
            }`}>
            <AnimatePresence mode="wait">
              {saveState === 'saving' ? (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />
                  Saving...
                </motion.span>
              ) : saveState === 'saved' ? (
                <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2">
                  <CheckCircle2 size={15} /> Saved!
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2">
                  <Save size={15} /> Save Changes
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      )}
    </div>
  );
}