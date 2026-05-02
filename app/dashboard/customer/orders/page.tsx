import { Metadata } from 'next';
import CustomerOrdersClient from './Ordersclient';
export const metadata: Metadata = { title: 'My Orders — ElectroMart' };
export default function OrdersPage() { return <CustomerOrdersClient />; }