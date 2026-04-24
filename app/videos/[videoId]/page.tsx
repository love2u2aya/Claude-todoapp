'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { useVideos } from '@/hooks/useVideos';
import { useVideoTasks } from '@/hooks/useVideoTasks';
import { useWorkers } from '@/hooks/useWorkers';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { VideoStatusBadge } from '@/components/videos/VideoStatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/shared/Button';
import { updateVideo, deleteVideo } from '@/lib/firestore/videos';
import { VIDEO_STATUS_CONFIG } from '@/lib/constants';
import { VideoStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function VideoDetailPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = use(params);
  const router = useRouter();
  const { videos, loading: vLoading } = useVideos();
  const { tasks, loading: tLoading } = useVideoTasks(videoId);
  const { workers } = useWorkers();
  const [deleting, setDeleting] = useState(false);

  const video = videos.find((v) => v.id === videoId);

  if (vLoading) return <LoadingSpinner />;
  if (!video) return <div className="p-8 text-gray-500">動画が見つかりません</div>;

  const done = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  async function handleDelete() {
    if (!confirm('この動画とタスクデータを削除しますか？')) return;
    setDeleting(true);
    await deleteVideo(videoId);
    router.push('/videos');
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/videos" className="text-sm text-gray-400 hover:text-gray-600">
              動画一覧
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-600 truncate">{video.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{video.title}</h1>
          {video.description && (
            <p className="text-sm text-gray-500 mt-1">{video.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <VideoStatusBadge status={video.status} />
            {video.youtubeUrl && (
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                YouTubeで開く
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={video.status}
            onChange={(e) => updateVideo(videoId, { status: e.target.value as VideoStatus })}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {(Object.keys(VIDEO_STATUS_CONFIG) as VideoStatus[]).map((s) => (
              <option key={s} value={s}>
                {VIDEO_STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
            削除
          </Button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">進捗</span>
            <span className="text-gray-500">{done}/{tasks.length} 完了 ({progress}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {tLoading ? <LoadingSpinner /> : <TaskBoard videoId={videoId} tasks={tasks} workers={workers} />}
    </div>
  );
}
