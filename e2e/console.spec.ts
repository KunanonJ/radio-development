import { expect, test } from "@playwright/test";
import { EN, TH } from "./fixtures/constants";

const CONSOLE_BASE = process.env.BASE_URL_CONSOLE || "http://localhost:3001";

const skipConsole = () => !process.env.BASE_URL_CONSOLE;

test.describe("Console app — page load and shell", () => {
  test.skip(skipConsole, "Console tests require BASE_URL_CONSOLE (e.g. http://localhost:3001)");

  test("loads and shows app name / Operations Console", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/");
    await expect(page.getByRole("heading", { name: new RegExp(EN.console_title, "i") })).toBeVisible({ timeout: 15_000 });
  });

  test("shows subtitle about Workers, Durable Objects, D1", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/");
    await expect(page.getByText(EN.console_subtitle)).toBeVisible({ timeout: 15_000 });
  });

  test("has language switcher English and Thai", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/");
    await expect(page.getByRole("link", { name: EN.language_english })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.language_thai })).toBeVisible();
  });

  test("has nav links for Player, Music Library, Scheduler, Broadcasting, Report Generator", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("link", { name: EN.player_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: EN.library_title })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.scheduler_title })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.streaming_title })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.reports_title })).toBeVisible();
  });
});

test.describe("Console app — stat cards", () => {
  test.skip(skipConsole);

  test("displays Environment stat card", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/");
    await expect(page.getByText("Environment").first()).toBeVisible({ timeout: 15_000 });
  });

  test("displays Playback host and Control API cards", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/");
    await expect(page.getByText("Playback host").first()).toBeVisible();
    await expect(page.getByText("Control API").first()).toBeVisible();
  });
});

test.describe("Console app — sections (English)", () => {
  test.skip(skipConsole);

  test("Player section shows Live Assist, current track, crossfade, voice tracking", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: "Player" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.player_live_assist)).toBeVisible();
    await expect(page.getByText(EN.player_current_track)).toBeVisible();
    await expect(page.getByText(EN.player_next_track)).toBeVisible();
    await expect(page.getByText(EN.player_crossfade)).toBeVisible();
    await expect(page.getByText(EN.player_voice_tracking)).toBeVisible();
  });

  test("Music Library section shows Search, Tags, Artwork, Comments", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.library_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.search)).toBeVisible();
    await expect(page.getByText(EN.library_tags)).toBeVisible();
    await expect(page.getByText(EN.library_artwork)).toBeVisible();
    await expect(page.getByText(EN.library_comments)).toBeVisible();
  });

  test("Scheduler section shows Events, Recurring, Commands, Manual mode", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.scheduler_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.scheduler_events)).toBeVisible();
    await expect(page.getByText(EN.scheduler_recurring)).toBeVisible();
    await expect(page.getByText(EN.scheduler_commands)).toBeVisible();
    await expect(page.getByText(EN.scheduler_manual_mode)).toBeVisible();
  });

  test("Broadcasting section shows encoder, listeners, now playing export, statistics", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.streaming_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.streaming_encoder)).toBeVisible();
    await expect(page.getByText(EN.streaming_listeners)).toBeVisible();
    await expect(page.getByText(EN.streaming_now_playing_export)).toBeVisible();
    await expect(page.getByText(EN.streaming_statistics)).toBeVisible();
  });

  test("Report Generator section shows date range, export XLS/PDF, airplay", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.reports_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.reports_date_range)).toBeVisible();
    await expect(page.getByText(EN.reports_export_xls)).toBeVisible();
    await expect(page.getByText(EN.reports_export_pdf)).toBeVisible();
    await expect(page.getByText(EN.reports_airplay)).toBeVisible();
  });

  test("Error section shows file not found, connection failed, please restart", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.error })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.errors_file_not_found)).toBeVisible();
    await expect(page.getByText(EN.errors_connection_failed)).toBeVisible();
    await expect(page.getByText(EN.errors_please_restart)).toBeVisible();
  });
});

test.describe("Console app — Thai locale (lang=th)", () => {
  test.skip(skipConsole);

  test("nav labels are Thai when lang=th", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=th");
    await expect(page.getByRole("link", { name: TH.streaming_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: TH.library_title })).toBeVisible();
    await expect(page.getByRole("link", { name: TH.scheduler_title })).toBeVisible();
    await expect(page.getByRole("link", { name: TH.reports_title })).toBeVisible();
  });

  test("Player section heading and content Thai when lang=th", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=th");
    await expect(page.getByText(TH.player_live_assist)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(TH.player_current_track)).toBeVisible();
    await expect(page.getByText(TH.player_next_track)).toBeVisible();
  });

  test("Error section messages Thai when lang=th", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=th");
    await expect(page.getByText(TH.errors_connection_failed)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(TH.errors_please_restart)).toBeVisible();
  });
});

test.describe("Console app — language switcher", () => {
  test.skip(skipConsole);

  test("switching to Thai updates URL and content", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=en");
    await page.getByRole("link", { name: EN.language_thai }).click();
    await expect(page).toHaveURL(/\?lang=th/);
    await expect(page.getByText(TH.errors_connection_failed).first()).toBeVisible({ timeout: 10_000 });
  });

  test("switching to English updates URL and content", async ({ page }) => {
    await page.goto(CONSOLE_BASE + "/?lang=th");
    await page.getByRole("link", { name: TH.language_english }).click();
    await expect(page).toHaveURL(/\?lang=en/);
    await expect(page.getByText(EN.streaming_title)).toBeVisible({ timeout: 10_000 });
  });
});
