import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { VendorNotificationsClient } from "./Notificationsclient";

export const metadata: Metadata = {
  title: "Notifications — Vendor Dashboard",
};

export default function VendorNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Bell size={20} className="text-amber-700" />
        </div>
        <div>
          <h1
            className="text-2xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Notifications
          </h1>
          <p className="text-sm text-slate-500">
            View notifications for orders, returns, questions, and more
          </p>
        </div>
      </div>
      <VendorNotificationsClient />
    </div>
  );
}
