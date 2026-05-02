import { Metadata } from 'next';
import VendorEarningsClient from './Earningsclient';
export const metadata: Metadata = { title: 'Earnings — Vendor Dashboard' };
export default function Page() { return <VendorEarningsClient />; }