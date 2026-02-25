// pages/TodoPage.js  ← create a "pages" folder first

export class TodoPage {

    constructor(page) {
        this.page = page;

        // Define all locators HERE in one place
        // If the page changes, you only update ONE file
        this.input       = page.getByPlaceholder('What needs to be done?');
        this.todoItems   = page.locator('.todo-list li');
        this.itemCount   = page.locator('.todo-count');
    }

    // ── Page Actions as Methods ──

    async goto() {
        await this.page.goto('https://demo.playwright.dev/todomvc');
    }

    async addTodo(text) {
        await this.input.fill(text);
        await this.input.press('Enter');
    }

    async completeTodo(index) {
        await this.todoItems.nth(index).locator('.toggle').click();
    }

    async deleteTodo(index) {
        // hover first to reveal delete button
        await this.todoItems.nth(index).hover();
        await this.todoItems.nth(index).locator('.destroy').click();
    }

    async getItemCount() {
        const text = await this.itemCount.textContent();
        return parseInt(text);  // "2 items left" → 2
    }
}