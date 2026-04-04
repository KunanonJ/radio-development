import { useEffect } from 'react';
import { usePlayerStore } from '@/lib/store';
import { useMergedAlbums, useMergedTracks } from '@/lib/library';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function GlobalSearch() {
  const { t } = useTranslation();
  const { isSearchOpen, setSearchOpen } = usePlayerStore();
  const navigate = useNavigate();
  const mergedTracks = useMergedTracks();
  const mergedAlbums = useMergedAlbums();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchOpen]);

  const go = (path: string) => {
    navigate(path);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl surface-2 border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder={t('globalSearch.inputPlaceholder')}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t('globalSearch.quickLinks')}
              </p>
              {[
                { labelKey: 'globalSearch.searchPage', path: '/app/search' },
                { labelKey: 'globalSearch.allTracks', path: '/app/library/tracks' },
                { labelKey: 'globalSearch.allAlbums', path: '/app/library/albums' },
              ].map((l) => (
                <button
                  key={l.path}
                  onClick={() => go(l.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {t(l.labelKey)}
                </button>
              ))}

              <p className="px-3 py-1.5 mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t('globalSearch.tracks')}
              </p>
              {mergedTracks.slice(0, 4).map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => go(`/app/library/tracks`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <img src={tr.artwork} alt="" className="w-8 h-8 rounded object-cover" />
                  <div className="text-left min-w-0">
                    <p className="text-sm text-foreground truncate">{tr.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{tr.artist}</p>
                  </div>
                </button>
              ))}

              <p className="px-3 py-1.5 mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t('globalSearch.albums')}
              </p>
              {mergedAlbums.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => go(`/app/album/${a.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <img src={a.artwork} alt="" className="w-8 h-8 rounded object-cover" />
                  <div className="text-left min-w-0">
                    <p className="text-sm text-foreground truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.artist}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{t('globalSearch.footerHint')}</span>
              <kbd className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded border border-border bg-muted">
                {t('globalSearch.esc')}
              </kbd>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
