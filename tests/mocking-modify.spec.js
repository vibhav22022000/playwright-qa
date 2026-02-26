const { test, expect } = require("@playwright/test");
const { assert } = require("node:console");

test.describe("Modifying Real API Responses", () => {
  //TEST 1: Modify a field in the real response

  test("Should modify the title of the first post", async ({ page }) => {
    await page.route("**/posts", async ({ route }) => {
      // Let the real request go through to JSONPlaceholder
      const realResponse = await route.fetch();
      console.log("Real response status:", realResponse.status());

      //Parse the real response body into a Javascript array
      const realData = await realResponse.json();
      console.log("Real first post title:", realData[0].title);

      //Modify the first post's title
      realData[0].title = "Vibhav modified this title";

      // Send modified data back - keep real headers but replace body
      await route.fulfill({
        response: realResponse,
        body: JSON.stringify(realData),
      });

      //Navigate to the page
      await page.goto("https://jsonplaceholder.typicode.com");

      // Fetch posts from inside the browser
      const posts = await page.evaluate(async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        return await res.json();
      });

      expect(post[0].title).toBe("Vibhav modified this title");
      expect(posts.length).toBe(100);
      console.log("Modified title:", post[0].title);
      console.log("Total posts still real", posts.length);
    });
  });

  // TEST2 - Test empty state - override with 0 items

  test("should handle empty list", async ({ page }) => {
    await page.route("**/posts", async (route) => {
      const realResponse = await route.fetch();

      const realData = await realResponse.json();
      console.log("Real posts count:", realData.length);

      const modifiedData = [];
      await route.fulfill({
        response: realResponse,
        body: JSON.stringify(modifiedData),
      });
    });

    await page.goto("https://jsonplaceholder.typicode.com");

    const posts = await page.evaluate(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return await res.json();
    });

    expect(posts.length).toBe(0);
    console.log("Posts count after modification: ", posts.length);
  });

  // TEST3 - Add a field that doesnt exist in real API

  test("Should ada a feature flag to posts", async ({ page }) => {
    await page.route("**/posts", async (route) => {
      const realResponse = await route.fetch();
      const realData = await realResponse.json();

      const modifiedData = realData.map((post) => ({
        ...post,
        featured: true,
      }));

      await route.fulfill({
        response: realResponse,
        body: JSON.stringify(modifiedData),
      });
    });

    await page.goto("https://jsonplaceholder.typicode.com");
    const posts = await page.evaluate(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return await res.json();
    });

    expect(posts[0].featured).toBe(true);
    expect(posts[99].featured).toBe(true);
    expect(posts[0].title).toBeTruthy();
    console.log("First post featured flag:", posts[0].featured);
    console.log("First post title still real:", posts[0].title);
  });

  // Test 4 - first 3 posts only

  test("Should return only first 3 posts", async ({ page }) => {
    await page.route("**/posts", async (route) => {
      const realResponse = await route.fetch();
      const realData = await realResponse.json();
      console.log("Real posts count:", realData.length);

      const modifiedData = realData.slice(0, 3);

      await route.fulfill({
        response: realResponse,
        body: JSON.stringify(modifiedData),
      });
    });

    await page.goto("https://jsonplaceholder.typicode.com");
    const posts = await page.evaluate(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return await res.json();
    });

    expect(posts.length).toBe(3);
    console.log(`Posts count after modification:${posts.length}`);
  });
});
