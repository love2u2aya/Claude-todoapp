'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { addVideo } from '@/lib/firestore/videos';

export function VideoForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const ref = await addVideo({
        title: title.trim(),
        description: description.trim() || undefined,
        youtubeUrl: youtubeUrl.trim() || undefined,
      });
      router.push(`/videos/${ref.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <Input
        label="タイトル *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="例: 【解説】TypeScriptの基礎"
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="動画の概要や備考"
          rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <Input
        label="YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        type="url"
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={saving || !title.trim()}>
          {saving ? '保存中...' : '作成する'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
