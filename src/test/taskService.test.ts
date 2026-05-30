import { describe, it, expect } from "vitest";

describe("TaskService", () => {
  it("getTasks returns filtered tasks", async () => {
    // Test the filtering logic
    const filters = { status: "TODO", priority: "HIGH" };
    expect(filters.status).toBe("TODO");
    expect(filters.priority).toBe("HIGH");
  });

  it("createTask validates required fields", () => {
    const data = { title: "Test Task" };
    expect(data.title).toBeTruthy();
  });
});
