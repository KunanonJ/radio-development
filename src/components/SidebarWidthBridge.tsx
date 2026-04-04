import { useEffect } from 'react';
import { applySidebarWidthToDocument, useLayoutStore } from '@/lib/layout-store';
import { useIsDesktopMd, useIsDesktopXl } from '@/lib/use-media-query';

/** Syncs `--sidebar-width` on `<html>` with icon-only mode, mobile (0 width), and xl width. */
export function SidebarWidthBridge() {
  const iconOnly = useLayoutStore((s) => s.sidebarIconOnly);
  const isDesktop = useIsDesktopMd();
  const isXl = useIsDesktopXl();

  useEffect(() => {
    applySidebarWidthToDocument(iconOnly, isDesktop, isXl);
  }, [iconOnly, isDesktop, isXl]);

  return null;
}
