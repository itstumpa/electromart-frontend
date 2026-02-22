'use client';

// app/error.tsx — Next.js global error boundary
// Must be a Client Component
// Receives error and reset() function from Next.js

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // In production: send to Sentry / error tracking
    console.error('[ElectroMart Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6 shadow-md shadow-red-100"
        >
          <AlertTriangle size={36} className="text-red-600" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Something went wrong
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            We hit an unexpected error. This has been reported to our team.
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 font-mono bg-slate-100 rounded-lg px-3 py-1.5 inline-block mb-6">
              Error ID: {error.digest}
            </p>
          )}
          {!error.digest && <div className="mb-6" />}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-bold px-6 py-3 rounded-xl transition-all text-sm"
          >
            <Home size={15} />
            Go Home
          </Link>
        </motion.div>

        {/* Support note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-slate-400 mt-8"
        >
          Still having trouble?{' '}
          <Link href="/contact" className="text-amber-600 hover:underline font-semibold">
            Contact Support
          </Link>
        </motion.p>
      </div>
    </div>
  );
}