// SERVER COMPONENT — counts are computed client-side inside VendorsClient
import { Metadata } from 'next';
import { Store } from 'lucide-react';
import { mockVendorProfiles } from '@/data/mock-data';
import VendorsClient from '@/components/dashboard/admin/vendors/Vendorsclient';

export const metadata: Metadata = { title: 'Vendor Management — Admin' };

export default async function AdminVendorsPage() {
  // mockVendorProfiles is kept as offline-fallback initial state; real data is fetched by VendorsClient
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Store size={20} className="text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Vendor Management
          </h1>
          <p className="text-sm text-slate-500">Review, approve and manage vendor stores</p>
        </div>
      </div>
      <VendorsClient initialVendors={mockVendorProfiles} />
    </div>
  );
}