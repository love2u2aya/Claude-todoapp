'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVideos } from '@/hooks/useVideos';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/shared/Button';
import { VideoStatusBadge } from '@/components/videos/VideoStatusBadge';
import { TASK_TYPES, TASK_TYPE_LABELS, STATUS_CONFIG } from '@/lib/constants';
import { Task, TaskStatus } from '@/lib/types';
import { subscribeToAllTasks } from '@/lib/firestore/tasks';

const STATUS_CELL_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-500',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
};

export default function DashboardPage() {
  const { videos, loading: vLoading } = useVideos();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tLoading, setTLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllTasks((tasks) => {
      setAllTasks(tasks);
      setTLoading(false);
    });
    return unsub;
  }, []);

  if (vLoading || tLoading) return <LoadingSpinner />;

  const taskMap: Record<string, Record<string, Task>> = {};
  for (const task of allTasks) {
    if (!taskMap[task.videoId]) taskMap[task.videoId] = {};
    taskMap[task.videoId][task.type] = task;
  }

  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = allTasks.filter((t) => t.status === 'review').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">全動画の制作進捗を一覧で確認できます</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '動画数', value: videos.length, color: 'text-gray-900' },
          { label: '進行中タスク', value: inProgressTasks, color: 'text-blue-700' },
          { label: 'レビュー中', value: reviewTasks, color: 'text-yellow-700' },
          { label: '完了タスク', value: `${doneTasks}/${totalTasks}`, color: 'text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {videos.length === 0 ? (
        <EmptyState
          title="動画がありません"
          description="最初の動画プロジェクトを作成しましょう"
          action={
            <Link href="/videos/new">
              <Button>動画を作成</Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-700">動画</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-500">ステータス</th>
                {TASK_TYPES.map((type) => (
                  <th key={type} className="text-center px-3 py-3 font-semibold text-gray-500 min-w-[90px]">
                    {TASK_TYPE_LABELS[type]}
                  </th>
                ))}
                <th className="text-center px-3 py-3 font-semibold text-gray-500">進捗</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, i) => {
                const videoTasks = taskMap[video.id] ?? {};
                const taskList = allTasks.filter((t) => t.videoId === video.id);
                const done = taskList.filter((t) => t.status === 'done').length;
                const pct = taskList.length > 0 ? Math.round((done / taskList.length) * 100) : null;

                return (
                  <tr
                    key={video.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/videos/${video.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 hover:underline line-clamp-1"
                      >
                        {video.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <VideoStatusBadge status={video.status} />
                    </td>
                    {TASK_TYPES.map((type) => {
                      const task = videoTasks[type];
                      return (
                        <td key={type} className="px-3 py-3 text-center">
                          {task ? (
                            <span
                              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CELL_COLORS[task.status]}`}
                              title={`${task.assignedWorkerName ?? '未割り当て'}: ${STATUS_CONFIG[task.status].label}`}
                            >
                              {STATUS_CONFIG[task.status].label}
                            </span>
                          ) : (
                            <span className="text-gray-200">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3">
                      {pct !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
