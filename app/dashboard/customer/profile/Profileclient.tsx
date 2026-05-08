'use client';

import { type ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Save, CheckCircle2, Mail,
  Phone, User, MapPin, Calendar,
  ShoppingBag, Heart, Star, Package,
} from 'lucide-react';
import { mockUsers, mockOrders, mockWishlist, mockReviews } from '@/data/mock-data';
import { authStorage } from '@/utils/auth-storage';
import { getMe } from '@/api/auth.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

export default function CustomerProfileClient() {
  const customer = mockUsers.find((u) => u.role === 'CUSTOMER')!;
  const myOrders  = mockOrders.filter((o) => o.customerId === customer.id);
  const myReviews = mockReviews.filter((r) => r.customerId === customer.id);

  const [form, setForm] = useState({
    name:     customer.name,
    email:    customer.email,
    phone:    customer.phone ?? '',
    location: 'New York, NY, USA',
    bio:      'Tech enthusiast and avid online shopper. Love finding the best deals on electronics.',
    avatar:   customer.avatar ?? '',
  });
  const [avatarPreview, setAvatarPreview] = useState(customer.avatar ?? '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const response = await getMe();
        const me = response.data?.data;
        if (!me) return;

        const authUser = authStorage.getAuthUser();
        const cachedProfileRaw = localStorage.getItem('customerProfileDraft');
        const cachedProfile = cachedProfileRaw
          ? (JSON.parse(cachedProfileRaw) as { phone?: string; location?: string; bio?: string; avatar?: string })
          : null;

        const avatar = cachedProfile?.avatar ?? authUser?.avatar ?? '';

        setForm((prev) => ({
          ...prev,
          name: me.name,
          email: me.email,
          phone: cachedProfile?.phone ?? prev.phone,
          location: cachedProfile?.location ?? prev.location,
          bio: cachedProfile?.bio ?? prev.bio,
          avatar,
        }));
        setAvatarPreview(avatar);

        if (authUser) {
          authStorage.setAuthUser({
            ...authUser,
            id: me.id,
            name: me.name,
            email: me.email,
            role: me.role === 'ADMIN' ? 'SUPER_ADMIN' : me.role,
            avatar,
          });
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load profile'));
      } finally {
        setLoadingMe(false);
      }
    };

    loadMe();
  }, []);

  const totalSpent = myOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((s, o) => s + o.total, 0);

  const joined = new Date(customer.createdAt).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    const currentAuthUser = authStorage.getAuthUser();
    if (currentAuthUser) {
      authStorage.setAuthUser({
        ...currentAuthUser,
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim() || undefined,
      });
    }
    localStorage.setItem(
      'customerProfileDraft',
      JSON.stringify({
        phone: form.phone,
        location: form.location,
        bio: form.bio,
        avatar: form.avatar,
      }),
    );
    setSaving(false);
    setSaved(true);
    toast.success('Profile updated');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, avatar: imageDataUrl }));
      setAvatarPreview(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const stats = [
    { icon: ShoppingBag, label: 'Orders',     value: myOrders.length,      color: 'text-amber-700',  bg: 'bg-amber-100' },
    { icon: Heart,       label: 'Wishlist',   value: mockWishlist.length,  color: 'text-rose-600',   bg: 'bg-rose-100' },
    { icon: Star,        label: 'Reviews',    value: myReviews.length,     color: 'text-purple-700', bg: 'bg-purple-100' },
    { icon: Package,     label: 'Delivered',  value: myOrders.filter((o) => o.status === 'delivered').length, color: 'text-green-700', bg: 'bg-green-100' },
  ];

  if (loadingMe) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
          My Profile
        </h1>
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
          My Profile
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Edit form ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <h2 className="font-black text-slate-900 mb-5">Personal Information</h2>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6 pb-5 border-b border-slate-100">
              <div className="relative shrink-0">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt={form.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={28} />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-md">
                  <Camera size={13} />
                  <input type="file" className="sr-only" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <div>
                <p className="font-black text-slate-900">{form.name}</p>
                <p className="text-sm text-slate-500">{form.email}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Customer
                </span>
              </div>
            </div>

            {/* Avatar URL input */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Avatar URL
              </label>
              <input
                type="url"
                placeholder="https://your-image-url.com/avatar.jpg"
                value={form.avatar}
                onChange={(e) => {
                  setForm({ ...form, avatar: e.target.value });
                  setAvatarPreview(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            {/* Fields grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name *', k: 'name',     icon: User,     placeholder: 'John Smith',           type: 'text'  },
                { label: 'Email *',     k: 'email',    icon: Mail,     placeholder: 'john@example.com',     type: 'email' },
                { label: 'Phone',       k: 'phone',    icon: Phone,    placeholder: '+1 555 000 0000',      type: 'tel'   },
                { label: 'Location',    k: 'location', icon: MapPin,   placeholder: 'City, Country',        type: 'text'  },
              ].map(({ label, k, icon: Icon, placeholder, type }) => (
                <div key={k}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[k as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us a little about yourself..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <motion.button
              onClick={save}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                saved
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'
              }`}
            >
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span key="s" className="flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />
                    Saving...
                  </motion.span>
                ) : saved ? (
                  <motion.span key="d" className="flex items-center gap-2">
                    <CheckCircle2 size={15} /> Saved!
                  </motion.span>
                ) : (
                  <motion.span key="i" className="flex items-center gap-2">
                    <Save size={15} /> Save Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Right: stats card ── */}
        <div className="space-y-4">

          {/* Profile summary card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-200 bg-slate-100 mb-3">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="" fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={24} />
                  </div>
                )}
              </div>
              <h3 className="font-black text-slate-900">{form.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{form.email}</p>
              {form.bio && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">{form.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                  <Icon size={16} className={`${color} mx-auto mb-1`} />
                  <p className={`text-lg font-black ${color}`}>{value}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{label}</p>
                </div>
              ))}
            </div>

            {/* Extra info */}
            <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
              {[
                { icon: Calendar, label: `Member since ${joined}` },
                { icon: MapPin,   label: form.location || 'Location not set' },
                { icon: ShoppingBag, label: `$${totalSpent.toFixed(0)} total spent` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                  <Icon size={12} className="text-amber-600 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Verification status */}
          <div className={`rounded-2xl p-4 border ${customer.isVerified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className={customer.isVerified ? 'text-green-600' : 'text-yellow-600'} />
              <p className={`text-sm font-bold ${customer.isVerified ? 'text-green-800' : 'text-yellow-800'}`}>
                {customer.isVerified ? 'Email Verified' : 'Email Not Verified'}
              </p>
            </div>
            {!customer.isVerified && (
              <button className="mt-2 text-xs font-semibold text-yellow-700 hover:text-yellow-800 underline">
                Resend verification email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}