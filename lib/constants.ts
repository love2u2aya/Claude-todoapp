import { TaskType, TaskStatus, VideoStatus } from './types';

export const TASK_TYPES: TaskType[] = [
  'planning',
  'scripting',
  'recording',
  'editing',
  'thumbnail',
];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  planning: '企画',
  scripting: '台本',
  recording: '収録',
  editing: '編集',
  thumbnail: 'サムネイル',
};

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  todo: {
    label: '未着手',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
  in_progress: {
    label: '進行中',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
  review: {
    label: 'レビュー中',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  done: {
    label: '完了',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
};

export const VIDEO_STATUS_CONFIG: Record<
  VideoStatus,
  { label: string; color: string; bgColor: string }
> = {
  pre_production: { label: '制作前', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  in_production: { label: '制作中', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  in_review: { label: 'レビュー中', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  published: { label: '公開済み', color: 'text-green-700', bgColor: 'bg-green-100' },
};

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
