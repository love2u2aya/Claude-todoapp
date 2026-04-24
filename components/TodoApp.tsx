'use client';

import { useTodos } from '@/hooks/useTodos';
import AddTaskForm from './AddTaskForm';
import CategoryFilter from './CategoryFilter';
import TaskList from './TaskList';

export default function TodoApp() {
  const { todos, filteredTodos, filter, setFilter, addTodo, deleteTodo, toggleTodo } = useTodos();

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">My Tasks</h1>
        <p className="text-sm text-gray-400 mb-6">
          {completedCount} / {todos.length} completed
        </p>

        <div className="mb-4">
          <AddTaskForm onAdd={addTodo} />
        </div>

        <div className="mb-4">
          <CategoryFilter filter={filter} onFilterChange={setFilter} />
        </div>

        <TaskList
          todos={filteredTodos}
          filter={filter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
}
