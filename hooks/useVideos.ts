'use client';
import { useState, useEffect } from 'react';
import { Video } from '@/lib/types';
import { subscribeToVideos } from '@/lib/firestore/videos';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToVideos((v) => {
      setVideos(v);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { videos, loading };
}
