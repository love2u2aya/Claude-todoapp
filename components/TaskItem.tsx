'use client';

import type { Todo } from '@/types/todo';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
      />
      <span
        className={`flex-1 text-sm transition-colors duration-150 ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {todo.title}
      </span>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[todo.category]}`}
      >
        {CATEGORY_LABELS[todo.category]}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
        className="text-gray-300 hover:text-red-400 transition-colors duration-150 flex-shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
