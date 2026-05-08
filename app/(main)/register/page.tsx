'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Phone,
  Eye, EyeOff, ArrowRight,
  ShoppingBag, Store, CheckCircle2, AlertCircle,
  Chrome,
  Facebook,
} from 'lucide-react';
import { signupUser } from '@/api/auth.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

type Role = 'CUSTOMER' | 'VENDOR';

function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
const STRENGTH_TEXT  = ['', 'text-red-500', 'text-yellow-600', 'text-blue-600', 'text-green-600'];

export default function RegisterPage() {
  const router = useRouter();

  const [role,   setRole]   = useState<Role>('CUSTOMER');
  const [form,   setForm]   = useState({
    name: '', email: '', phone: '',
    password: '', confirm: '',
    storeName: '',   // vendor only
    agreeTerms: false,
  });
  const [showPw,   setShowPw]   = useState(false);
  const [showCfm,  setShowCfm]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const strength = getPasswordStrength(form.password);
  const pwMatch  = form.confirm ? form.password === form.confirm : null;

  const validate = () => {
    if (!form.name.trim())  return 'Full name is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    if (role === 'VENDOR' && !form.storeName.trim()) return 'Store name is required for vendors.';
    if (!form.agreeTerms) return 'You must agree to the Terms of Service.';
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    try {
      await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      });

      sessionStorage.setItem(
        'auth_notice',
        'Registration completed. Please verify your email, then sign in.'
      );
      // toast.success('Registration completed. Please verify your email.');
      router.push('/login');
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
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
      <section className='max-w-lg mx-auto border shadow-md border-slate-200 rounded-2xl px-4 sm:px-6 md:px-12 py-8'>

      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
          Create an account
        </h1>
        <p className="text-sm text-slate-400 mt-1">Join thousands of happy ElectroMart shoppers</p>
      </div>

      {/* Role switcher */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
        {([
          { value: 'CUSTOMER', label: 'Customer', icon: ShoppingBag },
          { value: 'VENDOR',   label: 'Vendor',   icon: Store },
        ] as { value: Role; label: string; icon: React.ElementType }[]).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => { setRole(value); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
              role === value
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Social */}
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
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs text-slate-400 font-medium">or fill in your details</span>
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

      {/* Form fields */}
      <div className="space-y-4">

        {/* Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="John Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Phone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="tel" placeholder="+1 555 000" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="email" placeholder="john@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
          </div>
        </div>

        {/* Vendor: store name */}
        <AnimatePresence>
          {role === 'VENDOR' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Store Name</label>
              <div className="relative">
                <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="text" placeholder="My Awesome Store" value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Your vendor application will be reviewed within 24 hours.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Strength meter */}
          {form.password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                    i < strength ? STRENGTH_COLOR[strength] : 'bg-slate-200'
                  }`} />
                ))}
              </div>
              <p className={`text-xs font-semibold ${STRENGTH_TEXT[strength]}`}>
                {STRENGTH_LABEL[strength]} password
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type={showCfm ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition ${
                pwMatch === false ? 'border-red-300' : pwMatch === true ? 'border-green-400' : 'border-slate-200'
              }`} />
            <button type="button" onClick={() => setShowCfm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
              {showCfm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {pwMatch === false && (
            <p className="text-xs text-red-500 font-semibold mt-1">Passwords do not match</p>
          )}
          {pwMatch === true && (
            <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={11} /> Passwords match
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <div
            onClick={() => setForm((f) => ({ ...f, agreeTerms: !f.agreeTerms }))}
            className={`w-4.5 h-4.5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
              form.agreeTerms ? 'bg-amber-600 border-amber-600' : 'border-slate-300 group-hover:border-amber-400'
            }`}
          >
            {form.agreeTerms && <CheckCircle2 size={11} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-slate-600 leading-snug">
            I agree to ElectroMart&apos;s{' '}
            <Link href="/terms" className="text-amber-600 font-semibold hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-amber-600 font-semibold hover:underline">Privacy Policy</Link>
          </span>
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
            Creating account...
          </>
        ) : (
          <>
            Create {role === 'VENDOR' ? 'Vendor' : ''} Account
            <ArrowRight size={16} />
          </>
        )}
      </motion.button>

      {/* Login link */}
      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
          Sign in
        </Link>
      </p>
            </section>

    </motion.div>
  );
}