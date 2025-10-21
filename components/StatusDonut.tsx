'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { Order } from '@/lib/types';
import { STATUS_FLOW } from '@/lib/status';

const COLORS = ['#ff7a00', '#ffa94d', '#69c0ff', '#5c7cfa', '#51cf66', '#845ef7', '#ff6b6b'];

interface Props {
  orders: Order[];
}

const StatusDonut = ({ orders }: Props) => {
  const data = STATUS_FLOW.map((status, index) => ({
    name: status,
    value: orders.filter((order) => order.status === status).length,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="glass-card rounded-2xl border border-white/40 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktif Sipariş Durum Dağılımı</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value} sipariş`, 'Adet']} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusDonut;
