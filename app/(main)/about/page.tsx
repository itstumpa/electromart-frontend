import { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield, Truck, RotateCcw, Award, Users,
  Package, TrendingUp, MapPin, ArrowRight,
} from 'lucide-react';
import Reveal from '../Utilities/Reveal';

export const metadata: Metadata = {
  title: 'About Us — ElectroMart',
  description: 'Learn about ElectroMart — your trusted electronics destination since 2015.',
};

const stats = [
  { value: '50,000+', label: 'Happy Customers', icon: Users },
  { value: '200+',    label: 'Products',          icon: Package },
  { value: '4.9★',   label: 'Average Rating',     icon: Award },
  { value: '99.2%',  label: 'On-time Delivery',   icon: Truck },
];

const values = [
  {
    icon: Shield,
    title: 'Authenticity Guaranteed',
    description: 'Every product is 100% genuine, sourced directly from authorized distributors. No fakes, no grey-market imports — ever.',
  },
  {
    icon: Award,
    title: 'Authorized Reseller',
    description: 'We are an authorized reseller for Apple, Samsung, Sony, Dell and 20+ other major brands. That means official warranties on every purchase.',
  },
  {
    icon: Truck,
    title: 'Lightning-Fast Delivery',
    description: 'Order by 2 PM and get same-day dispatch. Free delivery on all orders above $99. Track your order in real time.',
  },
  {
    icon: RotateCcw,
    title: 'Hassle-Free Returns',
    description: '30-day no-questions-asked return policy. Changed your mind? We make it easy. Full refund, no hidden restocking fees.',
  },
];

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'CEO & Founder',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    bio: '10+ years in consumer electronics retail. Built ElectroMart from a single storefront into a nationwide platform.',
  },
  {
    name: 'Marcus Chen',
    role: 'Head of Procurement',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Former Apple supply chain engineer. Ensures every product meets our strict authenticity and quality standards.',
  },
  {
    name: 'Priya Sharma',
    role: 'Customer Experience Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    bio: 'Obsessed with customer satisfaction. Built our 24/7 support system from the ground up. 98% satisfaction rate.',
  },
  {
    name: 'Carlos Rivera',
    role: 'Head of Logistics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Manages our nationwide delivery network. Responsible for our industry-leading 99.2% on-time delivery rate.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FFFBEB] py-24">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/30 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-300/20 blur-3xl rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-4 block">
              Our Story
            </span>
            <h1
              className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              We Believe in Tech That{' '}
              <span className="text-amber-600">Empowers</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Founded in 2015 with a single mission: make premium, authentic technology accessible
              to everyone. No compromises on quality. No tolerance for counterfeits.
              Just genuine products at fair prices, delivered fast.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.1} direction="up">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/20 flex items-center justify-center">
                    <Icon size={22} className="text-amber-400" />
                  </div>
                  <p
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {value}
                  </p>
                  <p className="text-sm text-slate-400 font-medium">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal direction="right">
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                    alt="Our store"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-xl p-5 border border-amber-100 w-48">
                  <p className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>2015</p>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Year Founded</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp size={14} className="text-amber-600" />
                    <span className="text-xs text-amber-700 font-semibold">Growing every year</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <div className="flex flex-col gap-5">
                <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">How it started</span>
                <h2 className="text-4xl font-black text-slate-900 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                  From a Garage to a<br />
                  <span className="text-amber-600">National Platform</span>
                </h2>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    ElectroMart started in 2015 when our founder Sarah Mitchell noticed a gap in the market:
                    customers were getting ripped off by counterfeit electronics sold online, with no recourse
                    and zero warranty support.
                  </p>
                  <p>
                    Starting with just 20 Apple products in a small warehouse, we built a reputation for one
                    thing above everything else — trust. Every product verified. Every order fulfilled.
                    Every customer heard.
                  </p>
                  <p>
                    Today we carry 200+ products from the world's leading brands, serve 50,000+ customers
                    nationwide, and maintain a 4.9-star average rating. But we're still driven by that same
                    founding principle: authentic tech at a fair price.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-amber-200 w-fit"
                >
                  Shop Our Collection
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-[#FFFBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-3 block">What we stand for</span>
            <h2 className="text-4xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Our <span className="text-amber-600">Core Values</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 0.08} direction="up">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 h-full flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <Icon size={22} className="text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-3 block">The people behind ElectroMart</span>
            <h2 className="text-4xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Meet the <span className="text-amber-600">Team</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08} direction="up">
                <div className="group text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                  <p className="text-amber-600 text-sm font-semibold mt-0.5">{member.role}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mt-2">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="py-16 bg-[#FFFBEB]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <MapPin size={22} className="text-amber-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>Visit Us</h2>
            <p className="text-slate-600 text-sm mb-1 font-medium">456 Tech Avenue, Floor 3</p>
            <p className="text-slate-600 text-sm">New York, NY 10001, USA</p>
            <p className="text-slate-400 text-xs mt-3">Mon–Sat: 9 AM – 7 PM · Sun: 11 AM – 5 PM</p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-amber-600">
        <Reveal className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>
            Ready to shop?
          </h2>
          <p className="text-amber-100 mb-6 text-sm">
            Browse 200+ authentic products with genuine warranty and free shipping.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-700 font-black px-8 py-4 rounded-2xl shadow-xl transition-colors text-sm"
          >
            Browse All Products
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}