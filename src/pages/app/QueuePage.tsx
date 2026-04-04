import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackRow';
import { formatStartsAtClock, formatStartsIn, formatHMS } from '@/lib/format';
import { getRemainingQueueSeconds } from '@/lib/queue-utils';
import { ListMusic } from 'lucide-react';

function QueueColumnHeaders() {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/20 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      role="row"
    >
      <div className="w-8 text-center shrink-0">{t('queue.headers.number')}</div>
      <div className="w-10 shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">{t('queue.headers.title')}</div>
      <div className="w-[200px] hidden lg:block truncate">{t('queue.headers.album')}</div>
      <div className="w-[104px] shrink-0 text-right hidden md:block">
        <span className="block">{t('queue.headers.start')}</span>
        <span className="block font-normal normal-case tracking-normal text-[10px] text-muted-foreground/90 mt-0.5">
          {t('queue.headers.startsIn')}
        </span>
      </div>
      <div className="w-12 text-right shrink-0">{t('queue.headers.time')}</div>
      <div className="w-7 shrink-0" aria-hidden />
    </div>
  );
}

export default function QueuePage() {
  const { t } = useTranslation();
  const { queue, queueIndex, currentTrack, progress } = usePlayerStore();

  const remainingTotal = useMemo(
    () => getRemainingQueueSeconds(queue, queueIndex, progress, currentTrack),
    [queue, queueIndex, progress, currentTrack]
  );

  const remainingCurrent =
    currentTrack != null ? currentTrack.duration * (1 - progress) : 0;

  const upNextWithStartOffset = useMemo(() => {
    const list = queue.slice(queueIndex + 1);
    let offset = remainingCurrent;
    return list.map((tr) => {
      const start = offset;
      offset += tr.duration;
      return { track: tr, startOffset: start };
    });
  }, [queue, queueIndex, remainingCurrent]);

  const trackCountLabel =
    queue.length === 1 ? t('queue.oneTrack', { count: 1 }) : t('queue.nTracks', { count: queue.length });

  return (
    <div className="app-page">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
        <div className="flex items-center gap-3">
          <ListMusic className="w-6 h-6 text-primary shrink-0" />
          <h1 className="text-3xl font-bold text-foreground">{t('queue.title')}</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {trackCountLabel}
          {queue.length > 0 && (
            <>
              {' · '}
              <span className="tabular-nums">{formatHMS(remainingTotal)}</span>{' '}
              {t('queue.playingTimeLeftSuffix')}
            </>
          )}
        </span>
      </div>

      {currentTrack && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t('queue.nowPlaying')}</p>
          <div className="surface-2 border border-primary/20 rounded-xl overflow-hidden">
            <QueueColumnHeaders />
            <TrackRow track={currentTrack} index={0} startsAtClock={t('queue.headers.now')} />
          </div>
        </div>
      )}

      <div className="mb-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t('queue.upNext')}</p>
        <p className="text-[11px] text-muted-foreground/80 mt-1">{t('queue.upNextHint')}</p>
      </div>
      {upNextWithStartOffset.length > 0 ? (
        <div className="surface-2 border border-border rounded-xl overflow-hidden">
          <QueueColumnHeaders />
          {upNextWithStartOffset.map(({ track: tr, startOffset }, i) => (
            <TrackRow
              key={`${tr.id}-${queueIndex + 1 + i}`}
              track={tr}
              index={i}
              startsAtClock={formatStartsAtClock(startOffset)}
              startsIn={formatStartsIn(startOffset)}
            />
          ))}
        </div>
      ) : (
        <div className="surface-2 border border-border rounded-xl p-12 text-center">
          <ListMusic className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {queue.length === 0 ? t('queue.empty') : t('queue.noUpNext')}
          </p>
        </div>
      )}
    </div>
  );
}
