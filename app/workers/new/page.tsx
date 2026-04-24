import { WorkerForm } from '@/components/workers/WorkerForm';

export default function NewWorkerPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ワーカーを追加</h1>
        <p className="text-sm text-gray-500 mt-1">新しい担当者を登録します</p>
      </div>
      <WorkerForm />
    </div>
  );
}
