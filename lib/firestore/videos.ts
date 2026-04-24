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
import { Video, VideoStatus } from '../types';

function docToVideo(d: QueryDocumentSnapshot<DocumentData>): Video {
  const data = d.data();
  return {
    id: d.id,
    title: data.title,
    youtubeUrl: data.youtubeUrl,
    description: data.description,
    status: data.status as VideoStatus,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function subscribeToVideos(cb: (videos: Video[]) => void) {
  return onSnapshot(
    query(collection(db, 'videos'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map(docToVideo))
  );
}

export async function addVideo(data: {
  title: string;
  description?: string;
  youtubeUrl?: string;
}) {
  return addDoc(collection(db, 'videos'), {
    ...data,
    status: 'pre_production' as VideoStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateVideo(
  id: string,
  data: Partial<Pick<Video, 'title' | 'description' | 'youtubeUrl' | 'status'>>
) {
  return updateDoc(doc(db, 'videos', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteVideo(id: string) {
  return deleteDoc(doc(db, 'videos', id));
}
