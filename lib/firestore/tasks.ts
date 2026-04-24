import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Task, TaskStatus, TaskType } from '../types';

function docToTask(d: QueryDocumentSnapshot<DocumentData>): Task {
  const data = d.data();
  return {
    id: d.id,
    videoId: data.videoId,
    type: data.type as TaskType,
    label: data.label,
    assignedWorkerId: data.assignedWorkerId,
    assignedWorkerName: data.assignedWorkerName,
    status: data.status as TaskStatus,
    notes: data.notes,
    dueDate: data.dueDate,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function subscribeToVideoTasks(videoId: string, cb: (tasks: Task[]) => void) {
  return onSnapshot(
    query(
      collection(db, 'tasks'),
      where('videoId', '==', videoId),
      orderBy('createdAt', 'asc')
    ),
    (snap) => cb(snap.docs.map(docToTask))
  );
}

export function subscribeToWorkerTasks(workerId: string, cb: (tasks: Task[]) => void) {
  return onSnapshot(
    query(
      collection(db, 'tasks'),
      where('assignedWorkerId', '==', workerId),
      orderBy('createdAt', 'desc')
    ),
    (snap) => cb(snap.docs.map(docToTask))
  );
}

export function subscribeToAllTasks(cb: (tasks: Task[]) => void) {
  return onSnapshot(
    query(collection(db, 'tasks'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map(docToTask))
  );
}

export async function addTask(data: {
  videoId: string;
  type: TaskType;
  label: string;
  assignedWorkerId: string;
  assignedWorkerName: string;
  notes?: string;
}) {
  return addDoc(collection(db, 'tasks'), {
    ...data,
    status: 'todo' as TaskStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(
  id: string,
  data: Partial<Pick<Task, 'type' | 'label' | 'assignedWorkerId' | 'assignedWorkerName' | 'status' | 'notes'>>
) {
  return updateDoc(doc(db, 'tasks', id), { ...data, updatedAt: serverTimestamp() });
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  return updateDoc(doc(db, 'tasks', id), { status, updatedAt: serverTimestamp() });
}

export async function deleteTask(id: string) {
  return deleteDoc(doc(db, 'tasks', id));
}
