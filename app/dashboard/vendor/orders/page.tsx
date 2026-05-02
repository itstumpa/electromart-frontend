import { Metadata } from 'next';
import VendorOrdersClient from './Ordersclient';
export const metadata: Metadata = { title: 'Orders — Vendor Dashboard' };
export default function Page() { return <VendorOrdersClient />; }