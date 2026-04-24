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

const STATUS_DOT: Record<TaskStatus, string> = {
  todo:          'bg-gray-300',
  needs_request: 'bg-orange-400',
  waiting:       'bg-purple-400',
  in_progress:   'bg-blue-400',
  review:        'bg-yellow-400',
  done:          'bg-green-500',
};

export default function DashboardPage() {
  const { videos, loading: vLoading } = useVideos();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tLoading, setTLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllTasks(
      (tasks) => { setAllTasks(tasks); setTLoading(false); },
      () => setTLoading(false)
    );
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

      {/* サマリーカード */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '動画数', value: videos.length, color: 'text-gray-900' },
          { label: '進行中タスク', value: inProgressTasks, color: 'text-blue-700' },
          { label: 'レビュー中', value: reviewTasks, color: 'text-yellow-600' },
          { label: '完了タスク', value: `${doneTasks}/${totalTasks}`, color: 'text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="font-medium text-gray-600">凡例:</span>
        {(['todo', 'needs_request', 'waiting', 'in_progress', 'review', 'done'] as TaskStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[s]}`} />
            {STATUS_CONFIG[s].label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-200" />
          未設定
        </span>
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
          {/* 横スクロール対応: 動画・ステータス列を sticky で固定 */}
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse" style={{ minWidth: 'max-content' }}>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {/* sticky 動画列 */}
                  <th className="sticky left-0 z-10 bg-gray-50 text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap border-r border-gray-100 min-w-[180px]">
                    動画
                  </th>
                  {/* sticky ステータス列 */}
                  <th className="sticky left-[180px] z-10 bg-gray-50 text-center px-3 py-3 font-semibold text-gray-500 whitespace-nowrap border-r border-gray-100 min-w-[72px]">
                    状態
                  </th>
                  {/* タスク種別列 (各36px幅・ヘッダーは縦書き) */}
                  {TASK_TYPES.map((type) => (
                    <th key={type} className="text-center px-1 py-3 font-medium text-gray-400 w-9">
                      <div className="flex justify-center">
                        <span
                          className="text-[10px] leading-tight"
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            height: '72px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title={TASK_TYPE_LABELS[type]}
                        >
                          {TASK_TYPE_LABELS[type]}
                        </span>
                      </div>
                    </th>
                  ))}
                  {/* 進捗列 */}
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 whitespace-nowrap min-w-[100px]">
                    進捗
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, i) => {
                  const videoTasks = taskMap[video.id] ?? {};
                  const taskList = allTasks.filter((t) => t.videoId === video.id);
                  const done = taskList.filter((t) => t.status === 'done').length;
                  const pct = taskList.length > 0 ? Math.round((done / taskList.length) * 100) : null;
                  const rowBg = i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40';

                  return (
                    <tr key={video.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${rowBg}`}>
                      {/* sticky 動画名 */}
                      <td className={`sticky left-0 z-10 px-4 py-3 border-r border-gray-100 ${rowBg}`}>
                        <Link
                          href={`/videos/${video.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 hover:underline whitespace-nowrap block max-w-[160px] truncate"
                          title={video.title}
                        >
                          {video.title}
                        </Link>
                      </td>
                      {/* sticky 状態 */}
                      <td className={`sticky left-[180px] z-10 px-3 py-3 text-center border-r border-gray-100 ${rowBg}`}>
                        <VideoStatusBadge status={video.status} />
                      </td>
                      {/* タスク種別ドット */}
                      {TASK_TYPES.map((type) => {
                        const task = videoTasks[type];
                        return (
                          <td key={type} className="px-1 py-3 text-center w-9">
                            {task ? (
                              <span
                                className={`inline-block w-3 h-3 rounded-full ${STATUS_DOT[task.status]}`}
                                title={`${TASK_TYPE_LABELS[type]}: ${STATUS_CONFIG[task.status].label}${task.assignedWorkerName ? ` (${task.assignedWorkerName})` : ''}`}
                              />
                            ) : (
                              <span className="inline-block w-3 h-3 rounded-full bg-gray-100 border border-gray-200" title={`${TASK_TYPE_LABELS[type]}: 未設定`} />
                            )}
                          </td>
                        );
                      })}
                      {/* 進捗バー */}
                      <td className="px-4 py-3">
                        {pct !== null ? (
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-7 text-right shrink-0">{pct}%</span>
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
        </div>
      )}
    </div>
  );
}
