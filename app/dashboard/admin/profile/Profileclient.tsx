'use client';

import { type ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, CheckCircle2, Mail, Phone, User, Shield } from 'lucide-react';
import { authStorage } from '@/utils/auth-storage';
import { getMe } from '@/src/services/api/auth.api';
import { updateUserProfile } from '@/src/services/api/user.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

export default function AdminProfileClient() {
  const authUser = authStorage.getAuthUser();

  const [userId, setUserId] = useState(authUser?.id ?? '');
  const [form, setForm] = useState({
    name: authUser?.name ?? '',
    email: authUser?.email ?? '',
    phone: '',
    bio: 'Platform administrator account.',
    avatar: authUser?.avatar ?? '',
  });
  const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar ?? '');
  const [loadingMe, setLoadingMe] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const response = await getMe();
        const me = response.data?.data;
        if (!me) return;
        setUserId(me.id);

        const cachedRaw = localStorage.getItem('adminProfileDraft');
        const cached = cachedRaw
          ? (JSON.parse(cachedRaw) as { phone?: string; bio?: string; avatar?: string })
          : null;

        const avatar = cached?.avatar ?? authStorage.getAuthUser()?.avatar ?? '';

        setForm((prev) => ({
          ...prev,
          name: me.name,
          email: me.email,
          phone: cached?.phone ?? prev.phone,
          bio: cached?.bio ?? prev.bio,
          avatar,
        }));
        setAvatarPreview(avatar);

        const existing = authStorage.getAuthUser();
        if (existing) {
          authStorage.setAuthUser({
            ...existing,
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

  const save = async () => {
    if (!userId) {
      toast.error('User ID not loaded');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile(userId, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar.trim() || undefined,
      });

      const existing = authStorage.getAuthUser();
      if (existing) {
        authStorage.setAuthUser({
          ...existing,
          name: form.name.trim(),
          email: form.email.trim(),
          avatar: form.avatar.trim() || undefined,
        });
      }

      localStorage.setItem(
        'adminProfileDraft',
        JSON.stringify({
          phone: form.phone,
          bio: form.bio,
          avatar: form.avatar,
        }),
      );

      setSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  if (loadingMe) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Admin Profile</h1>
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Admin Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your administrator profile information</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-5 mb-6 pb-5 border-b border-slate-100">
          <div className="relative shrink-0">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100">
              {avatarPreview ? (
                <Image src={avatarPreview} alt={form.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-xl">
                  {form.name?.[0]?.toUpperCase() ?? 'A'}
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
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full mt-1.5">
              <Shield size={11} />
              Super Admin
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Full Name *</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Phone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 555 000 0000"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Avatar URL</label>
            <input
              type="url"
              value={form.avatar}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, avatar: e.target.value }));
                setAvatarPreview(e.target.value);
              }}
              placeholder="https://your-image-url.com/avatar.jpg"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={save}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            saved ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'
          }`}
        >
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.span key="s" className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                />
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
  );
}
