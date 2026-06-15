"use client";

import CustomerInfoSection from "./CustomerInfoSection";

// ─── Types ───────────────────────────────────────────────────
interface GuestInfo {
  guestEmail: string;
  guestName: string;
  guestPhone: string;
}

// ─── GuestCheckoutSection ────────────────────────────────────
export default function GuestCheckoutSection({
  isGuest,
  guestInfo,
  setGuestInfo,
}: {
  isGuest: boolean;
  guestInfo: GuestInfo;
  setGuestInfo: React.Dispatch<React.SetStateAction<GuestInfo>>;
}) {
  if (!isGuest) return null;

  return (
    <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
      <CustomerInfoSection
        guestInfo={guestInfo}
        setGuestInfo={setGuestInfo}
      />
    </div>
  );
}
