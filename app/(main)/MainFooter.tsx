'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
//   Zap,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
} from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'Smartphones', href: '/products?category=smartphones' },
    { label: 'Laptops & Computers', href: '/products?category=laptops-computers' },
    { label: 'Audio & Headphones', href: '/products?category=audio-headphones' },
    { label: 'Cameras', href: '/products?category=cameras-photography' },
    { label: 'Gaming', href: '/products?category=gaming' },
    { label: 'Sale', href: '/sale' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Track Your Order', href: '/customer/orders' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Warranty Info', href: '/warranty' },
    { label: 'Become a Vendor', href: '/vendor/apply' },
  ],
};

export default function MainFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-white">

      {/* Trust bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $99' },
              { icon: ShieldCheck, title: '2 Year Warranty', desc: 'All products covered' },
              { icon: CreditCard, title: 'Secure Payment', desc: 'SSLCommerz protected' },
              { icon: ArrowRight, title: '30-Day Returns', desc: 'No questions asked' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                <span className="text-white font-black text-xl" style={{ fontFamily: 'Georgia, serif' }}>
                  E
                </span>
              </div>
              <span
                className="text-xl font-black tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Electro<span className="text-amber-400">Mart</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your trusted destination for the latest electronics and tech. Authorized
              reseller for Apple, Samsung, Sony, Dell and more.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <a href="tel:+15550001234" className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors">
                <Phone size={14} className="text-amber-500 shrink-0" />
                +1 (555) 000-1234
              </a>
              <a href="mailto:support@electromart.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors">
                <Mail size={14} className="text-amber-500 shrink-0" />
                support@electromart.com
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin size={14} className="text-amber-500 shrink-0" />
                456 Tech Avenue, New York, NY 10001
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-bold text-white mb-3">
                Get deals straight to your inbox
              </p>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm font-medium"
                >
                  <ShieldCheck size={15} />
                  You&apos;re subscribed! Check your inbox.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-xl text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ElectroMart. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Youtube, href: '#', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 bg-slate-800 hover:bg-amber-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Payments secured by SSLCommerz
          </p>
        </div>
      </div>
    </footer>
  );
}