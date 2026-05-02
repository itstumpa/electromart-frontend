import { Metadata } from 'next';
import VendorInventoryClient from './Inventoryclient';
export const metadata: Metadata = { title: 'Inventory — Vendor Dashboard' };
export default function Page() { return <VendorInventoryClient />; }