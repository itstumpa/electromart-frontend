import { Metadata } from 'next';
import VendorStoreClient from './Storeclient';
export const metadata: Metadata = { title: 'Store — Vendor Dashboard' };
export default function Page() { return <VendorStoreClient />; }