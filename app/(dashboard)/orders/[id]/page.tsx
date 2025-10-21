'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import OrderForm from '@/components/OrderForm';

interface Props {
  params: { id: string };
}

const OrderDetailPage = ({ params }: Props) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchOrder = useCallback(async () => {
    const docRef = doc(db, 'orders', params.id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      setOrder({
        id: snapshot.id,
        productName: data.productName ?? '',
        customerName: data.customerName ?? '',
        category: data.category ?? '',
        price: Number(data.price ?? 0),
        quantity: Number(data.quantity ?? 1),
        status: data.status,
        deliveryDate: data.deliveryDate ?? undefined,
        franchiseId: data.franchiseId ?? undefined,
        accessories: data.accessories ?? [],
        notes: data.notes ?? '',
        imageUrl: data.imageUrl ?? undefined,
        createdAt: data.createdAt ?? new Date().toISOString(),
        updatedAt: data.updatedAt ?? undefined
      });
    } else {
      setOrder(null);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return <div className="glass-card rounded-2xl border border-white/40 p-6 text-gray-500">Yükleniyor...</div>;
  }

  if (!order) {
    return <div className="glass-card rounded-2xl border border-white/40 p-6 text-gray-500">Sipariş bulunamadı.</div>;
  }

  const total = order.price * (order.quantity ?? 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sipariş #{order.id}</h1>
          <p className="text-sm text-gray-500">{order.productName}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <button
            onClick={() => setEditing((prev) => !prev)}
            className="rounded-xl bg-[#ff7a00]/10 px-4 py-2 text-sm font-semibold text-[#ff7a00] hover:bg-[#ff7a00]/20"
          >
            {editing ? 'Formu Gizle' : 'Düzenle'}
          </button>
          <Link href="/orders" className="text-sm text-gray-500 hover:text-[#ff7a00]">
            ← Geri Dön
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl border border-white/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Ürün Bilgileri</h2>
          {order.imageUrl ? (
            <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/40">
              <Image src={order.imageUrl} alt={order.productName} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400">
              Görsel bulunamadı
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-xs uppercase text-gray-500">Ürün</p>
              <p className="font-medium">{order.productName}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Kategori</p>
              <p className="font-medium">{order.category}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Müşteri</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Teslim Tarihi</p>
              <p className="font-medium">{order.deliveryDate ?? 'Belirtilmedi'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Franchise ID</p>
              <p className="font-medium">{order.franchiseId ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Aksesuarlar</p>
              <p className="font-medium">{order.accessories?.length ? order.accessories.join(', ') : '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Sipariş Notu</p>
            <p className="mt-1 text-sm text-gray-700">{order.notes || 'Not bulunmuyor.'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-white/40 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">Finansal Özet</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Birim Fiyat</span>
              <span>₺{order.price.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Adet</span>
              <span>{order.quantity ?? 1}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Toplam</span>
              <span>₺{total.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          {editing && <OrderForm order={order} onSuccess={() => { setEditing(false); fetchOrder(); }} />}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
