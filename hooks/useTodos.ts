'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Todo, Category, FilterState } from '@/types/todo';
import { loadTodos, saveTodos } from '@/lib/localStorage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<FilterState>('all');

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (filter === 'all') return todos;
    return todos.filter((t) => t.category === filter);
  }, [todos, filter]);

  function addTodo(title: string, category: Category) {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        category,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  return { todos, filteredTodos, filter, setFilter, addTodo, deleteTodo, toggleTodo };
}
