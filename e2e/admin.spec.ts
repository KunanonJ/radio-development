import { expect, test } from "@playwright/test";
import { EN, TH } from "./fixtures/constants";

const ADMIN_BASE = process.env.BASE_URL_ADMIN || "http://localhost:3002";

const skipAdmin = () => !process.env.BASE_URL_ADMIN;

test.describe("Admin app — page load and shell", () => {
  test.skip(skipAdmin, "Admin tests require BASE_URL_ADMIN (e.g. http://localhost:3002)");

  test("loads and shows RadioBOSS.FM / Hosting Admin", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/");
    await expect(page.getByRole("heading", { name: new RegExp(EN.admin_app_name, "i") })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: new RegExp(EN.admin_title, "i") })).toBeVisible();
  });

  test("shows subtitle about tenancy, provisioning, billing", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/");
    await expect(page.getByText(EN.admin_subtitle)).toBeVisible({ timeout: 15_000 });
  });

  test("has language switcher English and Thai", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/");
    await expect(page.getByRole("link", { name: EN.language_english })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.language_thai })).toBeVisible();
  });

  test("has nav links for Plans, Provisioning, Ads, Reports, Observability", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("link", { name: EN.nav_plans })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: EN.nav_provisioning })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.ads_title })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.reports_title })).toBeVisible();
    await expect(page.getByRole("link", { name: EN.nav_observability })).toBeVisible();
  });
});

test.describe("Admin app — stat cards", () => {
  test.skip(skipAdmin);

  test("displays Environment, Access audience, Billing provider", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/");
    await expect(page.getByText("Environment").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Access audience").first()).toBeVisible();
    await expect(page.getByText("Billing provider").first()).toBeVisible();
  });
});

test.describe("Admin app — sections (English)", () => {
  test.skip(skipAdmin);

  test("Advertisement Scheduler section shows commercial break, groups, start/end date", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.ads_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.ads_commercial_break)).toBeVisible();
    await expect(page.getByText(EN.ads_groups)).toBeVisible();
    await expect(page.getByText(EN.ads_start_date)).toBeVisible();
    await expect(page.getByText(EN.ads_end_date)).toBeVisible();
  });

  test("Report Generator section shows generate report, export PDF, compliance", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.reports_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.reports_generate_report)).toBeVisible();
    await expect(page.getByText(EN.reports_export_pdf)).toBeVisible();
    await expect(page.getByText(EN.reports_compliance)).toBeVisible();
  });

  test("Provisioning workflow section describes tenant, station, D1, R2, widget defaults", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.provisioning_workflow_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Create tenant and station registry rows")).toBeVisible();
    await expect(page.getByText("Prepare D1 schema")).toBeVisible();
    await expect(page.getByText("Seed widget defaults")).toBeVisible();
  });

  test("Pilot gates section shows 14-day playout soak and validation items", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.pilot_gates_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("14-day playout soak")).toBeVisible();
  });

  test("Settings section shows Language, Save, Warning, Success", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.settings })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.language)).toBeVisible();
    await expect(page.getByText(EN.save)).toBeVisible();
  });

  test("Error section shows connection failed and save failed", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await expect(page.getByRole("heading", { name: EN.error })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(EN.errors_connection_failed)).toBeVisible();
    await expect(page.getByText(EN.errors_save_failed)).toBeVisible();
  });
});

test.describe("Admin app — Thai locale (lang=th)", () => {
  test.skip(skipAdmin);

  test("nav labels for Ads and Reports are Thai when lang=th", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=th");
    await expect(page.getByRole("link", { name: TH.ads_title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: TH.reports_title })).toBeVisible();
  });

  test("Advertisement Scheduler section heading and content Thai when lang=th", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=th");
    await expect(page.getByRole("heading", { name: TH.ads_title })).toBeVisible({ timeout: 15_000 });
  });

  test("Settings and Error section headings Thai when lang=th", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=th");
    await expect(page.getByRole("heading", { name: TH.common_settings })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: TH.common_error })).toBeVisible();
  });

  test("Error messages Thai when lang=th", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=th");
    await expect(page.getByText(TH.errors_connection_failed)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(TH.errors_save_failed)).toBeVisible();
  });
});

test.describe("Admin app — language switcher", () => {
  test.skip(skipAdmin);

  test("switching to Thai updates URL and content", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=en");
    await page.getByRole("link", { name: EN.language_thai }).click();
    await expect(page).toHaveURL(/\?lang=th/);
    await expect(page.getByText(TH.errors_connection_failed).first()).toBeVisible({ timeout: 10_000 });
  });

  test("switching to English updates URL and content", async ({ page }) => {
    await page.goto(ADMIN_BASE + "/?lang=th");
    await page.getByRole("link", { name: TH.language_english }).click();
    await expect(page).toHaveURL(/\?lang=en/);
    await expect(page.getByText(EN.ads_title)).toBeVisible({ timeout: 10_000 });
  });
});
