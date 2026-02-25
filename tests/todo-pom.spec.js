// tests/todo-pom.spec.js ← now use the page object

import { test, expect } from "@playwright/test";
import { TodoPage } from "../pages/TodoPage.js";

test.describe("Todo App — Using Page Object Model", () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page); // create page object
    await todoPage.goto(); // navigate
  });

  test("Add multiple todos", async () => {
    await todoPage.addTodo("Buy groceries");
    await todoPage.addTodo("Write tests");
    await todoPage.addTodo("Review PR");

    await expect(todoPage.todoItems).toHaveCount(3);
  });

  test("Complete a todo", async () => {
    await todoPage.addTodo("Task to complete");
    await todoPage.completeTodo(0); // complete first item

    await expect(todoPage.todoItems.first()).toHaveClass(/completed/);
  });

  test("Delete a todo", async () => {
    await todoPage.addTodo("Task to delete");
    await todoPage.deleteTodo(0);

    await expect(todoPage.todoItems).toHaveCount(0);
  });
});
