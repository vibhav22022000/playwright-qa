// pages/PostsPage.js
// A Page Object Model that includes mocking capabilities

class PostsPage {

    constructor(page) {
        this.page = page; // Store the Playwright page object for use in all methods
        this.url = 'https://jsonplaceholder.typicode.com'; // Base URL stored once
    }

    // ─────────────────────────────────────────────
    // NAVIGATION
    // ─────────────────────────────────────────────

    async goto() {
        await this.page.goto(this.url); // Navigate to the base URL
    }

    // ─────────────────────────────────────────────
    // MOCK METHODS — each one sets up a different scenario
    // ─────────────────────────────────────────────

    // Mock 1: Return empty posts list
    async mockEmptyPosts() {
        await this.page.route('**/posts', async (route) => {
            const realResponse = await route.fetch();  // Get real response
            await route.fulfill({
                response: realResponse,                // Keep real headers
                body: JSON.stringify([])               // Return empty array
            });
        });
    }

    // Mock 2: Return only first N posts
    async mockLimitedPosts(limit) {
        // limit = how many posts to return — passed in as a parameter
        await this.page.route('**/posts', async (route) => {
            const realResponse = await route.fetch();
            const realData = await realResponse.json();       // Get all real posts
            const limitedData = realData.slice(0, limit);     // Take only 'limit' posts
            await route.fulfill({
                response: realResponse,
                body: JSON.stringify(limitedData)             // Return limited posts
            });
        });
    }

    // Mock 3: Simulate server error
    async mockServerError() {
        await this.page.route('**/posts', async (route) => {
            await route.fulfill({
                status: 500,                                  // Server error status
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Internal Server Error',
                    message: 'Something went wrong'
                })
            });
        });
    }

    // Mock 4: Simulate unauthorized error
    async mockUnauthorized() {
        await this.page.route('**/posts', async (route) => {
            await route.fulfill({
                status: 401,                                  // Unauthorized status
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Unauthorized',
                    message: 'Please log in first'
                })
            });
        });
    }

    // ─────────────────────────────────────────────
    // ACTION METHODS — fetch posts from inside browser
    // ─────────────────────────────────────────────

    async fetchPosts() {
        // Runs fetch inside the browser and returns the result
        return await this.page.evaluate(async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            return await res.json(); // Return parsed JSON
        });
    }

    async fetchPostsWithStatus() {
        // Returns both status code AND body — useful for error testing
        return await this.page.evaluate(async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            const body = await res.json();
            return {
                status: res.status, // Capture status code
                body: body          // Capture response body
            };
        });
    }
}

module.exports = PostsPage; // Export the class — CommonJS style