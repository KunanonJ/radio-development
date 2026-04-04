import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMergedTracks } from '@/lib/library';
import { usePlayerStore } from '@/lib/store';
import { useSpotScheduleStore } from '@/lib/spot-schedule-store';
import { computeNextOccurrences } from '@/lib/spot-schedule-engine';
import { Button } from '@/components/ui/button';
import { TrackRow } from '@/components/TrackRow';
import {
  AlertTriangle,
  ArrowRight,
  Library,
  Megaphone,
  Radio,
  CircleHelp,
} from 'lucide-react';
import { formatDuration } from '@/lib/format';

export default function HomePage() {
  const { t } = useTranslation();
  const merged = useMergedTracks();
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const progress = usePlayerStore((s) => s.progress);
  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);
  const getNextTrack = usePlayerStore((s) => s.getNextTrack);

  const rules = useSpotScheduleStore((s) => s.rules);

  const nextTrack = getNextTrack();

  const enabledRules = useMemo(() => rules.filter((r) => r.enabled), [rules]);

  const earliestBreak = useMemo(() => {
    let best: Date | null = null;
    for (const r of enabledRules) {
      const occ = computeNextOccurrences(r, new Date(), 1);
      const d = occ[0];
      if (d && (!best || d < best)) best = d;
    }
    return best;
  }, [enabledRules]);

  const alerts = useMemo(() => {
    const list: { key: string; message: string }[] = [];
    if (rules.length === 0) {
      list.push({ key: 'noSpots', message: t('dashboard.alertNoSpots') });
    }
    if (merged.length === 0) {
      list.push({ key: 'emptyLib', message: t('dashboard.alertEmptyLibrary') });
    }
    return list;
  }, [rules.length, merged.length, t]);

  const queuePreview = useMemo(() => queue.slice(queueIndex, queueIndex + 4), [queue, queueIndex]);

  return (
    <div className="space-y-8 app-page-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1 max-w-[52ch]">{t('dashboard.subtitle')}</p>
      </div>

      {alerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            {t('dashboard.alerts')}
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            {alerts.map((a) => (
              <li key={a.key}>{a.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-2 border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Radio className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('dashboard.nowPlaying')}
            </h2>
          </div>
          {currentTrack ? (
            <div>
              <p className="text-lg font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                {t('dashboard.approxLeft', {
                  time: formatDuration(Math.round(currentTrack.duration * (1 - progress))),
                })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('dashboard.nothingPlaying')}</p>
          )}
        </div>

        <div className="surface-2 border border-border rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t('dashboard.upNext')}
          </h2>
          {nextTrack ? (
            <div>
              <p className="text-lg font-medium text-foreground truncate">{nextTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{nextTrack.artist}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('dashboard.noUpNext')}</p>
          )}
        </div>

        <div className="surface-2 border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Library className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('dashboard.libraryTitle')}
            </h2>
          </div>
          <p className="text-2xl font-bold text-foreground">{t('dashboard.libraryTracks', { count: merged.length })}</p>
        </div>

        <div className="surface-2 border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Megaphone className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('dashboard.spotsTitle')}
            </h2>
          </div>
          {rules.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('dashboard.spotsNone')}</p>
          ) : (
            <>
              <p className="text-lg font-medium text-foreground">
                {t('dashboard.spotsSummary', { enabled: enabledRules.length, total: rules.length })}
              </p>
              <p className="text-sm text-muted-foreground">
                {earliestBreak
                  ? t('dashboard.nextBreakAt', { time: earliestBreak.toLocaleString() })
                  : t('dashboard.noBreakScheduled')}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="gap-2" asChild>
          <Link to="/app/library/tracks">
            <Library className="w-4 h-4" />
            {t('dashboard.openLibrary')}
            <ArrowRight className="w-4 h-4 opacity-60" />
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link to="/app/spot-schedule">
            <Megaphone className="w-4 h-4" />
            {t('dashboard.openSpots')}
            <ArrowRight className="w-4 h-4 opacity-60" />
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link to="/app/how-to-use">
            <CircleHelp className="w-4 h-4" />
            {t('dashboard.openHowTo')}
            <ArrowRight className="w-4 h-4 opacity-60" />
          </Link>
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold text-foreground">{t('dashboard.queuePreview')}</h2>
          <span className="text-xs text-muted-foreground">{t('dashboard.tracksInQueue', { count: queue.length })}</span>
        </div>
        <div className="surface-2 border border-border rounded-xl overflow-hidden">
          {queuePreview.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">{t('dashboard.nothingPlaying')}</p>
          ) : (
            queuePreview.map((tr, i) => (
              <TrackRow key={`${tr.id}-${queueIndex + i}`} track={tr} index={queueIndex + i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
