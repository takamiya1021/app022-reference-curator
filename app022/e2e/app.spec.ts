import { test, expect } from "@playwright/test";

test("user can upload media and open detail modal", async ({ page }) => {
  await page.goto("/");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: /browse files/i }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: "demo.png",
    mimeType: "image/png",
    buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  });

  await expect(page.getByRole("img", { name: /demo.png/i })).toBeVisible();
  await page.getByRole("img", { name: /demo.png/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
