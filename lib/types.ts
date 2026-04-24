import { Timestamp } from 'firebase/firestore';

export type TaskType =
  | 'thumbnail'
  | 'recording'
  | 'cut'
  | 'telop'
  | 'ppt_create'
  | 'ppt_attach'
  | 'expression'
  | 'se'
  | 'illustration'
  | 'finishing'
  | 'short'
  | 'upload';

export type TaskStatus = 'todo' | 'needs_request' | 'waiting' | 'in_progress' | 'review' | 'done';
export type VideoStatus = 'pre_production' | 'in_production' | 'in_review' | 'published';

export interface Worker {
  id: string;
  name: string;
  email?: string;
  createdAt: Timestamp;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl?: string;
  description?: string;
  status: VideoStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Task {
  id: string;
  videoId: string;
  type: TaskType;
  label: string;
  assignedWorkerId: string;
  assignedWorkerName?: string;
  status: TaskStatus;
  notes?: string;
  dueDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
