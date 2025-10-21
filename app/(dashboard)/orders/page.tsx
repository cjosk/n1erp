'use client';

import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import OrderTable from '@/components/OrderTable';
import { useOrders } from '@/hooks/useOrders';

const OrdersPage = () => {
  const { orders, loading } = useOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tüm Siparişler</h1>
          <p className="text-sm text-gray-500">Neonbir üretim hattındaki tüm siparişleri görüntüleyin ve yönetin.</p>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff7a00] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#ff6a00]"
        >
          <FiPlus /> Yeni Sipariş
        </Link>
      </div>
      <OrderTable orders={orders} loading={loading} />
    </div>
  );
};

export default OrdersPage;
