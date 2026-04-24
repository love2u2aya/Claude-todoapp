'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { addWorker } from '@/lib/firestore/workers';

export function WorkerForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addWorker({ name: name.trim(), email: email.trim() || undefined });
      router.push('/workers');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <Input
        label="名前 *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 田中 太郎"
        required
      />
      <Input
        label="メールアドレス"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="例: tanaka@example.com"
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? '保存中...' : '追加する'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
