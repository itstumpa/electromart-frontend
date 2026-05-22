import { Metadata } from 'next';
import CustomerOverviewClient from './CustomerOverviewClient';

export const metadata: Metadata = { title: 'My Dashboard — ElectroMart' };

export default function CustomerOverviewPage() {
  return <CustomerOverviewClient />;
}
