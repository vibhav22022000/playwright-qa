// tests/api-plus-ui.spec.js

import { test, expect, request as playwrightRequest } from "@playwright/test";

test.describe("API + UI Combined Testing", () => {
  // SCENARIO: Use API to create data, then verify it exists in the UI
  // This is MUCH faster than creating data through the UI

  test("Verify API data appears correctly", async ({ page, request }) => {
    // ── STEP 1: Get data from API ──
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/1",
    );
    expect(response.status()).toBe(200);

    const post = await response.json();
    console.log("API returned post:", post.title);

    // ── STEP 2: Open browser and verify same data ──
    await page.goto("https://jsonplaceholder.typicode.com/posts/1");

    // The page shows raw JSON — verify title appears
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toContain(post.title);

    console.log("✅ API data matches what browser shows!");
  });

  test("API health check before UI test", async ({ request, page }) => {
    // ── STEP 1: Check API is healthy before even opening browser ──
    const healthCheck = await request.get(
      "https://jsonplaceholder.typicode.com/posts",
    );

    if (!healthCheck.ok()) {
      console.log("⚠️ API is down — skipping UI test");
      test.skip(); // skip test if API is down
      return;
    }

    console.log("✅ API is healthy, proceeding with UI test");

    // ── STEP 2: Now do UI test knowing API works ──
    await page.goto("https://playwright.dev");
    await expect(page).toHaveTitle(/Playwright/);
  });
});
