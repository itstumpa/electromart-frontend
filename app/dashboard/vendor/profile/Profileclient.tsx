'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Save, CheckCircle2, Mail,
  Phone, Globe, User, Star, Package,
  ShoppingBag, MapPin, Calendar,
} from 'lucide-react';
import { mockUsers, mockVendorProfiles } from '@/data/mock-data';

export default function VendorProfileClient() {
  const vendor  = mockUsers.find((u) => u.role === 'VENDOR')!;
  const profile = mockVendorProfiles[0];

  const [form, setForm] = useState({
    name:     vendor.name,
    email:    vendor.email,
    phone:    vendor.phone ?? '',
    website:  'https://techstorepro.com',
    bio:      'Electronics enthusiast and authorized reseller. Bringing the best tech directly to your door since 2019.',
    avatar:   vendor.avatar ?? '',
    location: 'New York, NY, USA',
  });
  const [avatarPreview, setAvatarPreview] = useState(vendor.avatar ?? '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const joined = new Date(vendor.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Left: Edit form ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Avatar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <h2 className="font-black text-slate-900 mb-4">Personal Info</h2>
            <div className="flex items-center gap-5 mb-5">
              <div className="relative shrink-0">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt={form.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={28} className="text-slate-300" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-md">
                  <Camera size={13} />
                  <input type="file" className="sr-only" accept="image/*" />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900">{form.name}</p>
                <p className="text-sm text-slate-500">{form.email}</p>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                  Vendor
                </span>
              </div>
            </div>

            {/* Avatar URL */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Avatar URL</label>
              <input type="url" placeholder="https://..." value={form.avatar}
                onChange={(e) => { setForm({ ...form, avatar: e.target.value }); setAvatarPreview(e.target.value); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name *',  k: 'name',     icon: User,     placeholder: 'John Smith',         type: 'text'  },
                { label: 'Email *',      k: 'email',    icon: Mail,     placeholder: 'john@example.com',   type: 'email' },
                { label: 'Phone',        k: 'phone',    icon: Phone,    placeholder: '+1 555 000 0000',    type: 'tel'   },
                { label: 'Website',      k: 'website',  icon: Globe,    placeholder: 'https://...',        type: 'url'   },
                { label: 'Location',     k: 'location', icon: MapPin,   placeholder: 'City, State, Country', type: 'text' },
              ].map(({ label, k, icon: Icon, placeholder, type }) => (
                <div key={k} className={k === 'location' ? 'sm:col-span-2' : ''}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input type={type} placeholder={placeholder}
                     value={form[k as keyof typeof form]}

                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition"
                placeholder="Tell customers about yourself..." />
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button onClick={save} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'}`}>
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span key="s" className="flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" /> Saving...
                  </motion.span>
                ) : saved ? (
                  <motion.span key="d" className="flex items-center gap-2"><CheckCircle2 size={15} /> Saved!</motion.span>
                ) : (
                  <motion.span key="i" className="flex items-center gap-2"><Save size={15} /> Save Profile</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Right: Public profile preview ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Mini store card preview */}
            <div className="h-20 bg-linear-to-br from-amber-600 to-amber-700 relative">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            </div>
            <div className="px-4 pb-4 -mt-8">
              <div className="flex items-end gap-3 mb-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="" fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-black text-slate-900 text-sm">{form.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{profile.storeName}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">{form.bio}</p>

              <div className="mt-4 space-y-2">
                {[
                  { icon: Star,        label: `${profile.rating}★ rating` },
                  { icon: Package,     label: `${profile.totalProducts} products` },
                  { icon: ShoppingBag, label: `${profile.totalSales.toLocaleString()} sales` },
                  { icon: Calendar,    label: `Member since ${joined}` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                    <Icon size={12} className="text-amber-600 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-800 mb-1">Public Profile</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              This information is visible to customers who visit your store page on ElectroMart.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}