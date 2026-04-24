'use client';

import type { Todo, FilterState } from '@/types/todo';
import TaskItem from './TaskItem';

interface Props {
  todos: Todo[];
  filter: FilterState;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ todos, filter, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        {filter === 'all' ? 'No tasks yet. Add one above!' : 'No tasks in this category.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TaskItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
