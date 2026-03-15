import { describe, expect, it } from "vitest";
import { getLocaleDictionary, localeLabel, t } from "@radioboss/i18n";

describe("i18n catalog", () => {
  it("loads Thai common translations", () => {
    const { locale, dictionary } = getLocaleDictionary("th");
    expect(locale).toBe("th");
    expect(dictionary.common.language).toBe("ภาษา");
  });

  it("falls back to English for unknown locales", () => {
    expect(getLocaleDictionary("jp").locale).toBe("en");
  });

  it("returns labels and translation helpers", () => {
    expect(localeLabel("th")).toBe("ภาษาไทย");
    expect(t("en", "player", "current_track")).toBe("Current track");
  });
});
