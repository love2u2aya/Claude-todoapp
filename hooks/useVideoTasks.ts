'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { subscribeToVideoTasks } from '@/lib/firestore/tasks';

export function useVideoTasks(videoId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;
    const unsub = subscribeToVideoTasks(
      videoId,
      (t) => { setTasks(t); setLoading(false); },
      () => setLoading(false)
    );
    return unsub;
  }, [videoId]);

  return { tasks, loading };
}
