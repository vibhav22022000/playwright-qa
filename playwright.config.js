// playwright.config.js

const { defineConfig, devices } = require('@playwright/test');
// Use require() not import — your project uses CommonJS (package.json has no "type":"module")
// All your spec files use require() too — must stay consistent

module.exports = defineConfig({

  testDir: './tests',          // where test files live
  timeout: 30000,              // each test gets max 30 seconds
  retries: 1,                  // retry failed test once automatically
  reporter: 'html',            // 'reporter' not 'reporters' — common typo

  // Parallel execution settings
  workers: process.env.CI ? 2 : 4,
  // CI=2 workers (limited cloud CPU), local=4 workers (faster on your machine)
  // Python equivalent: pytest-xdist -n 4

  fullyParallel: false,
  // false = files run in parallel but tests WITHIN a file run sequentially
  // true = everything runs in parallel (can cause issues if tests share state)

  use: {
    // No baseURL here — your API tests use full URLs, this would conflict
    headless: !!process.env.CI,
    // !! converts string 'true' → boolean true
    // In CI (GitHub Actions): headless = true (no screen available)
    // Locally: headless = false (you SEE the browser — great for debugging)

    screenshot: 'only-on-failure',  // auto screenshot when test fails
    video: 'retain-on-failure',     // record video on failure
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on multiple browsers:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] }  },
  ],

});