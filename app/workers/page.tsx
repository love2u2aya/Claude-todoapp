'use client';
import Link from 'next/link';
import { useWorkers } from '@/hooks/useWorkers';
import { WorkerCard } from '@/components/workers/WorkerCard';
import { Button } from '@/components/shared/Button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

export default function WorkersPage() {
  const { workers, loading } = useWorkers();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ワーカー</h1>
          <p className="text-sm text-gray-500 mt-1">動画制作を担当するメンバー一覧</p>
        </div>
        <Link href="/workers/new">
          <Button>+ 追加</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : workers.length === 0 ? (
        <EmptyState
          title="ワーカーがいません"
          description="担当者を追加してタスクを割り当てましょう"
          action={
            <Link href="/workers/new">
              <Button>最初のワーカーを追加</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      )}
    </div>
  );
}
