const dictionaries = {
  en: {
    common: {
      platformSummary:
        "The Urban Radio combines Firebase control-plane services with Cloud Run media workers for hosted automation, relay management, and reporting."
    }
  },
  th: {
    common: {
      platformSummary:
        "The Urban Radio ใช้ Firebase เป็นศูนย์กลางของระบบควบคุม และใช้ Cloud Run สำหรับงานประมวลผลสตรีม การอัดรายการ และรายงานต่าง ๆ"
    }
  }
} as const;

export type SupportedLocale = keyof typeof dictionaries;

export function getLocaleDictionary(locale: SupportedLocale) {
  return dictionaries[locale];
}
