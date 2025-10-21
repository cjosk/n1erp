'use client';

import { useMemo, useState } from 'react';
import { isAfter, isBefore } from 'date-fns';
import { FiFilter } from 'react-icons/fi';
import DateRangeFilter from '@/components/DateRangeFilter';
import RevenueCharts from '@/components/RevenueCharts';
import SummaryCard from '@/components/SummaryCard';
import { useOrders } from '@/hooks/useOrders';

const ReportsPage = () => {
  const { orders } = useOrders();
  const [range, setRange] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10)
    };
  });

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (!order.createdAt) return false;
      const created = new Date(order.createdAt);
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      return (isAfter(created, start) || created.getTime() === start.getTime()) &&
        (isBefore(created, end) || created.getTime() === end.getTime());
    });
  }, [orders, range]);

  const totals = useMemo(() => {
    const totalRevenue = filtered.reduce((sum, order) => sum + order.price * (order.quantity ?? 1), 0);
    const activeRevenue = filtered
      .filter((order) => order.status !== 'Gönderilen Ürünler')
      .reduce((sum, order) => sum + order.price * (order.quantity ?? 1), 0);
    const shippedRevenue = filtered
      .filter((order) => order.status === 'Gönderilen Ürünler')
      .reduce((sum, order) => sum + order.price * (order.quantity ?? 1), 0);

    return {
      totalRevenue,
      activeRevenue,
      shippedRevenue
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Finansal Raporlar</h1>
          <p className="text-sm text-gray-500">Gelir trendlerini, aktif ve kargolanmış siparişleri analiz edin.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiFilter /> Tarih aralığına göre filtreleyin
        </div>
      </div>

      <DateRangeFilter startDate={range.startDate} endDate={range.endDate} onChange={setRange} />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Toplam Gelir"
          value={`₺${totals.totalRevenue.toLocaleString('tr-TR')}`}
          icon={<span className="text-xl font-bold">₺</span>}
        />
        <SummaryCard
          title="Aktif Gelir"
          value={`₺${totals.activeRevenue.toLocaleString('tr-TR')}`}
          icon={<span className="text-xl font-bold">A</span>}
          accent="#69c0ff"
        />
        <SummaryCard
          title="Kargolanan Gelir"
          value={`₺${totals.shippedRevenue.toLocaleString('tr-TR')}`}
          icon={<span className="text-xl font-bold">K</span>}
          accent="#845ef7"
        />
      </div>

      <RevenueCharts orders={filtered} />
    </div>
  );
};

export default ReportsPage;
