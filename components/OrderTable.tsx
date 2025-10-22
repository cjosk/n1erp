'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import StatusBadge from './StatusBadge';
import type { Order } from '@/lib/types';

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  error?: string | null;
}

const OrderTable = ({ orders, loading, error }: OrderTableProps) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const list = orders.filter((order) => {
      return (
        order.productName.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    });

    return list.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [orders, search, sortDirection]);

  if (error) {
    return (
      <div className="glass-card rounded-2xl border border-white/40 p-6 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (loading) {
    return <div className="glass-card rounded-2xl p-6 text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="glass-card rounded-2xl border border-white/40">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Sipariş veya müşteri ara"
              className="w-full md:w-64 rounded-xl border border-white/40 bg-white/70 py-2 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
            />
            <button
              onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
              className="rounded-xl bg-[#ff7a00]/10 px-4 py-2 text-sm font-medium text-[#ff7a00] hover:bg-[#ff7a00]/20"
            >
              {sortDirection === 'desc' ? 'Yeni → Eski' : 'Eski → Yeni'}
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {filtered.length} sonuç görüntüleniyor
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/40">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 text-left font-semibold">Görsel</th>
                <th className="px-4 py-3 text-left font-semibold">Durum</th>
                <th className="px-4 py-3 text-left font-semibold">Aksesuarlar</th>
                <th className="px-4 py-3 text-left font-semibold">Müşteri İsmi</th>
                <th className="px-4 py-3 text-left font-semibold">Ürün İsmi</th>
                <th className="px-4 py-3 text-left font-semibold">Toplam Ücret</th>
                <th className="px-4 py-3 text-left font-semibold">Eklenme Zamanı</th>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40 text-sm">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/50">
                  <td className="px-4 py-3">
                    {order.imageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/40">
                        <Image src={order.imageUrl} alt={order.productName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                        Yok
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.accessories?.length ? order.accessories.join(', ') : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-700">{order.productName}</td>
                  <td className="px-4 py-3 text-gray-800 font-semibold">
                    ₺{(order.price * (order.quantity ?? 1)).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: tr }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    <Link href={`/orders/${order.id}`} className="text-[#ff7a00] hover:underline">
                      {order.id}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
