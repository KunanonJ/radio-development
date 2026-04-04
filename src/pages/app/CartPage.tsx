import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CART_SLOT_COUNT, useCartStore } from '@/lib/cart-store';
import { useMergedTracks } from '@/lib/library';
import { usePlayerStore } from '@/lib/store';
import type { Track } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Disc3, Play, Trash2, Keyboard } from 'lucide-react';

export default function CartPage() {
  const { t } = useTranslation();
  const slots = useCartStore((s) => s.slots);
  const setSlot = useCartStore((s) => s.setSlot);
  const clearSlot = useCartStore((s) => s.clearSlot);
  const play = usePlayerStore((s) => s.play);
  const allTracks = useMergedTracks();
  const byId = useMemo(() => {
    const m = new Map<string, Track>();
    for (const tr of allTracks) m.set(tr.id, tr);
    return m;
  }, [allTracks]);

  return (
    <div className="max-w-[1000px]">
      <div className="flex items-center gap-3 mb-2">
        <Disc3 className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t('cart.title')}</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-2 max-w-2xl">
        {t('cart.intro')}{' '}
        <kbd className="px-1 rounded border border-border text-xs">{t('cart.introKeys')}</kbd>–
        <kbd className="px-1 rounded border border-border text-xs">{t('cart.introKeys2')}</kbd>{' '}
        {t('cart.introEnd')}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
        <Keyboard className="w-3.5 h-3.5" />
        <span>{t('cart.hotkeysGlobal')}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: CART_SLOT_COUNT }, (_, i) => {
          const tr = slots[i];
          const keyNum = i === 8 ? '9' : String(i + 1);
          return (
            <div
              key={i}
              className="surface-2 border border-border rounded-xl p-4 flex flex-col gap-3 min-h-[140px]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {t('cart.slot', { n: i + 1 })}
                  {i < 9 && (
                    <span className="ml-2 text-[10px] opacity-70">
                      {t('cart.keyHint', { key: keyNum })}
                    </span>
                  )}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!tr}
                    onClick={() => tr && play(tr)}
                    aria-label={t('cart.playSlot', { n: i + 1 })}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!tr}
                    onClick={() => clearSlot(i)}
                    aria-label={t('cart.clearSlot', { n: i + 1 })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {tr ? (
                <div className="flex gap-3 min-w-0">
                  <img src={tr.artwork} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{tr.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{tr.artist}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">{t('cart.empty')}</p>
              )}
              <Select
                value={tr?.id}
                onValueChange={(id) => {
                  const track = byId.get(id);
                  setSlot(i, track ?? null);
                }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder={t('cart.assignPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {allTracks.slice(0, 80).map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.artist} — {track.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
