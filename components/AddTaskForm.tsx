'use client';

import { useState } from 'react';
import type { Category } from '@/types/todo';
import { CATEGORIES, CATEGORY_LABELS } from '@/types/todo';

interface Props {
  onAdd: (title: string, category: Category) => void;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('personal');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORY_LABELS[c]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-5 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-150 disabled:opacity-40"
        disabled={!title.trim()}
      >
        Add
      </button>
    </form>
  );
}
