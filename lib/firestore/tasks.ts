import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
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

function sortByCreatedAt(tasks: Task[], dir: 'asc' | 'desc' = 'asc'): Task[] {
  return [...tasks].sort((a, b) => {
    const ta = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
    const tb = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
    return dir === 'asc' ? ta - tb : tb - ta;
  });
}

export function subscribeToVideoTasks(
  videoId: string,
  cb: (tasks: Task[]) => void,
  onError?: (e: Error) => void
) {
  return onSnapshot(
    query(collection(db, 'tasks'), where('videoId', '==', videoId)),
    (snap) => cb(sortByCreatedAt(snap.docs.map(docToTask), 'asc')),
    onError
  );
}

export function subscribeToWorkerTasks(
  workerId: string,
  cb: (tasks: Task[]) => void,
  onError?: (e: Error) => void
) {
  return onSnapshot(
    query(collection(db, 'tasks'), where('assignedWorkerId', '==', workerId)),
    (snap) => cb(sortByCreatedAt(snap.docs.map(docToTask), 'desc')),
    onError
  );
}

export function subscribeToAllTasks(
  cb: (tasks: Task[]) => void,
  onError?: (e: Error) => void
) {
  return onSnapshot(
    query(collection(db, 'tasks')),
    (snap) => cb(sortByCreatedAt(snap.docs.map(docToTask), 'desc')),
    onError
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
