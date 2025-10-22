import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  accent?: string;
}

const SummaryCard = ({ title, value, change, icon, accent = '#ff7a00' }: SummaryCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-white/40">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">{title}</span>
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
        </div>
        <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
          {icon}
        </div>
      </div>
      {change && <span className="text-xs text-gray-500">{change}</span>}
    </div>
  );
};

export default SummaryCard;
