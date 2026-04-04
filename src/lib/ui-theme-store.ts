import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UiTheme = 'day' | 'dark' | 'midnight' | 'oled';

export type UiAccent = 'green' | 'cyan' | 'violet' | 'amber';

function applyThemeToDocument(theme: UiTheme) {
  document.documentElement.setAttribute('data-ui-theme', theme);
}

function applyAccentToDocument(accent: UiAccent) {
  document.documentElement.setAttribute('data-accent', accent);
}

type UiThemeState = {
  theme: UiTheme;
  accent: UiAccent;
  setTheme: (theme: UiTheme) => void;
  setAccent: (accent: UiAccent) => void;
};

export const useUiThemeStore = create<UiThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accent: 'green',
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDocument(theme);
      },
      setAccent: (accent) => {
        set({ accent });
        applyAccentToDocument(accent);
      },
    }),
    {
      name: 'sonic-bloom-ui-theme',
      partialize: (state) => ({ theme: state.theme, accent: state.accent }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          if (state.theme) applyThemeToDocument(state.theme);
          applyAccentToDocument(state.accent ?? 'green');
        }
      },
    }
  )
);
