import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema, createCategorySchema } from "@/lib/validations";

describe("Zod Validations", () => {
  describe("createTaskSchema", () => {
    it("accepts valid input", () => {
      const result = createTaskSchema.safeParse({
        title: "Test Task",
        priority: "HIGH",
      });
      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Test Task");
      expect(result.data?.priority).toBe("HIGH");
    });

    it("rejects missing title", () => {
      const result = createTaskSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("rejects invalid priority", () => {
      const result = createTaskSchema.safeParse({
        title: "Test",
        priority: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("applies defaults", () => {
      const result = createTaskSchema.safeParse({ title: "Test" });
      expect(result.success).toBe(true);
      expect(result.data?.priority).toBe("MEDIUM");
      expect(result.data?.status).toBe("TODO");
      expect(result.data?.isRecurring).toBe(false);
    });
  });

  describe("updateTaskSchema", () => {
    it("accepts partial updates", () => {
      const result = updateTaskSchema.safeParse({ title: "Updated" });
      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Updated");
    });

    it("accepts empty object", () => {
      const result = updateTaskSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = updateTaskSchema.safeParse({ status: "ARCHIVED" });
      expect(result.success).toBe(false);
    });
  });

  describe("createCategorySchema", () => {
    it("accepts valid category", () => {
      const result = createCategorySchema.safeParse({ name: "Work" });
      expect(result.success).toBe(true);
    });

    it("rejects empty category name", () => {
      const result = createCategorySchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
    });
  });
});
