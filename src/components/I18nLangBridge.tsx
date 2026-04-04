import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/** Sets `lang` on `<html>` for accessibility and font selection. */
export function I18nLangBridge() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language?.startsWith('th') ? 'th' : 'en';
    document.documentElement.lang = lng;
  }, [i18n.language]);

  return null;
}
