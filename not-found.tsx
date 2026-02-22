// app/not-found.tsx — Next.js custom 404 page
// SERVER component — no 'use client' needed

import Link from 'next/link';
import { Search, Home, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Browse All Products', href: '/products' },
  { label: 'Sale Items',          href: '/sale' },
  { label: 'Contact Support',     href: '/contact' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* Giant 404 */}
        <div className="relative mb-8 select-none">
          <p
            className="text-[9rem] sm:text-[12rem] font-black text-slate-200 leading-none tracking-tighter"
            style={{ fontFamily: "'Georgia', serif" }}
            aria-hidden="true"
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-600 flex items-center justify-center shadow-xl shadow-amber-200">
              <Search size={36} className="text-white" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1
          className="text-2xl sm:text-3xl font-black text-slate-900 mb-3"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Primary CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-3.5 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm mb-8"
        >
          <Home size={16} />
          Back to Home
        </Link>

        {/* Suggestions */}
        <div className="border-t border-slate-200 pt-7">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Or try one of these
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {SUGGESTIONS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 text-sm font-semibold rounded-xl transition-all"
              >
                {label}
                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}