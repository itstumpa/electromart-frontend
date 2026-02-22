// SERVER COMPONENT
import { Metadata } from 'next';
import { Store } from 'lucide-react';
import { mockVendorProfiles } from '@/data/mock-data';
import VendorsClient from '@/components/dashboard/admin/vendors/VendorsClient';

export const metadata: Metadata = { title: 'Vendor Management — Admin' };

export default async function AdminVendorsPage() {
  const vendors = mockVendorProfiles;
  const pending = vendors.filter((v) => !v.isApproved).length;
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
          <p className="text-sm text-slate-500">
            {vendors.length} vendors · {pending} pending approval
          </p>
        </div>
      </div>
      <VendorsClient initialVendors={vendors} />
    </div>
  );
}