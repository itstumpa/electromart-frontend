'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle2,
  MapPin, CreditCard, ShoppingBag,
  Home, Briefcase, Plus, Shield, Lock,
} from 'lucide-react';
import { mockCart, mockAddresses } from '@/data/mock-data';

// ─── Types ───────────────────────────────────────────────────
type Step = 'address' | 'payment' | 'review';

interface ShippingForm {
  fullName: string; phone: string; street: string;
  city: string; state: string; zipCode: string; country: string;
}

interface PaymentForm {
  method: 'card' | 'cod';
  cardNumber: string; cardName: string;
  expiry: string; cvv: string;
}

// ─── Step indicator ───────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'address', label: 'Address',  icon: MapPin      },
    { key: 'payment', label: 'Payment',  icon: CreditCard  },
    { key: 'review',  label: 'Review',   icon: ShoppingBag },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const Icon    = step.icon;
        const done    = i < idx;
        const active  = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={[
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                done   ? 'bg-green-600 text-white'  : '',
                active ? 'bg-amber-600 text-white shadow-md shadow-amber-200' : '',
                !done && !active ? 'bg-slate-200 text-slate-400' : '',
              ].join(' ')}>
                {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <span className={`text-xs font-bold hidden sm:block ${active ? 'text-amber-700' : done ? 'text-green-700' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors duration-300 ${i < idx ? 'bg-green-500' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Address ─────────────────────────────────────────
function AddressStep({
  onNext,
}: {
  onNext: (data: ShippingForm) => void;
}) {
  const [useExisting,  setUseExisting]  = useState<string>(mockAddresses[0].id);
  const [showNewForm,  setShowNewForm]  = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    fullName: '', phone: '', street: '',
    city: '', state: '', zipCode: '', country: 'USA',
  });

  const handleContinue = () => {
    if (!showNewForm) {
      const addr = mockAddresses.find((a) => a.id === useExisting)!;
      onNext({
        fullName: addr.fullName, phone: addr.phone, street: addr.street,
        city: addr.city, state: addr.state, zipCode: addr.zipCode, country: addr.country,
      });
    } else {
      if (!form.fullName || !form.phone || !form.street || !form.city || !form.zipCode) return;
      onNext(form);
    }
  };

  const Field = ({ label, k, placeholder, half }: { label: string; k: keyof ShippingForm; placeholder?: string; half?: boolean }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <input
        type="text" placeholder={placeholder}
        value={form[k]}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Shipping Address</h2>
        <p className="text-sm text-slate-400">Where should we deliver your order?</p>
      </div>

      {/* Saved addresses */}
      {!showNewForm && (
        <div className="space-y-3">
          {mockAddresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                useExisting === addr.id ? 'border-amber-600 bg-amber-50' : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              <input type="radio" name="address" value={addr.id} checked={useExisting === addr.id}
                onChange={() => setUseExisting(addr.id)} className="mt-1 accent-amber-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {addr.label === 'home' ? <Home size={14} className="text-amber-600" /> : <Briefcase size={14} className="text-blue-600" />}
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900">{addr.fullName}</p>
                <p className="text-sm text-slate-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-sm text-slate-400">{addr.phone}</p>
              </div>
            </label>
          ))}

          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-400 text-slate-500 hover:text-amber-700 text-sm font-semibold transition-all"
          >
            <Plus size={16} /> Use a different address
          </button>
        </div>
      )}

      {/* New address form */}
      {showNewForm && (
        <div className="space-y-4">
          <button onClick={() => setShowNewForm(false)} className="text-sm text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1">
            ← Back to saved addresses
          </button>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name"   k="fullName"  placeholder="John Smith"   />
            <Field label="Phone"       k="phone"     placeholder="+1 (555) 000-0000" />
            <Field label="Street Address" k="street" placeholder="123 Main Street, Apt 4B" />
            <Field label="City"        k="city"      placeholder="New York"     half />
            <Field label="State"       k="state"     placeholder="NY"           half />
            <Field label="ZIP Code"    k="zipCode"   placeholder="10001"        half />
            <Field label="Country"     k="country"   placeholder="USA"          half />
          </div>
        </div>
      )}

      <button
        onClick={handleContinue}
        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl transition-colors shadow-md shadow-amber-200"
      >
        Continue to Payment <ChevronRight size={17} />
      </button>
    </div>
  );
}

// ─── Step 2: Payment ─────────────────────────────────────────
function PaymentStep({
  onNext, onBack,
}: {
  onNext: (data: PaymentForm) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<PaymentForm>({
    method: 'card', cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const formatCard   = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  const handleContinue = () => {
    if (form.method === 'cod') { onNext(form); return; }
    if (!form.cardNumber || !form.cardName || !form.expiry || !form.cvv) return;
    onNext(form);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Payment Method</h2>
        <p className="text-sm text-slate-400">All transactions are encrypted and secure.</p>
      </div>

      {/* Method selection */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: 'card', label: 'Credit / Debit Card', icon: CreditCard },
          { value: 'cod',  label: 'Cash on Delivery',    icon: ShoppingBag },
        ].map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
              form.method === value
                ? 'border-amber-600 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-white hover:border-amber-300 text-slate-600'
            }`}
          >
            <input type="radio" name="method" value={value} checked={form.method === value}
              onChange={() => setForm({ ...form, method: value as 'card' | 'cod' })} className="sr-only" />
            <Icon size={22} className={form.method === value ? 'text-amber-600' : 'text-slate-400'} />
            <span className="text-sm font-bold">{label}</span>
          </label>
        ))}
      </div>

      {/* Card details */}
      <AnimatePresence>
        {form.method === 'card' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {/* Card preview */}
            <div className="relative h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 rounded-2xl p-5 mb-5 overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute top-3 right-5 opacity-30">
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded-full bg-amber-400" />
                  <div className="w-8 h-8 rounded-full bg-amber-600 -ml-4" />
                </div>
              </div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">ElectroMart Pay</p>
              <p className="text-white font-mono text-base tracking-widest mb-4">
                {form.cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between">
                <div>
                  <p className="text-white/50 text-[9px] uppercase">Card Holder</p>
                  <p className="text-white text-xs font-bold">{form.cardName || 'YOUR NAME'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[9px] uppercase">Expires</p>
                  <p className="text-white text-xs font-bold">{form.expiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Cardholder Name</label>
                <input type="text" placeholder="John Smith" value={form.cardName}
                  onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">CVV</label>
                  <input type="password" placeholder="•••" maxLength={4} value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <Lock size={12} /> Your payment information is encrypted with SSL
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {form.method === 'cod' && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-amber-800 font-medium">
          💵 Pay in cash when your order arrives. Have the exact amount ready.
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1 px-5 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={handleContinue}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3 rounded-xl transition-colors shadow-md shadow-amber-200">
          Review Order <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Review ───────────────────────────────────────────
function ReviewStep({
  address, payment, onBack, onPlace,
}: {
  address: ShippingForm;
  payment: PaymentForm;
  onBack: () => void;
  onPlace: () => void;
}) {
  const [placing, setPlacing] = useState(false);
  const items     = mockCart.items;
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = subtotal >= 99 ? 0 : 14.99;
  const tax       = subtotal * 0.09;
  const total     = subtotal + shipping + tax;

  const handlePlace = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    onPlace();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Review Your Order</h2>
        <p className="text-sm text-slate-400">Double-check everything before placing your order.</p>
      </div>

      {/* Items */}
      <div className="bg-slate-50 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Items ({items.length})</p>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                {item.variant && <p className="text-xs text-slate-400">{item.variant}</p>}
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-slate-900 shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Payment summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <MapPin size={12} /> Ship To
          </p>
          <p className="text-sm font-bold text-slate-900">{address.fullName}</p>
          <p className="text-sm text-slate-600">{address.street}</p>
          <p className="text-sm text-slate-600">{address.city}, {address.state} {address.zipCode}</p>
          <p className="text-sm text-slate-400 mt-1">{address.phone}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CreditCard size={12} /> Payment
          </p>
          {payment.method === 'card' ? (
            <>
              <p className="text-sm font-bold text-slate-900">Credit / Debit Card</p>
              <p className="text-sm text-slate-500 font-mono mt-1">
                •••• •••• •••• {payment.cardNumber.replace(/\s/g, '').slice(-4)}
              </p>
              <p className="text-sm text-slate-400">{payment.cardName}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
              <p className="text-sm text-slate-400 mt-1">Pay when you receive your order</p>
            </>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-slate-600"><span>Shipping</span><span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between text-slate-600"><span>Tax (9%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-black text-base border-t border-slate-100 pt-2.5 mt-1">
          <span>Total</span><span className="text-amber-700">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
        <Shield size={13} className="text-green-600 shrink-0" />
        Your order is protected by ElectroMart Buyer Protection.
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-1 px-5 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <motion.button
          onClick={handlePlace}
          disabled={placing}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black py-3 rounded-xl transition-colors shadow-md shadow-amber-200"
        >
          {placing ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />
              Placing Order...
            </>
          ) : (
            <>Place Order — ${total.toFixed(2)}</>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>('address');
  const [address, setAddress] = useState<ShippingForm | null>(null);
  const [payment, setPayment] = useState<PaymentForm | null>(null);

  const subtotal = mockCart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 14.99;
  const tax      = subtotal * 0.09;
  const total    = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link href="/cart" className="hover:text-amber-600 transition-colors">Cart</Link>
            <ChevronRight size={11} />
            <span className="text-slate-700 font-semibold capitalize">Checkout</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Form area ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === 'address' && (
                    <AddressStep onNext={(data) => { setAddress(data); setStep('payment'); }} />
                  )}
                  {step === 'payment' && (
                    <PaymentStep
                      onNext={(data) => { setPayment(data); setStep('review'); }}
                      onBack={() => setStep('address')}
                    />
                  )}
                  {step === 'review' && address && payment && (
                    <ReviewStep
                      address={address}
                      payment={payment}
                      onBack={() => setStep('payment')}
                      onPlace={() => router.push('/order-confirmation/EM-2024-006')}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Mini order summary (sticky) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
              <h3 className="font-black text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {mockCart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="44px" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.productName}</p>
                      {item.variant && <p className="text-[10px] text-slate-400">{item.variant}</p>}
                    </div>
                    <p className="text-xs font-black text-slate-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-black text-base border-t border-slate-100 pt-2">
                  <span>Total</span><span className="text-amber-700">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}