'use client';
import Link from 'next/link';
import { useVideos } from '@/hooks/useVideos';
import { VideoStatusBadge } from '@/components/videos/VideoStatusBadge';
import { Button } from '@/components/shared/Button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

export default function VideosPage() {
  const { videos, loading } = useVideos();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">動画一覧</h1>
          <p className="text-sm text-gray-500 mt-1">制作中・予定の動画プロジェクト</p>
        </div>
        <Link href="/videos/new">
          <Button>+ 新規動画</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : videos.length === 0 ? (
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
        <div className="space-y-3">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-sm transition-all block"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{video.title}</p>
                {video.description && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">{video.description}</p>
                )}
              </div>
              <VideoStatusBadge status={video.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
