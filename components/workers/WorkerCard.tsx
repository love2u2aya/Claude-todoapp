import Link from 'next/link';
import { Worker } from '@/lib/types';
import { Avatar } from '@/components/shared/Avatar';

interface WorkerCardProps {
  worker: Worker;
  taskCount?: number;
}

export function WorkerCard({ worker, taskCount }: WorkerCardProps) {
  return (
    <Link
      href={`/workers/${worker.id}`}
      className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <Avatar name={worker.name} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{worker.name}</p>
        {worker.email && (
          <p className="text-sm text-gray-500 truncate">{worker.email}</p>
        )}
      </div>
      {taskCount !== undefined && (
        <span className="text-sm font-medium text-gray-500 flex-shrink-0">
          {taskCount}件
        </span>
      )}
    </Link>
  );
}
