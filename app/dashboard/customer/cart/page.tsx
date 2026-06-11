import { Metadata } from 'next';
import CartClient from './Cartclient';

export const metadata: Metadata = { title: 'My Cart — ElectroMart' };
export default function CartPage() { return <CartClient />; }
