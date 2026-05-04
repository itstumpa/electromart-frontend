import { Metadata } from 'next';
import VendorProfileClient from './Profileclient';
export const metadata: Metadata = { title: 'My Profile — Vendor Dashboard' };
export default function Page() { return <VendorProfileClient />; }