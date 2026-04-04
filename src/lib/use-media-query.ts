import { useEffect, useState } from 'react';

function getMediaMatches(query: string): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia(query).matches;
}

/** Syncs with `matchMedia`; initial state matches the query on first client render to reduce layout flash. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => getMediaMatches(query));

  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setMatches(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

/** Tailwind `md` breakpoint (768px). */
export function useIsDesktopMd() {
  return useMediaQuery('(min-width: 768px)');
}

/** Tailwind `xl` breakpoint (1280px) — wide desktop layouts. */
export function useIsDesktopXl() {
  return useMediaQuery('(min-width: 1280px)');
}
