import { Timestamp } from 'firebase/firestore';

export type TaskType = 'planning' | 'scripting' | 'recording' | 'editing' | 'thumbnail';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
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
