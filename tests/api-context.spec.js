// tests/api-context.spec.js

import { test, expect, request as playwrightRequest } from "@playwright/test";

// Create a shared API context — like a configured Axios/requests session in Python
test.describe("Using API Context", () => {
  let apiContext;

  // Create the context once before all tests
  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: "https://jsonplaceholder.typicode.com",
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Authorization': 'Bearer your-token-here'  ← for real apps
      },
    });
  });

  // Clean up after all tests
  test.afterAll(async () => {
    await apiContext.dispose(); // release resources
  });

  test("GET post using context", async () => {
    // Now just use the path — baseURL is already set
    const response = await apiContext.get("/posts/1");

    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.id).toBe(1);
  });

  test("POST using context", async () => {
    const response = await apiContext.post("/posts", {
      data: { title: "Context Test", body: "Testing", userId: 1 },
    });

    expect(response.status()).toBe(201);
  });

  test("Check response headers", async () => {
    const response = await apiContext.get("/posts/1");

    const headers = response.headers();
    console.log("Content-Type:", headers["content-type"]);

    // API should return JSON
    expect(headers["content-type"]).toContain("application/json");
  });
});
