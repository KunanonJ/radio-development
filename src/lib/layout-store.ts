import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** When `isDesktop` is false, main content is full width (mobile drawer replaces sidebar). */
export function applySidebarWidthToDocument(iconOnly: boolean, isDesktop = true) {
  if (!isDesktop) {
    document.documentElement.style.setProperty('--sidebar-width', '0px');
    return;
  }
  document.documentElement.style.setProperty('--sidebar-width', iconOnly ? '4.5rem' : '16rem');
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
        if (!error && state) {
          const isDesktop =
            typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
          applySidebarWidthToDocument(state.sidebarIconOnly, isDesktop);
        }
      },
    }
  )
);
