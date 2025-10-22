'use client';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Order } from '@/lib/types';

interface RevenueChartsProps {
  orders: Order[];
}

const RevenueCharts = ({ orders }: RevenueChartsProps) => {
  const monthlyMap = orders.reduce<Record<string, { key: string; monthLabel: string; revenue: number; shipped: number }>>(
    (acc, order) => {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) {
        return acc;
      }
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          monthLabel: format(date, 'MMM yyyy', { locale: tr }),
          revenue: 0,
          shipped: 0
        };
      }
      const total = order.price * (order.quantity ?? 1);
      acc[key].revenue += total;
      if (order.status === 'Gönderilen Ürünler') {
        acc[key].shipped += total;
      }
      return acc;
    },
    {}
  );

  const data = Object.values(monthlyMap).sort((a, b) => (a.key > b.key ? 1 : -1));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card rounded-2xl border border-white/40 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Aylık Gelir Dağılımı</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₺${(value / 1000).toFixed(1)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#ff7a00" name="Toplam Gelir" radius={[8, 8, 0, 0]} />
              <Bar dataKey="shipped" fill="#845ef7" name="Kargolanmış Gelir" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-card rounded-2xl border border-white/40 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Gelir Trendleri</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₺${(value / 1000).toFixed(1)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ff7a00" strokeWidth={3} dot={{ r: 4 }} name="Toplam Gelir" />
              <Line type="monotone" dataKey="shipped" stroke="#845ef7" strokeWidth={3} dot={{ r: 4 }} name="Kargolanmış Gelir" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueCharts;
