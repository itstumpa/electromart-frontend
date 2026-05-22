import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PaymentSuccessClient from './PaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Payment Successful — ElectroMart',
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  if (!orderId) redirect('/');

  return <PaymentSuccessClient orderId={orderId} />;
}
