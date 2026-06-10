import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PaymentResultClient from '@/components/payment/PaymentResultClient';

export const metadata: Metadata = {
  title: 'Payment Result — ElectroMart',
};

type PaymentStatus = 'success' | 'fail' | 'cancel';

interface Props {
  searchParams: Promise<{ status?: string; orderId?: string }>;
}

export default async function PaymentResultPage({ searchParams }: Props) {
  const { status, orderId } = await searchParams;

  if (!status || !['success', 'fail', 'cancel'].includes(status) || !orderId) {
    redirect('/');
  }

  return <PaymentResultClient status={status as PaymentStatus} orderId={orderId} />;
}
