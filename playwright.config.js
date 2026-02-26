// playwright.config.js — replace everything with this clean version

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", // where your test files live

  timeout: 30000, // each test gets max 30 seconds
  retries: 1, // retry failed test once automatically
  reporters: "html", // generate an HTML report after tests run
  use: {
    baseURL: "https://demo.playwright.dev", // base URL for all tests
    headless: true, // false = you SEE the browser (great for learning!)
    screenshot: "only-on-failure", // auto screenshot when test fails
    video: "retain-on-failure", // record video on failure
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // comment these out for now to run faster:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] }  },
  ],
});
