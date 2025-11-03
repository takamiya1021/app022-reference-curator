import { test, expect } from "@playwright/test";

test("home page shows Reference Curator headline", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1, name: /reference curator/i });
  await expect(heading).toBeVisible();
});
