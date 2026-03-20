import { expect, test } from "@playwright/test";

test("provisions a tenant and station from the FM page", async ({ page }) => {
  await page.goto("/fm");

  await page.getByLabel("Email").fill("owner@theurbanradio.local");
  await page.getByLabel("Password").fill("demo1234");
  await page.getByRole("button", { name: "Create Account" }).click();

  await page.getByLabel("Tenant Name").fill("Urban E2E Tenant");
  await page.getByLabel("Station Name").fill("Urban E2E FM");
  await page.getByRole("button", { name: "Provision Station" }).click();

  await expect(page.getByText("Urban E2E FM")).toBeVisible();
  await expect(page.getByText("urban-e2e-fm")).toBeVisible();
});
