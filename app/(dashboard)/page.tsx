'use client';

import { useMemo } from 'react';
import { FiPackage, FiCheckCircle, FiTruck, FiShoppingBag, FiAlertTriangle } from 'react-icons/fi';
import SummaryCard from '@/components/SummaryCard';
import StatusDonut from '@/components/StatusDonut';
import ActivityLog from '@/components/ActivityLog';
import { useOrders } from '@/hooks/useOrders';

const DashboardPage = () => {
  const { orders, loading, error } = useOrders();

  const stats = useMemo(() => {
    const active = orders.filter((order) => order.status !== 'Gönderilen Ürünler').length;
    const completed = orders.filter((order) => order.status === 'Üretimi Tamamlandı').length;
    const shipped = orders.filter((order) => order.status === 'Gönderilen Ürünler').length;
    const delayed = orders.filter((order) => order.status === 'Gecikti').length;

    return {
      active,
      completed,
      shipped,
      total: orders.length,
      delayed
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="glass-card rounded-2xl border border-white/40 p-4 text-sm text-red-500">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Aktif Sipariş" value={loading ? '—' : stats.active} icon={<FiPackage size={22} />} />
        <SummaryCard
          title="Üretimi Biten"
          value={loading ? '—' : stats.completed}
          icon={<FiCheckCircle size={22} />}
          accent="#51cf66"
        />
        <SummaryCard
          title="Kargolanan Sipariş"
          value={loading ? '—' : stats.shipped}
          icon={<FiTruck size={22} />}
          accent="#845ef7"
        />
        <SummaryCard
          title="Toplam Sipariş"
          value={loading ? '—' : stats.total}
          icon={<FiShoppingBag size={22} />}
          accent="#ffa94d"
        />
        <SummaryCard
          title="Geciken Ürün Sayısı"
          value={loading ? '—' : stats.delayed}
          icon={<FiAlertTriangle size={22} />}
          accent="#ff6b6b"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <StatusDonut orders={orders} />
        </div>
        <div className="lg:col-span-2">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
