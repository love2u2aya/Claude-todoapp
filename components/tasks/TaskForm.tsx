'use client';
import { useState } from 'react';
import { Worker, TaskType } from '@/lib/types';
import { TASK_TYPES, TASK_TYPE_LABELS } from '@/lib/constants';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { addTask } from '@/lib/firestore/tasks';

interface TaskFormProps {
  videoId: string;
  workers: Worker[];
  onClose: () => void;
}

export function TaskForm({ videoId, workers, onClose }: TaskFormProps) {
  const [type, setType] = useState<TaskType>('editing');
  const [label, setLabel] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedWorker = workers.find((w) => w.id === workerId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !workerId) return;
    setSaving(true);
    try {
      await addTask({
        videoId,
        type,
        label: label.trim(),
        assignedWorkerId: workerId,
        assignedWorkerName: selectedWorker?.name ?? '',
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="タスク種別 *"
        value={type}
        onChange={(e) => setType(e.target.value as TaskType)}
      >
        {TASK_TYPES.map((t) => (
          <option key={t} value={t}>
            {TASK_TYPE_LABELS[t]}
          </option>
        ))}
      </Select>
      <Input
        label="タスク名 *"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="例: EP42 編集"
        required
      />
      <Select
        label="担当ワーカー *"
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
        required
      >
        <option value="">―― 選択してください ――</option>
        {workers.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </Select>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">メモ</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="補足情報など"
          rows={2}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={saving || !label.trim() || !workerId}>
          {saving ? '追加中...' : 'タスクを追加'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
