import { Metadata } from 'next';
import CustomerProfileClient from './Profileclient';
export const metadata: Metadata = { title: 'My Profile — Dashboard' };
export default function Page() { return <CustomerProfileClient />; }