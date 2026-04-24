import { VideoStatus } from '@/lib/types';
import { VIDEO_STATUS_CONFIG } from '@/lib/constants';

export function VideoStatusBadge({ status }: { status: VideoStatus }) {
  const cfg = VIDEO_STATUS_CONFIG[status];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bgColor} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}
