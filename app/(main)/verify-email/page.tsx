'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyEmail } from '@/api/auth.api';
import { getApiErrorMessage } from '@/utils/api-error';

type Status = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const doVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified!');
      } catch (err) {
        setStatus('error');
        setMessage(getApiErrorMessage(err) || 'Verification failed. The link may have expired.');
      }
    };

    doVerify();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8"
    >
      <section className="px-4 sm:px-6 md:px-8 max-w-lg py-8 mx-auto text-center">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
          status === 'verifying' ? 'bg-amber-100' :
          status === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {status === 'verifying' && (
            <Loader2 size={30} className="text-amber-600 animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle2 size={30} className="text-green-600" />
          )}
          {status === 'error' && (
            <XCircle size={30} className="text-red-600" />
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          {status === 'verifying' && 'Verifying your email…'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
        </h1>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          {message || 'Please wait while we verify your email address.'}
        </p>

        {status !== 'verifying' && (
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors duration-200"
          >
            {status === 'success' ? 'Sign in to your account' : 'Back to login'}
          </Link>
        )}
      </section>
    </motion.div>
  );
}
