'use client';

import type { FilterState, Category } from '@/types/todo';
import { CATEGORIES, CATEGORY_LABELS } from '@/types/todo';

interface Props {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export default function CategoryFilter({ filter, onFilterChange }: Props) {
  const pills: { value: FilterState; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATEGORIES.map((c: Category) => ({ value: c, label: CATEGORY_LABELS[c] })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${
            filter === value
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
