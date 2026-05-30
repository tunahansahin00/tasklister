import { z } from "zod";

const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const statusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
const recurringRuleEnum = z.enum(["daily", "weekly", "monthly"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  priority: priorityEnum.default("MEDIUM"),
  status: statusEnum.default("TODO"),
  estimatedMin: z.number().nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurringRule: recurringRuleEnum.nullable().optional(),
  categoryId: z.string().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  estimatedMin: z.number().nullable().optional(),
  isRecurring: z.boolean().optional(),
  recurringRule: recurringRuleEnum.nullable().optional(),
  categoryId: z.string().nullable().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Kategori adı zorunludur"),
  color: z.string().default("#3b82f6"),
  icon: z.string().default("📋"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const createSubTaskSchema = z.object({
  title: z.string().min(1, "Alt görev adı zorunludur"),
  taskId: z.string().min(1),
  order: z.number().default(0),
});

export const updateSubTaskSchema = z.object({
  title: z.string().min(1).optional(),
  isDone: z.boolean().optional(),
  order: z.number().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateSubTaskInput = z.infer<typeof createSubTaskSchema>;
export type UpdateSubTaskInput = z.infer<typeof updateSubTaskSchema>;
