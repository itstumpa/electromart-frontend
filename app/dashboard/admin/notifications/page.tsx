import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { AdminNotificationsClient } from "./Notificationsclient";

export const metadata: Metadata = {
  title: "Notifications — Admin",
};

export default function AdminNotificationsPage() {
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
            View and manage system notifications
          </p>
        </div>
      </div>
      <AdminNotificationsClient />
    </div>
  );
}
