const { test, expect } = require("@playwright/test");

test.describe("Mocking Error Responses", () => {
  // Test1: Mocking a 500 Server Error

  test("should handle 500 server error from API", async ({ page }) => {
    // Intercept the /posts endpoint and return a 500 error
    await page.route("**/posts", (route) => {
      console.log("Intercepting /posts request and returning 500 error");
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Something went wrong on the server.",
        }),
      });
    });

    // Navigate to the page that makes the API call
    await page.goto("https://jsonplaceholder.typicode.com/posts");

    //Make a fetch call inside the browser and capture the response status
    const statusCode = await page.evaluate(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return res.status;
    });

    // Assert that the status code is 500
    expect(statusCode).toBe(500);
    console.log("Received status code:", statusCode);
  });

  // Test2: Mocking a 404 Not Found Error

  test("should handle 404 not found error from API", async ({ page }) => {
    await page.route("**/posts/9999", (route) => {
      console.log("Intercepting /posts/9999 request and returning 404 error");
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Not Found",
          message: "The requested resource was not found.",
        }),
      });
    });
    await page.goto("https://jsonplaceholder.typicode.com/posts/9999");

    //Fetch the non-existent post and capture the response status
    const statusCode = await page.evaluate(async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts/9999",
      );
      const body = await res.json();
      //console.log("Received response body:", body);
      return { status: res.status, body: body };
    });

    // Assert that the status code is 404
    expect(statusCode.status).toBe(404);
    expect(statusCode.body).toEqual({
      error: "Not Found",
      message: "The requested resource was not found.",
    });
    console.log("Received status code:", statusCode.status);
    console.log("Received response body:", statusCode.body);
  });

  // Test3: Mocking a Network Error

  test("should handle network error when fetching data", async ({ page }) => {
    await page.route("**/posts", (route) => {
      console.log("Intercepting /posts request and simulating network error");
      route.abort("failed");
    });
    await page.goto("https://jsonplaceholder.typicode.com");
    //Fetch the posts and capture the error message
    const errorMessage = await page.evaluate(async () => {
      try {
        await fetch("https://jsonplaceholder.typicode.com/posts");
      } catch (error) {
        return error.message;
      }
    });
    // Assert that the error message indicates a network failure
    expect(errorMessage).not.toBeNull();
    console.log("Received error message:", errorMessage);
  });

  // Test4: Mocking a 401 Unauthorized Error

  test("should handle 401 unauthorized error from API", async ({ page }) => {
    await page.route("**/posts", async (route) => {
      console.log("Intercepting /posts request and returning 401 error");
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Unauthorized",
          message: "Please log in first",
        }),
      });
    });

    //Navigate to the page that makes API Call
    await page.goto("https://jsonplaceholder.typicode.com");

    const result = await page.evaluate(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const body = await res.json();
      return {
        status: res.status,
        body: body,
      };
    });

    expect(result.status).toBe(401);
    expect(result.body.message).toBe("Please log in first");
    console.log(`Got 401 with message: ${result.body.message}`);
  });
});
