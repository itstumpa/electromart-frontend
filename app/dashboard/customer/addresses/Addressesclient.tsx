'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Home, Briefcase, Star, X, CheckCircle2 } from 'lucide-react';
import { mockAddresses } from '@/data/mock-data';
import type { Address } from '@/data/types';

type AddressLabel = 'home' | 'office' | 'other';

const LABEL_CONFIG: Record<AddressLabel, { icon: React.ElementType; color: string; bg: string }> = {
  home:   { icon: Home,      color: 'text-amber-700',  bg: 'bg-amber-100' },
  office: { icon: Briefcase, color: 'text-blue-700',   bg: 'bg-blue-100' },
  other:  { icon: MapPin,    color: 'text-purple-700', bg: 'bg-purple-100' },
};

const BLANK: Omit<Address, 'id' | 'userId'> = {
  label: 'home', fullName: '', phone: '', street: '',
  city: '', state: '', zipCode: '', country: 'USA', isDefault: false,
};

function AddressModal({ initial, onSave, onClose }: {
  initial?: Address | null;
  onSave: (a: Omit<Address, 'id' | 'userId'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Address, 'id' | 'userId'>>(
    initial ? { label: initial.label, fullName: initial.fullName, phone: initial.phone, street: initial.street, city: initial.city, state: initial.state, zipCode: initial.zipCode, country: initial.country, isDefault: initial.isDefault }
    : BLANK
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.fullName || !form.street || !form.city) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    onSave(form);
    setSaving(false);
    onClose();
  };

  const Field = ({ label, k, placeholder, half }: { label: string; k: keyof typeof form; placeholder?: string; half?: boolean }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <input type="text" placeholder={placeholder} value={form[k] as string}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900">{initial ? 'Edit Address' : 'Add Address'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Label tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          {(['home', 'office', 'other'] as AddressLabel[]).map((l) => {
            const cfg  = LABEL_CONFIG[l];
            const Icon = cfg.icon;
            return (
              <button key={l} onClick={() => setForm({ ...form, label: l })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  form.label === l ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}>
                <Icon size={13} /> {l}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name *"  k="fullName" placeholder="John Smith" />
          <Field label="Phone"        k="phone"    placeholder="+1 555 000" />
          <Field label="Street Address *" k="street" placeholder="123 Main St, Apt 4B" />
          <Field label="City *"  k="city"    placeholder="New York"  half />
          <Field label="State"   k="state"   placeholder="NY"        half />
          <Field label="ZIP"     k="zipCode" placeholder="10001"     half />
          <Field label="Country" k="country" placeholder="USA"       half />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer mt-4 mb-5">
          <div onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
            className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${form.isDefault ? 'bg-amber-600 border-amber-600' : 'border-slate-300'}`}>
            {form.isDefault && <CheckCircle2 size={11} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-slate-700 font-medium">Set as default address</span>
        </label>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
            {saving ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />Saving...</> : (initial ? 'Save Changes' : 'Add Address')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AddressesClient() {
  const [addresses,   setAddresses]   = useState<Address[]>(mockAddresses.filter((a) => a.userId === 'user-cust-1'));
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Address | null>(null);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);

  const handleSave = (data: Omit<Address, 'id' | 'userId'>) => {
    if (editTarget) {
      setAddresses((prev) => prev.map((a) => a.id === editTarget.id ? { ...a, ...data } : a));
      setEditTarget(null);
    } else {
      const newAddr: Address = { ...data, id: `addr-${Date.now()}`, userId: 'user-cust-1' };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setModalOpen(false);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setTimeout(() => {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setDeleteId(null);
    }, 350);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Addresses</h1>
            <p className="text-sm text-slate-400 mt-0.5">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
          </div>
          <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200">
            <Plus size={15} /> Add Address
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.map((addr) => {
              const cfg  = LABEL_CONFIG[addr.label as AddressLabel] ?? LABEL_CONFIG.other;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={addr.id}
                  layout
                  animate={{ opacity: deleteId === addr.id ? 0 : 1, scale: deleteId === addr.id ? 0.95 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-2xl border-2 p-5 transition-all ${addr.isDefault ? 'border-amber-400 shadow-md shadow-amber-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                        <Icon size={16} className={cfg.color} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 capitalize">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            <Star size={8} className="fill-amber-600" /> Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditTarget(addr); setModalOpen(true); }}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(addr.id)}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 flex items-center justify-center transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="font-bold text-slate-900">{addr.fullName}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-slate-400">{addr.phone}</p>
                  </div>

                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)}
                      className="mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                      Set as default
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <AddressModal initial={editTarget} onSave={handleSave} onClose={() => { setModalOpen(false); setEditTarget(null); }} />}
      </AnimatePresence>
    </>
  );
}