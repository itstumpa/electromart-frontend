// app/(payment)/layout.tsx
// Route group: (payment) — no MainNavbar, no MainFooter
// Clean isolated layout for payment result pages only
// URLs: /payment/result?status=success|fail|cancel

import Link from "next/link";
import type { ReactNode } from "react";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col">
      {/* Minimal top bar — logo only, no nav */}
      <header className="shrink-0 px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-sm">
            <span
              className="text-white font-black text-base"
              style={{ fontFamily: "Georgia, serif" }}
            >
              E
            </span>
          </div>
          <span
            className="font-black text-slate-900 text-lg tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Electro<span className="text-amber-600">Mart</span>
          </span>
        </Link>

        {/* Secure payment badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secure Payment
        </div>
      </header>

      {/* Page content — vertically centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">{children}</div>
      </main>

      {/* Minimal footer */}
      <footer className="shrink-0 text-center py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} ElectroMart ·{" "}
        <Link
          href="/contact"
          className="hover:text-amber-600 transition-colors"
        >
          Need help?
        </Link>
      </footer>
    </div>
  );
}
