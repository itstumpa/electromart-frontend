import { Metadata } from 'next';
import VendorSettingsClient from './Settingsclient';
export const metadata: Metadata = { title: 'Settings — Vendor Dashboard' };
export default function Page() { return <VendorSettingsClient />; }