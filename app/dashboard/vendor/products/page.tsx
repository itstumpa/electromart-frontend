import { Metadata } from 'next';
import VendorProductsClient from './Productsclient';
export const metadata: Metadata = { title: 'Products — Vendor Dashboard' };
export default function Page() { return <VendorProductsClient />; }