import MainFooter from '@/app/(main)/MainFooter';
import MainNavbar from '@/app/(main)/MainNavbar';
import WishlistClient from '@/app/dashboard/customer/wishlist/Wishlistclient';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Wishlist — ElectroMart' };

export default function WishlistPage() {
  return (
    <>
      <MainNavbar />
      <WishlistClient />
      <MainFooter />
    </>
  );
}