'use client';
import { useState } from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { Worker } from '@/lib/types';
import { STATUS_CONFIG, TASK_STATUSES } from '@/lib/constants';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button } from '@/components/shared/Button';

interface TaskBoardProps {
  videoId: string;
  tasks: Task[];
  workers: Worker[];
}

export function TaskBoard({ videoId, tasks, workers }: TaskBoardProps) {
  const [showForm, setShowForm] = useState(false);

  const columns: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
  for (const task of tasks) {
    columns[task.status].push(task);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-700">タスクボード</h2>
        <Button size="sm" onClick={() => setShowForm(true)}>
          + タスク追加
        </Button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">新しいタスク</h3>
          <TaskForm
            videoId={videoId}
            workers={workers}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {TASK_STATUSES.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const col = columns[status];
          return (
            <div key={status} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bgColor} ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-400">{col.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {col.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {col.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-300">なし</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
