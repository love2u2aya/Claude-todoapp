'use client';
import { useState, useEffect } from 'react';
import { Worker } from '@/lib/types';
import { subscribeToWorkers } from '@/lib/firestore/workers';

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToWorkers((w) => {
      setWorkers(w);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { workers, loading };
}
