'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight, CheckCircle2,
  Chrome,
  Eye, EyeOff,
  Facebook,
  Lock,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw,    setShowPw]    = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call — swap with: await signIn('credentials', { ...form })
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    router.push('/dashboard/customer');
  };

  const socials = [
    {
      name: 'Google',
      logo: <Chrome size={18} className="text-red-500" />,
    },
    {
      name: 'Facebook',
      logo: <Facebook size={18} className="text-blue-600" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8"
    >
      {/* Heading */}
      <section className='max-w-lg border shadow-md border-slate-200 rounded-2xl py-12 mx-auto px-4 sm:px-6 md:px-8'>

      <div className="mb-7">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
          Welcome back
        </h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to your ElectroMart account</p>
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {socials.map(({ name, logo }) => (
          <button
            key={name}
            className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors"
          >
            {logo}
            {name}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs text-slate-400 font-medium">or continue with email</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3 mb-5"
          >
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => setRemember((v) => !v)}
            className={`w-4.5 h-4.5  rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
              remember ? 'bg-amber-600 border-amber-600' : 'border-slate-300 group-hover:border-amber-400'
            }`}
          >
            {remember && <CheckCircle2 size={11} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-slate-600 font-medium">Keep me signed in</span>
        </label>
      </div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 mt-6 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
            />
            Signing in...
          </>
        ) : (
          <>Sign In <ArrowRight size={16} /></>
        )}
      </motion.button>

      {/* Register link */}
      <p className="text-center text-sm text-slate-500 mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
          Create one free
        </Link>
      </p>
          </section>
    </motion.div>

  );
}