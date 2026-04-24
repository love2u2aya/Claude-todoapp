'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { subscribeToWorkerTasks } from '@/lib/firestore/tasks';

export function useWorkerTasks(workerId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workerId) return;
    const unsub = subscribeToWorkerTasks(workerId, (t) => {
      setTasks(t);
      setLoading(false);
    });
    return unsub;
  }, [workerId]);

  return { tasks, loading };
}
