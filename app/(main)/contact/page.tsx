'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock,
  Send, CheckCircle2, MessageCircle,
  Headphones, ChevronDown,
} from 'lucide-react';
import Reveal from '../Utilities/Reveal';

const faqs = [
  { q: 'How do I track my order?', a: 'After dispatch you will receive a tracking number via email. You can also track your order in real time from your customer dashboard under "My Orders".' },
  { q: 'Are all products covered by warranty?', a: 'Yes — every product sold on ElectroMart carries the official manufacturer warranty. Apple products come with 1-year Apple warranty, and we offer an optional extended 2-year plan.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day no-questions-asked return policy. Simply raise a return request from your dashboard and we will arrange a free pickup within 48 hours.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship across the USA. International shipping to Canada and UK is coming Q2 2025. Join our newsletter to be notified first.' },
  { q: 'How do I become a vendor on ElectroMart?', a: 'Apply via the Vendor Portal link in the footer. Our team reviews applications within 3 business days. Authorized resellers and brand-authorized dealers are prioritized.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // simulate API
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-xl">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2 block">Get in touch</span>
            <h1 className="text-5xl font-black text-slate-900 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
              We&apos;re Here to <span className="text-amber-600">Help</span>
            </h1>
            <p className="text-slate-500 text-base mt-3 leading-relaxed">
              Have a question about an order, a product, or just want to say hello?
              Our support team typically responds within 2 hours.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Left: info + quick support ── */}
          <div className="flex flex-col gap-6 lg:col-span-1">

            {/* Contact cards */}
            {[
              { icon: Phone,   label: 'Phone',   value: '+1 (555) 000-1234',          sub: 'Mon–Sat 9 AM – 7 PM EST', href: 'tel:+15550001234' },
              { icon: Mail,    label: 'Email',   value: 'support@electromart.com',     sub: 'Reply within 2 hours', href: 'mailto:support@electromart.com' },
              { icon: MapPin,  label: 'Address', value: '456 Tech Avenue, Floor 3',   sub: 'New York, NY 10001', href: '#' },
              { icon: Clock,   label: 'Hours',   value: 'Mon–Sat: 9 AM – 7 PM',      sub: 'Sun: 11 AM – 5 PM', href: '#' },
            ].map(({ icon: Icon, label, value, sub, href }, i) => (
              <Reveal key={label} delay={i * 0.07} direction="right">
                <a href={href} className="group flex items-start gap-4 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md hover:shadow-amber-50 p-5 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-600 transition-colors duration-300">
                    <Icon size={18} className="text-amber-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                  </div>
                </a>
              </Reveal>
            ))}

            {/* Live chat CTA */}
            <Reveal delay={0.3} direction="right">
              <div className="bg-amber-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Live Chat</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                      <span className="text-amber-100 text-xs">3 agents online now</span>
                    </div>
                  </div>
                </div>
                <p className="text-amber-100 text-xs leading-relaxed mb-3">
                  Need an instant answer? Chat with our support team in real time.
                </p>
                <button className="w-full bg-white hover:bg-amber-50 text-amber-700 font-bold text-sm py-2.5 rounded-xl transition-colors">
                  Start Live Chat
                </button>
              </div>
            </Reveal>
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-2">
            <Reveal direction="left">
              <div className="bg-white rounded-3xl border border-slate-100 p-7 sm:p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                  Send Us a Message
                </h2>
                <p className="text-slate-400 text-sm mb-8">Fill in the form and we will be in touch within 2 hours.</p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-12 gap-4"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                      <p className="text-slate-500 text-sm max-w-xs">
                        Thank you for reaching out. Our team will reply to <span className="font-semibold text-slate-700">{form.email}</span> within 2 hours.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                        className="mt-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-colors"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Full Name *</label>
                          <input
                            type="text" required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="John Smith"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Email Address *</label>
                          <input
                            type="email" required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Subject *</label>
                        <div className="relative">
                          <select
                            required value={form.subject}
                            onChange={e => setForm({ ...form, subject: e.target.value })}
                            className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer"
                          >
                            <option value="">Select a subject...</option>
                            <option value="order">Order Issue</option>
                            <option value="product">Product Question</option>
                            <option value="return">Return / Refund</option>
                            <option value="warranty">Warranty Claim</option>
                            <option value="vendor">Vendor Application</option>
                            <option value="other">Other</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Message *</label>
                        <textarea
                          required rows={5}
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          placeholder="Describe your issue or question in detail..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md shadow-amber-200"
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <>
                            <Send size={15} />
                            Send Message
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-16">
          <Reveal className="text-center mb-10">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2 block">Common questions</span>
            <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Frequently Asked <span className="text-amber-600">Questions</span>
            </h2>
          </Reveal>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-amber-600 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}