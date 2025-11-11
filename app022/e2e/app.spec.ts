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

test("user can upload and start slideshow", async ({ page }) => {
  await page.goto("/");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: /browse files/i }).click();
  const fileChooser = await fileChooserPromise;
  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGAAAAAEAAEnNCcKAAAAAElFTkSuQmCC",
    "base64",
  );
  await fileChooser.setFiles({
    name: "slide.png",
    mimeType: "image/png",
    buffer: tinyPng,
  });

  await expect(page.getByTestId("uploader-status")).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: /start slideshow/i }).click();
  await expect(page.getByRole("dialog", { name: /moodboard slideshow/i })).toBeVisible();
  await page.getByRole("button", { name: /close slideshow/i }).click();
});

test("user can filter images by default tag", async ({ page }) => {
  await page.goto("/");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: /browse files/i }).click();
  const fileChooser = await fileChooserPromise;
  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGAAAAAEAAEnNCcKAAAAAElFTkSuQmCC",
    "base64",
  );
  await fileChooser.setFiles({
    name: "tagged.png",
    mimeType: "image/png",
    buffer: tinyPng,
  });

  await expect(page.getByTestId("uploader-status")).toBeVisible({ timeout: 10_000 });
  await page.getByLabel(/untagged/i).check();
  await expect(page.getByTestId("image-card").first()).toBeVisible();
});

test("user can fetch AI tag suggestions", async ({ page }) => {
  await page.route("https://generativelanguage.googleapis.com/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({ tags: ["aurora"], description: "" }),
                },
              ],
            },
          },
        ],
      }),
    });
  });

  await page.goto("/");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: /browse files/i }).click();
  const fileChooser = await fileChooserPromise;
  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGAAAAAEAAEnNCcKAAAAAElFTkSuQmCC",
    "base64",
  );
  await fileChooser.setFiles({
    name: "ai.png",
    mimeType: "image/png",
    buffer: tinyPng,
  });

  await expect(page.getByTestId("uploader-status")).toBeVisible({ timeout: 10_000 });
  await page.getByTestId("image-card").first().click();
  await page.getByRole("button", { name: /AIタグを取得/i }).click();
  await expect(page.getByRole("button", { name: /"aurora" を追加/i })).toBeVisible();
});
