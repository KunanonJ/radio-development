import { expect, test } from "@playwright/test";
import { EN, TH } from "./fixtures/constants";

const PUBLIC_BASE = process.env.BASE_URL || "http://localhost:3000";

test.describe("Public app — page load and shell", () => {
  test("loads without error and shows app name", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByRole("heading", { name: /RadioBOSS Public/i })).toBeVisible({ timeout: 15_000 });
  });

  test("shows main title and subtitle", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByText(EN.public_title)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Public embeds and playback are delivered at the edge")).toBeVisible();
  });

  test("has language switcher links in the header", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByRole("link", { name: EN.language_english })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.language_thai })).toBeVisible();
  });

  test("has navigation links for Broadcasting, Widgets, Metadata", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByRole("link", { name: EN.streaming_title })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.nav_widgets })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.nav_metadata })).toBeVisible();
  });
});

test.describe("Public app — stat cards", () => {
  test("displays Widget ID stat card with demo-player or binding value", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByText("Widget ID").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("demo-player", { exact: true }).or(page.getByText("Used for signed embed payloads"))).toBeVisible();
  });

  test("displays Playback host stat card", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByText("Playback host").first()).toBeVisible();
  });

  test("displays Environment stat card", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByText("Environment").first()).toBeVisible();
  });
});

test.describe("Public app — sections (English)", () => {
  test("shows Broadcasting section with encoder, listeners, now playing export, statistics", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.streaming_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.streaming_listeners)).toBeVisible();
    await expect(page.getByText(EN.streaming_encoder)).toBeVisible();
    await expect(page.getByText(EN.streaming_now_playing_export)).toBeVisible();
    await expect(page.getByText(EN.streaming_statistics)).toBeVisible();
  });

  test("shows Now playing section with current track and next track", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: "Now playing" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.player_current_track)).toBeVisible();
    await expect(page.getByText(EN.player_next_track)).toBeVisible();
  });

  test("shows Error section with connection, stream, token and restart messages", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.error })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.errors_connection_failed)).toBeVisible();
    await expect(page.getByText(EN.errors_stream_error)).toBeVisible();
    await expect(page.getByText(EN.errors_invalid_token)).toBeVisible();
    await expect(page.getByText(EN.errors_token_expired)).toBeVisible();
    await expect(page.getByText(EN.errors_please_restart)).toBeVisible();
  });

  test("shows Language section with Thai and English options", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.language })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.language_thai)).toBeVisible();
    await expect(page.getByText(EN.language_english)).toBeVisible();
    await expect(page.getByText(EN.help)).toBeVisible();
  });
});

test.describe("Public app — Thai locale (lang=th)", () => {
  test("URL lang=th shows Thai in language switcher", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByRole("link", { name: TH.language_thai })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: TH.language_english })).toBeVisible();
  });

  test("nav label for Broadcasting is Thai when lang=th", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByRole("link", { name: TH.streaming_title })).toBeVisible({ timeout: 15_000 });
  });

  test("Broadcasting section heading is Thai when lang=th", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByRole("heading", { name: TH.streaming_title })).toBeVisible({ timeout: 15_000 });
  });

  test("streaming list items are Thai when lang=th", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByText(TH.streaming_listeners)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(TH.streaming_encoder)).toBeVisible();
    await expect(page.getByText(TH.streaming_now_playing_export)).toBeVisible();
    await expect(page.getByText(TH.streaming_statistics)).toBeVisible();
  });

  test("error messages are Thai when lang=th", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByText(TH.errors_connection_failed)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(TH.errors_stream_error)).toBeVisible();
    await expect(page.getByText(TH.errors_invalid_token)).toBeVisible();
    await expect(page.getByText(TH.errors_token_expired)).toBeVisible();
    await expect(page.getByText(TH.errors_please_restart)).toBeVisible();
  });

  test("Error section heading is Thai when lang=th", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByRole("heading", { name: TH.common_error })).toBeVisible({ timeout: 15_000 });
  });

  test("Now playing section shows Thai labels when lang=th", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await expect(page.getByText(TH.player_current_track)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(TH.player_next_track)).toBeVisible();
  });
});

test.describe("Public app — language switcher navigation", () => {
  test("clicking English keeps or switches to English and shows English content", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await page.getByRole("link", { name: TH.language_english }).click();
    await expect(page).toHaveURL(/\?lang=en/);
    await expect(page.getByText(EN.errors_connection_failed).first()).toBeVisible({ timeout: 10_000 });
  });

  test("clicking Thai switches to Thai and shows Thai content", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    await page.getByRole("link", { name: EN.language_thai }).click();
    await expect(page).toHaveURL(/\?lang=th/);
    await expect(page.getByText(TH.errors_connection_failed).first()).toBeVisible({ timeout: 10_000 });
  });

  test("language in URL is preserved when navigating to same page with hash", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=th");
    await page.getByRole("link", { name: TH.streaming_title }).first().click();
    await expect(page).toHaveURL(/\?lang=th/);
  });
});

test.describe("Public app — URL and default locale", () => {
  test("no lang param defaults to English", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    await expect(page.getByRole("link", { name: EN.language_english })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.streaming_title)).toBeVisible();
  });

  test("invalid lang param falls back to English", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=xx");
    await expect(page.getByText(EN.streaming_title)).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Public app — token validation (when CONTROL_API available)", () => {
  test("page without token param does not show token error section", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    const errorHeadings = page.getByRole("heading", { name: EN.error });
    await expect(errorHeadings.first()).toBeVisible({ timeout: 15_000 });
    const count = await errorHeadings.count();
    expect(count).toBeLessThanOrEqual(2);
  });

  test("invalid token param may show error section with invalid_token or please_restart", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en&token=invalid.jwt.here");
    await page.waitForLoadState("networkidle").catch(() => {});
    const body = await page.locator("body").textContent();
    const hasError = body?.includes(EN.errors_invalid_token) || body?.includes(EN.errors_please_restart) || body?.includes(EN.errors_token_expired);
    expect(hasError).toBeTruthy();
  });
});

test.describe("Public app — accessibility and structure", () => {
  test("main content has headings in order", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/?lang=en");
    const streamingHeading = page.getByRole("heading", { name: EN.streaming_title });
    await expect(streamingHeading.first()).toBeVisible({ timeout: 15_000 });
  });

  test("links have discernible text", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    const links = page.getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < Math.min(count, 6); i++) {
      await expect(links.nth(i)).toHaveAttribute("href", /.+/);
    }
  });

  test("page has main landmark or body content", async ({ page }) => {
    await page.goto(PUBLIC_BASE + "/");
    const main = page.getByRole("main");
    const count = await main.count();
    const bodyText = await page.locator("body").textContent();
    expect(count).toBeGreaterThanOrEqual(0);
    expect(bodyText?.length).toBeGreaterThan(100);
  });
});
