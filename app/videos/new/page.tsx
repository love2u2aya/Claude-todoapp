import { VideoForm } from '@/components/videos/VideoForm';

export default function NewVideoPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新規動画を作成</h1>
        <p className="text-sm text-gray-500 mt-1">新しい動画プロジェクトを登録します</p>
      </div>
      <VideoForm />
    </div>
  );
}
