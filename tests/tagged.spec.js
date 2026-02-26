// tests/tagged.spec.js

const { test, expect } = require('@playwright/test');
// Regular import — these tests don't need custom fixtures

test.describe('Tagged Tests', () => {

  // @smoke = fast, critical path — run on every push
  test('homepage loads @smoke', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/');
    await expect(page).toHaveTitle(/Practice Test Automation/);
  });

  // @smoke = most important login test
  test('valid login works @smoke', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.fill('#username', 'student');
    await page.fill('#password', 'Password123');
    await page.click('#submit');
    await expect(page.locator('.post-title')).toHaveText('Logged In Successfully');
  });

  // @regression = thorough, run before releases
  test('invalid login shows error @regression', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    await page.click('#submit');
    await expect(page.locator('#error')).toBeVisible();
  });

  // @slow @regression = thorough but time-consuming
  test('full login and logout flow @slow @regression', async ({ page }) => {
    // Login
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.fill('#username', 'student');
    await page.fill('#password', 'Password123');
    await page.click('#submit');
    await expect(page.locator('.post-title')).toHaveText('Logged In Successfully');

    // Logout
    await page.click('.wp-block-button__link');
    await expect(page).toHaveURL(/practice-test-login/);
  });

  // @smoke @api = fast API check, critical path
  test('posts API returns data @api @smoke', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.id).toBe(1);
  });

});