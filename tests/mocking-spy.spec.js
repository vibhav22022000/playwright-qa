// tests/mocking-spy.spec.js
// Goal: spy on network requests without modifying them

const { test, expect } = require("@playwright/test");

test.describe("Spying on Network Requests", () => {
  // ─────────────────────────────────────────────
  // TEST 1: Verify a GET request was made to the right URL
  // ─────────────────────────────────────────────
  test("should verify GET request is made to /posts", async ({ page }) => {
    // STEP 1: Set up the spy BEFORE navigating
    // No await here — we're just setting up the "catcher", not waiting yet
    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().includes("/posts") && // URL must include /posts
        request.method() === "GET", // Must be a GET request
    );

    // STEP 2: Navigate — this triggers the request
    await page.goto("https://jsonplaceholder.typicode.com");

    // STEP 3: Trigger the actual fetch inside the page
    await page.evaluate(async () => {
      await fetch("https://jsonplaceholder.typicode.com/posts"); // This fires the request
    });

    // STEP 4: NOW await the promise — catches the request we just triggered
    const request = await requestPromise;

    // STEP 5: Inspect and assert on the request
    expect(request.url()).toContain("/posts"); // Correct URL was called
    expect(request.method()).toBe("GET"); // Correct HTTP method
    console.log("✅ Request URL:", request.url());
    console.log("✅ Request method:", request.method());
  });

  // ─────────────────────────────────────────────
  // TEST 2: Verify the response status and data
  // ─────────────────────────────────────────────
  test("should verify response from /posts is 200 with data", async ({
    page,
  }) => {
    // STEP 1: Set up the response spy BEFORE navigating
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/posts") && // URL must include /posts
        response.status() === 200, // Must be a 200 response
    );

    // STEP 2: Navigate to the page
    await page.goto("https://jsonplaceholder.typicode.com");

    // STEP 3: Trigger the fetch
    await page.evaluate(async () => {
      await fetch("https://jsonplaceholder.typicode.com/posts");
    });

    // STEP 4: Await the response promise
    const response = await responsePromise;

    // STEP 5: Inspect the response
    expect(response.status()).toBe(200); // Status is 200
    expect(response.ok()).toBe(true); // ok() is true for 200-299

    // Parse the response body and check it has data
    const body = await response.json(); // await response.json() — always await!
    expect(body.length).toBe(100); // Real API returns 100 posts
    console.log("✅ Response status:", response.status());
    console.log("✅ Total posts received:", body.length);
  });

  // ─────────────────────────────────────────────
  // TEST 3: Count how many API calls were made
  // ─────────────────────────────────────────────
  test("should track how many requests were made", async ({ page }) => {
    // STEP 1: Create an array to collect ALL matching requests
    const requestsMade = []; // Empty array — will fill as requests come in

    // STEP 2: page.on() listens to EVERY request — like a running log
    page.on("request", (request) => {
      // Every time ANY request is made, this callback fires
      if (request.url().includes("jsonplaceholder.typicode.com")) {
        requestsMade.push(request.url()); // Add URL to our log
        console.log("📡 Request captured:", request.url());
      }
    });

    // STEP 3: Navigate and make multiple API calls
    await page.goto("https://jsonplaceholder.typicode.com");

    await page.evaluate(async () => {
      // Make 3 separate API calls
      await fetch("https://jsonplaceholder.typicode.com/posts"); // Call 1
      await fetch("https://jsonplaceholder.typicode.com/posts/1"); // Call 2
      await fetch("https://jsonplaceholder.typicode.com/posts/2"); // Call 3
    });

    // STEP 4: Assert we captured the right number of requests
    // Filter only the 3 fetch calls we made (page load also makes requests)
    const fetchCalls = requestsMade.filter(
      (url) => url.includes("/posts"), // Only count /posts requests
    );

    expect(fetchCalls.length).toBe(3); // Exactly 3 calls were made
    console.log("✅ Total /posts requests made:", fetchCalls.length);
    console.log("✅ All captured URLs:", fetchCalls);
  });

  test("should assert that response status is 200 and response body has id = 1", async ({
    page,
  }) => {
    const responsePromise = page.waitForResponse((response) =>
      response.url().includes("/posts/1"),
    );

    await page.goto("https://jsonplaceholder.typicode.com/posts");
    await page.evaluate(async () => {
      await fetch("https://jsonplaceholder.typicode.com/posts/1");
    });

    const response = await responsePromise;

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.id).toBe(1);  

    console.log("Response Status:", response.status());
    console.log("Post id:", body.id);
  });
});
