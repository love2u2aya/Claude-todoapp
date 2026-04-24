import { TaskStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}
