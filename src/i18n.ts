import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import th from '@/locales/th.json';

export const LOCALE_STORAGE_KEY = 'sonic-bloom-locale';

function getInitialLng(): string {
  try {
    const s = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (s === 'en' || s === 'th') return s;
  } catch {
    /* ignore */
  }
  return 'th';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
  },
  lng: getInitialLng(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
});

export default i18n;
