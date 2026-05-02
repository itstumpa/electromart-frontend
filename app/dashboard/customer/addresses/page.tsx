import { Metadata } from 'next';
import AddressesClient from './Addressesclient';
export const metadata: Metadata = { title: 'My Addresses — ElectroMart' };
export default function AddressesPage() { return <AddressesClient />; }