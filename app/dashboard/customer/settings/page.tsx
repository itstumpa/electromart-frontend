import { Metadata } from 'next';
import CustomerSettingsClient from './Settingsclient';
export const metadata: Metadata = { title: 'Settings — My Dashboard' };
export default function Page() { return <CustomerSettingsClient />; }