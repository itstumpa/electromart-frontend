'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { mockCart } from '@/data/mock-data';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  {
    label: 'Categories',
    href: '/products',
    dropdown: [
      { label: 'Smartphones', href: '/products?category=smartphones' },
      { label: 'Laptops & Computers', href: '/products?category=laptops-computers' },
      { label: 'Audio & Headphones', href: '/products?category=audio-headphones' },
      { label: 'Cameras', href: '/products?category=cameras-photography' },
      { label: 'Wearables', href: '/products?category=wearables' },
      { label: 'Gaming', href: '/products?category=gaming' },
      { label: 'Smart Home', href: '/products?category=smart-home' },
      { label: 'Accessories', href: '/products?category=accessories' },
    ],
  },
  { label: 'Sale', href: '/sale', highlight: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function MainNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);

  const cartCount = mockCart.itemCount;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <span className="text-white font-black text-lg leading-none" style={{ fontFamily: 'Georgia, serif' }}>
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
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setCategoryOpen(true)}
                  onMouseLeave={() => setCategoryOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50">
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {categoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    link.highlight
                      ? 'text-amber-600 hover:bg-amber-50'
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  {link.highlight && (
                    <span className="inline-flex items-center gap-1">
                      <Zap size={12} className="text-amber-500" />
                      {link.label}
                    </span>
                  )}
                  {!link.highlight && link.label}
                </Link>
              )
            )}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/customer/wishlist"
              className="p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
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
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Search Bar (expands below navbar) ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="py-3 flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                  onClick={() => setSearchOpen(false)}
                  className="text-sm text-slate-500 hover:text-slate-700 px-2 font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link, i) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Categories
                    </p>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-5 py-2 text-sm text-slate-600 hover:text-amber-600"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      link.highlight
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-2 border-t border-slate-100 mt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-600 text-white font-semibold rounded-xl text-sm"
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