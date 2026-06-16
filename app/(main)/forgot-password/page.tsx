'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ArrowRight, ArrowLeft,
  CheckCircle2, RefreshCw, AlertCircle,
} from 'lucide-react';
import { forgotPassword } from '@/src/services/api/auth.api';
import { getApiErrorMessage } from '@/utils/api-error';

type Step = 'email' | 'sent';

export default function ForgotPasswordPage() {
  const router  = useRouter();
  const [step,    setStep]    = useState<Step>('email');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resent,  setResent]  = useState(false);

  const handleSend = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setStep('sent');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResent(false);
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch {
      /* ignore resend errors */
    } finally {
      setLoading(false);
    }
  };

  return (
         <motion.div
         initial={{ opacity: 0, y: 18 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
         className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8"
         >
      <AnimatePresence mode="wait">
        <section className='px-4 sm:px-6 md:px-8 max-w-lg py-8 mx-auto'>

        {/* ── Step 1: Enter email ── */}
        {step === 'email' && (
               <motion.div
               key="email"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.22 }}
               >

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
              <Mail size={26} className="text-amber-700" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              Forgot password?
            </h1>
            <p className="text-sm text-slate-400 mb-7 leading-relaxed">
              No worries. Enter your email and we&apos;ll send you a reset link right away.
            </p>

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

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleSend}
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
                  Sending...
                </>
              ) : (
                <>Send Reset Link <ArrowRight size={16} /></>
              )}
            </motion.button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 mt-5 text-sm text-slate-500 hover:text-amber-600 font-semibold transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </motion.div>
        )}

        {/* ── Step 2: Email sent ── */}
        {step === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={32} className="text-green-600" />
            </motion.div>

            <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
              Check your inbox
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-sm font-bold text-slate-900 bg-slate-50 rounded-xl px-4 py-2 inline-block mb-7 border border-slate-200">
              {email}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left mb-7 space-y-2">
              {[
                'Check your spam folder if you don\'t see it',
                'The link expires in 15 minutes',
                'Only the latest link will work',
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <p className="text-xs text-amber-800 font-medium">{tip}</p>
                </div>
              ))}
            </div>

            {/* Resend */}
            <div className="space-y-3">
              <AnimatePresence>
                {resent && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-green-600 font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Reset link resent!
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                onClick={handleResend}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-semibold text-sm rounded-xl transition-all"
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-slate-300 border-t-amber-600 rounded-full block"
                  />
                ) : (
                  <><RefreshCw size={14} /> Resend email</>
                )}
              </button>

              <button
                onClick={() => { setStep('email'); setResent(false); }}
                className="flex items-center justify-center gap-1.5 w-full text-sm text-slate-400 hover:text-amber-600 font-medium transition-colors"
                >
                <ArrowLeft size={13} /> Use a different email
              </button>
            </div>

          </motion.div>
        )}
        </section>
      </AnimatePresence>
    </motion.div>
  );
}