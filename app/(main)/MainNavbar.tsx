'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Zap,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Gamepad2,
  Home,
  Cable,
} from 'lucide-react';
import { mockCart } from '@/data/mock-data';
import { search } from '../(main)/search/page'

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */

const categoryItems = [
  { label: 'Smartphones',       href: '/products?category=smartphones',       icon: Smartphone },
  { label: 'Laptops & Computers', href: '/products?category=laptops-computers', icon: Laptop },
  { label: 'Audio & Headphones', href: '/products?category=audio-headphones',  icon: Headphones },
  { label: 'Cameras',           href: '/products?category=cameras-photography', icon: Camera },
  { label: 'Wearables',         href: '/products?category=wearables',          icon: Watch },
  { label: 'Gaming',            href: '/products?category=gaming',             icon: Gamepad2 },
  { label: 'Smart Home',        href: '/products?category=smart-home',         icon: Home },
  { label: 'Accessories',       href: '/products?category=accessories',        icon: Cable },
];

const navLinks = [
  { label: 'Home',       href: '/' },
  { label: 'Products',   href: '/products' },
  { label: 'Categories', href: '/products', dropdown: true },
  { label: 'Sale',       href: '/sale',     highlight: true },
  { label: 'About',      href: '/about' },
  { label: 'Contact',    href: '/contact' },
];

/* ─────────────────────────────────────────────
   ACTIVE HELPERS
───────────────────────────────────────────── */

function useIsActive(href: string, exact = false): boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (href === '/') return pathname === '/';

  // For category hrefs like /products?category=smartphones
  if (href.includes('?')) {
    const [path, query] = href.split('?');
    const [key, val] = query.split('=');
    return pathname === path && searchParams.get(key) === val;
  }

  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

/* ─────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────── */

export default function MainNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartCount = mockCart.itemCount;

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname, searchParams]);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Is any category currently selected?
  const isCategoryActive = categoryItems.some(
    (c) => pathname === '/products' && searchParams.get('category') === c.href.split('category=')[1]
  );

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? 'shadow-md shadow-amber-100/60' : 'border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center shadow-sm group-hover:bg-amber-700 transition-colors">
              <span
                className="text-white font-black text-lg leading-none"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                E
              </span>
            </div>
            <span
              className="text-xl font-black text-slate-900 tracking-tight hidden sm:block"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.03em' }}
            >
              Electro<span className="text-amber-600">Mart</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              // ── Categories dropdown ──
              if (link.dropdown) {
                return (
                  <div
                    key={link.label}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                        isCategoryActive
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Active indicator dot */}
                    {isCategoryActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600" />
                    )}

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden py-2"
                        >
                          {/* Dropdown header */}
                          <div className="px-4 pt-1 pb-2 border-b border-slate-100 mb-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Shop by Category
                            </p>
                          </div>

                          {categoryItems.map((item) => {
                            const Icon = item.icon;
                            const cat = item.href.split('category=')[1];
                            const isActive =
                              pathname === '/products' && searchParams.get('category') === cat;

                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  isActive
                                    ? 'bg-amber-50 text-amber-700 font-semibold'
                                    : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                                }`}
                              >
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  <Icon size={14} />
                                </span>
                                {item.label}
                                {isActive && (
                                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-600" />
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // ── Regular nav link ──
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href && !searchParams.get('category');

              return (
                <div key={link.label} className="relative">
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                      link.highlight
                        ? isActive
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-amber-600 hover:bg-amber-50'
                        : isActive
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    {link.highlight && <Zap size={12} className="text-amber-500" />}
                    {link.label}
                  </Link>

                  {/* Active underline dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Search size={20} />
              <search />
            </button>

            {/* Wishlist */}
            <Link
              href="/customer/wishlist"
              aria-label="Wishlist"
              className={`p-2 rounded-lg transition-colors hidden sm:flex ${
                pathname === '/customer/wishlist'
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className={`relative p-2 rounded-lg transition-colors ${
                pathname === '/cart'
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Sign In */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 ml-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-amber-200"
            >
              <User size={15} />
              Sign In
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-amber-50 transition-colors ml-1"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Search bar (expands below) ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="py-3 px-2 flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search smartphones, laptops, headphones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-sm text-slate-500 hover:text-slate-800 font-semibold px-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">

              {/* Regular nav links */}
              {navLinks.map((link) => {
                if (link.dropdown) {
                  // ── Categories accordion ──
                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileCatOpen(!mobileCatOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isCategoryActive
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isCategoryActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          )}
                          {link.label}
                        </span>
                        <ChevronDown
                          size={15}
                          className={`text-slate-400 transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileCatOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 mb-1 ml-3 pl-3 border-l-2 border-amber-100 flex flex-col gap-0.5">
                              {categoryItems.map((item) => {
                                const Icon = item.icon;
                                const cat = item.href.split('category=')[1];
                                const isActive =
                                  pathname === '/products' && searchParams.get('category') === cat;

                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                      isActive
                                        ? 'bg-amber-50 text-amber-700 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                  >
                                    <span
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                        isActive ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                                      }`}
                                    >
                                      <Icon size={14} />
                                    </span>
                                    {item.label}
                                    {isActive && (
                                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Regular mobile link
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href && !searchParams.get('category');

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      link.highlight
                        ? isActive
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-amber-600 hover:bg-amber-50'
                        : isActive
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    )}
                    {link.highlight && !isActive && (
                      <Zap size={13} className="text-amber-500 shrink-0" />
                    )}
                    {link.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="border-t border-slate-100 mt-2 pt-3 flex flex-col gap-2">
                {/* Wishlist & Cart row */}
                <div className="flex gap-2">
                  <Link
                    href="/customer/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      pathname === '/customer/wishlist'
                        ? 'border-amber-300 bg-amber-50 text-amber-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Heart size={15} />
                    Wishlist
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors relative ${
                      pathname === '/cart'
                        ? 'border-amber-300 bg-amber-50 text-amber-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ShoppingCart size={15} />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute top-2 right-6 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Sign In */}
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-amber-200"
                >
                  <User size={15} />
                  Sign In
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}