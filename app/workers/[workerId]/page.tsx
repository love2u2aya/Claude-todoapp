'use client';
import { use } from 'react';
import Link from 'next/link';
import { useWorkers } from '@/hooks/useWorkers';
import { useWorkerTasks } from '@/hooks/useWorkerTasks';
import { Avatar } from '@/components/shared/Avatar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { STATUS_CONFIG, TASK_TYPE_LABELS } from '@/lib/constants';
import { updateTaskStatus } from '@/lib/firestore/tasks';
import { TaskStatus } from '@/lib/types';

export default function WorkerDetailPage({ params }: { params: Promise<{ workerId: string }> }) {
  const { workerId } = use(params);
  const { workers, loading: wLoading } = useWorkers();
  const { tasks, loading: tLoading } = useWorkerTasks(workerId);

  const worker = workers.find((w) => w.id === workerId);

  if (wLoading) return <LoadingSpinner />;
  if (!worker) return <div className="p-8 text-gray-500">ワーカーが見つかりません</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar name={worker.name} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>
          {worker.email && <p className="text-sm text-gray-500">{worker.email}</p>}
        </div>
      </div>

      <h2 className="text-base font-semibold text-gray-700 mb-4">
        担当タスク ({tasks.length}件)
      </h2>

      {tLoading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState title="タスクがありません" description="まだ担当タスクが割り当てられていません" />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const statusCfg = STATUS_CONFIG[task.status];
            return (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {TASK_TYPE_LABELS[task.type]}
                  </span>
                  <p className="font-medium text-gray-900 truncate">{task.label}</p>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer ${statusCfg.bgColor} ${statusCfg.color} ${statusCfg.borderColor}`}
                >
                  {(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
                <Link
                  href={`/videos/${task.videoId}`}
                  className="text-xs text-blue-600 hover:underline flex-shrink-0"
                >
                  動画を見る
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
