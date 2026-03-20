import { describe, expect, it } from "vitest";
import { getLocaleDictionary } from "../packages/i18n/src/index";

describe("i18n", () => {
  it("returns Thai copy in UTF-8", () => {
    expect(getLocaleDictionary("th").common.platformSummary).toContain("Firebase");
    expect(getLocaleDictionary("th").common.platformSummary).toContain("Cloud Run");
  });
});
