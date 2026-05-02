// SERVER COMPONENT
import { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';
import { mockOrders } from '@/data/mock-data';
import OrdersClient from '@/components/dashboard/admin/orders/OrdersClient';

export const metadata: Metadata = { title: 'Order Management — Admin' };

export default async function AdminOrdersPage() {
  const orders = mockOrders;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <ShoppingBag size={20} className="text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Order Management
          </h1>
          <p className="text-sm text-slate-500">
            {orders.length} orders · ${Math.round(revenue).toLocaleString()} total revenue
          </p>
        </div>
      </div>
      <OrdersClient initialOrders={orders} />
    </div>
  );
}