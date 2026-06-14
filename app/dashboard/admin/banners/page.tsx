// SERVER COMPONENT — data is fetched inside BannersClient
import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { BannersClient } from "./BannersClient";

export const metadata: Metadata = {
  title: "Banner Management — Admin",
};

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <ImageIcon size={20} className="text-amber-700" />
        </div>
        <div>
          <h1
            className="text-2xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Banner Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit and manage promotional banners
          </p>
        </div>
      </div>
      <BannersClient />
    </div>
  );
}
