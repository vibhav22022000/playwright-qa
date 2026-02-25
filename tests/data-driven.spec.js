// tests/data-driven.spec.js

const { test, expect } = require("@playwright/test");

test.describe("Data-Driven Login Tests", () => {
  const loginCases = [
    {
      description: "valid credentials",
      username: "student",
      password: "Password123",
      expectSuccess: true,
    },
    {
      description: "invalid username",
      username: "wronguser",
      password: "Password123",
      expectSuccess: false,
    },
    {
      description: "invalid password",
      username: "student",
      password: "wrongpassword",
      expectSuccess: false,
    },
  ];

  // Loop through test cases and create individual tests
  loginCases.forEach(({ description, username, password, expectSuccess }) => {
    test(`Login: ${description}`, async ({ page }) => {
      await page.goto(
        "https://practicetestautomation.com/practice-test-login/",
      );

      await page.fill("#username", username);
      await page.fill("#password", password);
      await page.click("#submit");

      if (expectSuccess) {
        await expect(page.locator(".post-title")).toHaveText(
          "Logged In Successfully",
        );
      } else {
        await expect(page.locator("#error")).toBeVisible();
      }
    });
  });
});
