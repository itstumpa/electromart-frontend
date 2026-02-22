// SERVER COMPONENT — thin wrapper, all logic in AdminSettingsPage client component
import AdminSettingsPage from '@/components/dashboard/admin/settings/Adminsettingspage';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings — Admin · ElectroMart' };

export default function SettingsPage() {
  return <AdminSettingsPage />;
}