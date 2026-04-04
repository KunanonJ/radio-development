'use client';

import type { ReactNode } from 'react';
import { Track } from '@/lib/types';
import { formatDuration } from '@/lib/format';
import { usePlayerStore } from '@/lib/store';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrackRowProps {
  track: Track;
  index: number;
  /** Prepended column (e.g. drag handle for queue reorder) */
  leadingSlot?: ReactNode;
  showAlbum?: boolean;
  /** Queue page: wall-clock start (e.g. "2:34 PM") */
  startsAtClock?: string;
  /** Queue page: relative delay (e.g. "in 4:12") */
  startsIn?: string;
  /** Library bulk-select mode */
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (trackId: string) => void;
}

export function TrackRow({
  track,
  index,
  leadingSlot,
  showAlbum = true,
  startsAtClock,
  startsIn,
  selectionMode,
  selected,
  onToggleSelect,
}: TrackRowProps) {
  const { currentTrack, isPlaying, play, pause } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className={`group flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors ${selectionMode ? 'cursor-default' : 'cursor-pointer'} ${isActive ? 'bg-primary/10' : 'hover:bg-secondary'} ${selected ? 'ring-1 ring-primary/50 bg-primary/5' : ''} ${leadingSlot ? 'pl-2' : ''}`}
      onDoubleClick={() => {
        if (!selectionMode) play(track);
      }}
    >
      {leadingSlot != null && <div className="flex w-8 shrink-0 items-center justify-center">{leadingSlot}</div>}
      <div className="w-8 text-center flex-shrink-0">
        {selectionMode ? (
          <input
            type="checkbox"
            className="rounded border-border w-4 h-4 accent-primary cursor-pointer"
            checked={!!selected}
            onChange={() => onToggleSelect?.(track.id)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${track.title}`}
          />
        ) : (
          <>
            <span className={`text-sm font-mono group-hover:hidden ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {index + 1}
            </span>
            <button
              type="button"
              onClick={() => (isActive && isPlaying ? pause() : play(track))}
              className="hidden group-hover:block"
            >
              {isActive && isPlaying ? <Pause className="w-4 h-4 text-primary mx-auto" /> : <Play className="w-4 h-4 text-foreground mx-auto" />}
            </button>
          </>
        )}
      </div>

      <img
        src={track.artwork}
        alt=""
        className="w-10 h-10 rounded object-cover flex-shrink-0"
        loading="lazy"
      />

      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isActive ? 'text-primary font-medium' : 'text-foreground'}`}>{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>

      {showAlbum && (
        <p className="text-sm text-muted-foreground truncate w-[200px] hidden lg:block">{track.album}</p>
      )}

      {(startsAtClock != null || startsIn != null) && (
        <div className="w-[104px] shrink-0 text-right hidden md:block">
          {startsAtClock != null && (
            <p className="text-xs text-foreground tabular-nums leading-tight">{startsAtClock}</p>
          )}
          {startsIn != null && (
            <p className="text-[10px] text-muted-foreground tabular-nums leading-tight mt-0.5">{startsIn}</p>
          )}
        </div>
      )}

      <span className="text-sm text-muted-foreground font-mono w-12 text-right">{formatDuration(track.duration)}</span>

      <button className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
