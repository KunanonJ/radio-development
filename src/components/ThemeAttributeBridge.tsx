import { useEffect } from 'react';
import { useUiThemeStore } from '@/lib/ui-theme-store';

/** Keeps `data-ui-theme` and `data-accent` on `<html>` in sync with the persisted store. */
export function ThemeAttributeBridge() {
  const theme = useUiThemeStore((s) => s.theme);
  const accent = useUiThemeStore((s) => s.accent);

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-theme', theme);
    document.documentElement.setAttribute('data-accent', accent);
  }, [theme, accent]);

  return null;
}
