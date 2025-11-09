import { test, expect } from "@playwright/test";

test("user can upload media and open detail modal", async ({ page }) => {
  await page.goto("/");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: /browse files/i }).click();
  const fileChooser = await fileChooserPromise;
  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGAAAAAEAAEnNCcKAAAAAElFTkSuQmCC",
    "base64",
  );
  await fileChooser.setFiles({
    name: "demo.png",
    mimeType: "image/png",
    buffer: tinyPng,
  });

  await expect(page.getByTestId("uploader-status"))
    .toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("image-grid")).toBeVisible();
  await expect(page.getByTestId("image-card").first()).toBeVisible();
  await page.getByTestId("image-card").first().click();
  await expect(page.getByTestId("image-detail-modal")).toBeVisible();
});
