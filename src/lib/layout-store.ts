import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** When `isDesktop` is false, main content is full width (mobile drawer replaces sidebar). */
export function applySidebarWidthToDocument(iconOnly: boolean, isDesktop = true, isXl = false) {
  if (!isDesktop) {
    document.documentElement.style.setProperty('--sidebar-width', '0px');
    return;
  }
  if (iconOnly) {
    document.documentElement.style.setProperty('--sidebar-width', '4.5rem');
    return;
  }
  document.documentElement.style.setProperty('--sidebar-width', isXl ? '18rem' : '16rem');
}

type LayoutState = {
  sidebarIconOnly: boolean;
  setSidebarIconOnly: (iconOnly: boolean) => void;
  toggleSidebarIconOnly: () => void;
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarIconOnly: false,
      setSidebarIconOnly: (iconOnly) => set({ sidebarIconOnly: iconOnly }),
      toggleSidebarIconOnly: () => set((s) => ({ sidebarIconOnly: !s.sidebarIconOnly })),
    }),
    {
      name: 'sonic-bloom-layout',
      partialize: (state) => ({ sidebarIconOnly: state.sidebarIconOnly }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state && typeof window !== 'undefined') {
          const isDesktop = window.matchMedia('(min-width: 768px)').matches;
          const isXl = window.matchMedia('(min-width: 1280px)').matches;
          applySidebarWidthToDocument(state.sidebarIconOnly, isDesktop, isXl);
        }
      },
    }
  )
);
