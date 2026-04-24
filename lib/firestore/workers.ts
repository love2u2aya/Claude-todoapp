import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Worker } from '../types';

function docToWorker(d: QueryDocumentSnapshot<DocumentData>): Worker {
  const data = d.data();
  return {
    id: d.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt,
  };
}

export function subscribeToWorkers(cb: (workers: Worker[]) => void) {
  return onSnapshot(
    query(collection(db, 'workers'), orderBy('createdAt', 'asc')),
    (snap) => cb(snap.docs.map(docToWorker))
  );
}

export async function addWorker(data: { name: string; email?: string }) {
  return addDoc(collection(db, 'workers'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateWorker(id: string, data: Partial<Pick<Worker, 'name' | 'email'>>) {
  return updateDoc(doc(db, 'workers', id), data);
}

export async function deleteWorker(id: string) {
  return deleteDoc(doc(db, 'workers', id));
}
