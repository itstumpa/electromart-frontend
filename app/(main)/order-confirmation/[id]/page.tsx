import { Metadata } from 'next';
import OrderConfirmationClient from './OrderConfirmationClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id} Confirmed — ElectroMart` };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  return <OrderConfirmationClient orderId={id} />;
}
