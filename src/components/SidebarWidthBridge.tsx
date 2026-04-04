import { useEffect } from 'react';
import { applySidebarWidthToDocument, useLayoutStore } from '@/lib/layout-store';
import { useIsDesktopMd } from '@/lib/use-media-query';

/** Syncs `--sidebar-width` on `<html>` with icon-only mode and mobile (0 width). */
export function SidebarWidthBridge() {
  const iconOnly = useLayoutStore((s) => s.sidebarIconOnly);
  const isDesktop = useIsDesktopMd();

  useEffect(() => {
    applySidebarWidthToDocument(iconOnly, isDesktop);
  }, [iconOnly, isDesktop]);

  return null;
}
