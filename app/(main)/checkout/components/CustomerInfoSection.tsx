"use client";

// ─── Field component ─────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  half,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  half?: boolean;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────
interface GuestInfo {
  guestEmail: string;
  guestName: string;
  guestPhone: string;
}

// ─── CustomerInfoSection ─────────────────────────────────────
export default function CustomerInfoSection({
  guestInfo,
  setGuestInfo,
}: {
  guestInfo: GuestInfo;
  setGuestInfo: React.Dispatch<React.SetStateAction<GuestInfo>>;
}) {
  return (
    <>
      <div>
        <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">
          Contact Information
        </h3>
        <p className="text-xs text-amber-700 mt-0.5">
          You&apos;ll use this to track your order later.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={guestInfo.guestEmail}
            onChange={(e) =>
              setGuestInfo({ ...guestInfo, guestEmail: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>
        <Field
          label="Full Name *"
          value={guestInfo.guestName}
          onChange={(v) => setGuestInfo({ ...guestInfo, guestName: v })}
          placeholder="John Smith"
        />
        <Field
          label="Phone *"
          value={guestInfo.guestPhone}
          onChange={(v) => setGuestInfo({ ...guestInfo, guestPhone: v })}
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </>
  );
}
