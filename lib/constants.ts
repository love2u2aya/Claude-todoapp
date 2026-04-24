import { TaskType, TaskStatus, VideoStatus } from './types';

export const TASK_TYPES: TaskType[] = [
  'thumbnail',
  'recording',
  'cut',
  'telop',
  'ppt_create',
  'ppt_attach',
  'expression',
  'se',
  'illustration',
  'finishing',
  'short',
  'upload',
];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  thumbnail: 'サムネ作成',
  recording: '動画撮影(音声)',
  cut: 'カット',
  telop: 'テロップ',
  ppt_create: 'パワポ資料作成',
  ppt_attach: 'パワポ資料つけ',
  expression: '表情つけ',
  se: 'SEつけ',
  illustration: 'イラストつけ',
  finishing: '仕上げ',
  short: 'ショート作成',
  upload: 'アップロード',
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
