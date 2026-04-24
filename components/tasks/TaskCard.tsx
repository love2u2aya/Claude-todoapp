'use client';
import { Task, TaskStatus } from '@/lib/types';
import { STATUS_CONFIG, TASK_TYPE_LABELS } from '@/lib/constants';
import { Avatar } from '@/components/shared/Avatar';
import { TaskTypeIcon } from './TaskTypeIcon';
import { updateTaskStatus, deleteTask } from '@/lib/firestore/tasks';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <TaskTypeIcon type={task.type} />
          {TASK_TYPE_LABELS[task.type]}
        </div>
        <button
          onClick={() => {
            if (confirm('このタスクを削除しますか？')) deleteTask(task.id);
          }}
          className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
          title="削除"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-sm font-semibold text-gray-900 mb-3 leading-snug">{task.label}</p>

      {task.notes && (
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{task.notes}</p>
      )}

      <div className="flex items-center justify-between">
        {task.assignedWorkerName ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignedWorkerName} size="sm" />
            <span className="text-xs text-gray-600 truncate max-w-[90px]">{task.assignedWorkerName}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">未割り当て</span>
        )}

        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
          className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer ${STATUS_CONFIG[task.status].bgColor} ${STATUS_CONFIG[task.status].color} ${STATUS_CONFIG[task.status].borderColor}`}
        >
          {(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
