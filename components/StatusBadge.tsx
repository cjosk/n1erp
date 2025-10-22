import { STATUS_COLORS } from '@/lib/status';
import type { OrderStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
