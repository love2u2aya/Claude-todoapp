export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';

export const CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'health', 'other'];

export const CATEGORY_LABELS: Record<Category, string> = {
  personal: 'Personal',
  work: 'Work',
  shopping: 'Shopping',
  health: 'Health',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  personal: 'bg-purple-100 text-purple-700',
  work: 'bg-blue-100 text-blue-700',
  shopping: 'bg-yellow-100 text-yellow-700',
  health: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-600',
};

export interface Todo {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

export type FilterState = 'all' | Category;
