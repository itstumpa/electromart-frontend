import { Metadata } from 'next';
import WishlistClient from './Wishlistclient';

export const metadata: Metadata = { title: 'My Wishlist — ElectroMart' };
export default function WishlistPage() { return <WishlistClient />; }