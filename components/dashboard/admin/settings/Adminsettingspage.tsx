'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Store, Shield, Bell,
  Camera, Save, Eye, EyeOff,
  CheckCircle2, Mail, Phone,
  Globe, MapPin, Lock, Smartphone,
  ToggleLeft, ToggleRight,
} from 'lucide-react';
import { mockUsers } from '@/data/mock-data';

// ─── Types ────────────────────────────────────────────────
type Tab = 'profile' | 'store' | 'security' | 'notifications';

interface SaveState { saving: boolean; saved: boolean }

// ─── Reusable field components ────────────────────────────
function Field({
  label, type = 'text', value, onChange, placeholder, icon: Icon, disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        )}
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800',
            'placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400',
            'focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed',
            Icon ? 'pl-10 pr-4' : 'px-4',
            isPassword ? 'pr-10' : '',
          ].join(' ')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label, sub, value, onChange,
}: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
          value ? 'bg-amber-600' : 'bg-slate-200'
        }`}
      >
        <motion.span
          animate={{ x: value ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
        state.saved
          ? 'bg-green-600 text-white shadow-md shadow-green-200'
          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'
      }`}
    >
      <AnimatePresence mode="wait">
        {state.saving ? (
          <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
            />
            Saving...
          </motion.span>
        ) : state.saved ? (
          <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            <CheckCircle2 size={15} /> Saved!
          </motion.span>
        ) : (
          <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            <Save size={15} /> Save Changes
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────
function ProfileTab() {
  const admin = mockUsers.find((u) => u.role === 'SUPER_ADMIN')!;
  const [form, setForm] = useState({
    name:   admin.name,
    email:  admin.email,
    phone:  admin.phone ?? '',
    bio:    'Platform administrator at ElectroMart. Managing operations since 2023.',
    website: 'https://electromart.com',
  });
  const [saveState, setSaveState] = useState<SaveState>({ saving: false, saved: false });

  const handleSave = async () => {
    setSaveState({ saving: true, saved: false });
    await new Promise((r) => setTimeout(r, 1200));
    setSaveState({ saving: false, saved: true });
    setTimeout(() => setSaveState({ saving: false, saved: false }), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={admin.avatar}
            alt={admin.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200"
          />
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <p className="font-bold text-slate-900">{admin.name}</p>
          <p className="text-sm text-slate-400 mt-0.5">{admin.email}</p>
          <p className="text-xs text-amber-600 font-semibold mt-1 uppercase tracking-widest">Super Admin</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name"     icon={User}  value={form.name}    onChange={(v) => setForm({ ...form, name: v })}    placeholder="Your full name" />
        <Field label="Email Address" icon={Mail}  value={form.email}   onChange={(v) => setForm({ ...form, email: v })}   placeholder="admin@electromart.com" type="email" />
        <Field label="Phone Number"  icon={Phone} value={form.phone}   onChange={(v) => setForm({ ...form, phone: v })}   placeholder="+1 (555) 000-0000" />
        <Field label="Website"       icon={Globe} value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://..." />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton state={saveState} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─── Tab: Store ───────────────────────────────────────────
function StoreTab() {
  const [form, setForm] = useState({
    storeName:    'ElectroMart',
    tagline:      'Premium Electronics, Guaranteed Authentic',
    supportEmail: 'support@electromart.com',
    supportPhone: '+1 (555) 000-1234',
    address:      '456 Tech Avenue, Floor 3, New York, NY 10001',
    currency:     'USD',
    timezone:     'America/New_York',
    taxRate:      '9.0',
    shippingFee:  '14.99',
    freeShippingThreshold: '99',
    couponCode:   'ELECTRO20',
    couponDiscount: '20',
  });
  const [saveState, setSaveState] = useState<SaveState>({ saving: false, saved: false });

  const handleSave = async () => {
    setSaveState({ saving: true, saved: false });
    await new Promise((r) => setTimeout(r, 1200));
    setSaveState({ saving: false, saved: true });
    setTimeout(() => setSaveState({ saving: false, saved: false }), 2500);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="flex-1 h-px bg-slate-100" />
        {title}
        <span className="flex-1 h-px bg-slate-100" />
      </h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      <Section title="General">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Store Name"     icon={Store} value={form.storeName}    onChange={(v) => setForm({ ...form, storeName: v })}    placeholder="ElectroMart" />
          <Field label="Support Email"  icon={Mail}  value={form.supportEmail} onChange={(v) => setForm({ ...form, supportEmail: v })} placeholder="support@..." type="email" />
          <Field label="Support Phone"  icon={Phone} value={form.supportPhone} onChange={(v) => setForm({ ...form, supportPhone: v })} placeholder="+1 ..." />
          <Field label="Address"        icon={MapPin} value={form.address}      onChange={(v) => setForm({ ...form, address: v })}      placeholder="Street, City, State" />
        </div>
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Tagline</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="Your store tagline..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>
      </Section>

      <Section title="Regional">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Currency</label>
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition">
              <option value="USD">USD — US Dollar</option>
              <option value="BDT">BDT — Bangladeshi Taka</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Timezone</label>
            <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Asia/Dhaka">Bangladesh Standard Time (BST)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Pricing & Shipping">
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Tax Rate (%)"         value={form.taxRate}                 onChange={(v) => setForm({ ...form, taxRate: v })}                 placeholder="9.0"   />
          <Field label="Default Shipping ($)" value={form.shippingFee}             onChange={(v) => setForm({ ...form, shippingFee: v })}             placeholder="14.99" />
          <Field label="Free Shipping Above ($)" value={form.freeShippingThreshold} onChange={(v) => setForm({ ...form, freeShippingThreshold: v })} placeholder="99"    />
        </div>
      </Section>

      <Section title="Active Coupon">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Coupon Code"    value={form.couponCode}     onChange={(v) => setForm({ ...form, couponCode: v })}     placeholder="ELECTRO20" />
          <Field label="Discount (%)"   value={form.couponDiscount} onChange={(v) => setForm({ ...form, couponDiscount: v })} placeholder="20"        />
        </div>
      </Section>

      <div className="flex justify-end pt-2">
        <SaveButton state={saveState} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─── Tab: Security ────────────────────────────────────────
function SecurityTab() {
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [twoFA,     setTwoFA]     = useState(false);
  const [sessions,] = useState([
    { id: '1', device: 'Chrome · Windows 11',    location: 'New York, US',    time: 'Active now',   current: true },
    { id: '2', device: 'Safari · iPhone 15 Pro', location: 'Brooklyn, US',    time: '2 hours ago',  current: false },
    { id: '3', device: 'Firefox · macOS',        location: 'New York, US',    time: '3 days ago',   current: false },
  ]);
  const [saveState, setSaveState] = useState<SaveState>({ saving: false, saved: false });

  const passwordStrength = (() => {
    const p = passwords.newPass;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8)          score++;
    if (/[A-Z]/.test(p))        score++;
    if (/[0-9]/.test(p))        score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleSave = async () => {
    if (passwords.newPass !== passwords.confirm) return;
    setSaveState({ saving: true, saved: false });
    await new Promise((r) => setTimeout(r, 1200));
    setSaveState({ saving: false, saved: true });
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSaveState({ saving: false, saved: false }), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Change password */}
      <div>
        <h3 className="font-black text-slate-900 mb-1">Change Password</h3>
        <p className="text-sm text-slate-400 mb-5">Use a strong password with at least 8 characters.</p>
        <div className="space-y-4 max-w-md">
          <Field label="Current Password" type="password" value={passwords.current}
            onChange={(v) => setPasswords({ ...passwords, current: v })} icon={Lock} />
          <Field label="New Password"     type="password" value={passwords.newPass}
            onChange={(v) => setPasswords({ ...passwords, newPass: v })} icon={Lock} />

          {/* Strength bar */}
          {passwordStrength !== null && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                    i < passwordStrength! ? strengthColor[passwordStrength! - 1] : 'bg-slate-200'
                  }`} />
                ))}
              </div>
              <p className={`text-xs font-semibold ${
                passwordStrength <= 1 ? 'text-red-500' :
                passwordStrength === 2 ? 'text-yellow-600' :
                passwordStrength === 3 ? 'text-blue-600' : 'text-green-600'
              }`}>
                {strengthLabel[passwordStrength - 1]} password
              </p>
            </div>
          )}

          <Field label="Confirm New Password" type="password" value={passwords.confirm}
            onChange={(v) => setPasswords({ ...passwords, confirm: v })} icon={Lock} />

          {passwords.confirm && passwords.newPass !== passwords.confirm && (
            <p className="text-xs text-red-500 font-semibold">Passwords do not match</p>
          )}
        </div>
        <div className="flex justify-start mt-5">
          <SaveButton state={saveState} onClick={handleSave} />
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone size={18} className="text-amber-700" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                Add an extra layer of security. You'll be asked for a code from your authenticator app on each sign-in.
              </p>
              {twoFA && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full mt-2">
                  <CheckCircle2 size={11} /> Enabled
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setTwoFA((v) => !v)}
            className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
              twoFA ? 'bg-amber-600' : 'bg-slate-300'
            }`}
          >
            <motion.span
              animate={{ x: twoFA ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div>
        <h3 className="font-black text-slate-900 mb-1">Active Sessions</h3>
        <p className="text-sm text-slate-400 mb-4">Manage where you're signed in.</p>
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.current ? 'bg-green-500' : 'bg-slate-300'}`} />
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.device}</p>
                  <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
                </div>
              </div>
              {s.current ? (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Current</span>
              ) : (
                <button className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Notifications ───────────────────────────────────
function NotificationsTab() {
  const [email, setEmail] = useState({
    newOrder:      true,
    orderStatus:   true,
    newVendor:     true,
    newUser:       false,
    lowStock:      true,
    paymentFailed: true,
    weeklyReport:  true,
    monthlyReport: false,
  });
  const [push, setPush] = useState({
    newOrder:      true,
    urgentAlerts:  true,
    vendorApproval: true,
  });
  const [saveState, setSaveState] = useState<SaveState>({ saving: false, saved: false });

  const handleSave = async () => {
    setSaveState({ saving: true, saved: false });
    await new Promise((r) => setTimeout(r, 1000));
    setSaveState({ saving: false, saved: true });
    setTimeout(() => setSaveState({ saving: false, saved: false }), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Email notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-slate-500" />
          <h3 className="font-black text-slate-900">Email Notifications</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50">
          <Toggle label="New Order Placed"      sub="Get notified when a customer places a new order"               value={email.newOrder}      onChange={(v) => setEmail({ ...email, newOrder: v })} />
          <Toggle label="Order Status Changed"  sub="Updates when order status changes (shipped, delivered, etc.)"  value={email.orderStatus}   onChange={(v) => setEmail({ ...email, orderStatus: v })} />
          <Toggle label="New Vendor Application" sub="Alert when a new vendor applies for approval"                 value={email.newVendor}     onChange={(v) => setEmail({ ...email, newVendor: v })} />
          <Toggle label="New User Registration" sub="Alert when a new customer signs up"                            value={email.newUser}       onChange={(v) => setEmail({ ...email, newUser: v })} />
          <Toggle label="Low Stock Warning"     sub="Alert when product stock falls below 10 units"                 value={email.lowStock}      onChange={(v) => setEmail({ ...email, lowStock: v })} />
          <Toggle label="Payment Failed"        sub="Notify when a payment fails or is declined"                    value={email.paymentFailed} onChange={(v) => setEmail({ ...email, paymentFailed: v })} />
          <Toggle label="Weekly Sales Report"   sub="Summary of sales, orders, and revenue every Monday"            value={email.weeklyReport}  onChange={(v) => setEmail({ ...email, weeklyReport: v })} />
          <Toggle label="Monthly Analytics"     sub="Full analytics report on the 1st of each month"               value={email.monthlyReport} onChange={(v) => setEmail({ ...email, monthlyReport: v })} />
        </div>
      </div>

      {/* Push notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-slate-500" />
          <h3 className="font-black text-slate-900">In-App Push Notifications</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50">
          <Toggle label="New Orders"        sub="Real-time alert for each new order placed"              value={push.newOrder}       onChange={(v) => setPush({ ...push, newOrder: v })} />
          <Toggle label="Urgent Alerts"     sub="Critical system alerts and payment failures"            value={push.urgentAlerts}   onChange={(v) => setPush({ ...push, urgentAlerts: v })} />
          <Toggle label="Vendor Approvals"  sub="Remind me about pending vendor approval requests"       value={push.vendorApproval} onChange={(v) => setPush({ ...push, vendorApproval: v })} />
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton state={saveState} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────
const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'profile',       label: 'Profile',       icon: User   },
  { key: 'store',         label: 'Store',         icon: Store  },
  { key: 'security',      label: 'Security',      icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell   },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-black text-slate-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account and platform configuration
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar tabs ── */}
        <aside className="lg:w-52 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={[
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap w-full text-left',
                  activeTab === key
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm',
                ].join(' ')}
              >
                <Icon size={16} className={activeTab === key ? 'text-white' : 'text-slate-400'} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Tab content ── */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'profile'       && <ProfileTab />}
              {activeTab === 'store'         && <StoreTab />}
              {activeTab === 'security'      && <SecurityTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}