'use client';

import { notFound } from 'next/navigation';
import OrderTable from '@/components/OrderTable';
import { useOrders } from '@/hooks/useOrders';
import type { OrderStatus } from '@/lib/types';

const slugToStatus: Record<string, OrderStatus> = {
  'cizilmeyi-bekleyenler': 'Çizilmeyi Bekleyenler',
  cizildi: 'Çizildi',
  'uretime-alindi': 'Üretime Alındı',
  'uretimi-tamamlandi': 'Üretimi Tamamlandı',
  'kargo-asamasinda': 'Kargo Aşamasında',
  'gonderilen-urunler': 'Gönderilen Ürünler',
  gecikti: 'Gecikti'
};

interface Props {
  params: { slug: string };
}

const OrderStatusPage = ({ params }: Props) => {
  const status = slugToStatus[params.slug];

  if (!status) {
    notFound();
  }

  const { orders, loading } = useOrders({ status });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{status}</h1>
        <p className="text-sm text-gray-500">Bu sayfada {status.toLowerCase()} siparişleri görüntülersiniz.</p>
      </div>
      <OrderTable orders={orders} loading={loading} />
    </div>
  );
};

export default OrderStatusPage;
