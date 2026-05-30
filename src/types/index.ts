export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  priority: Priority;
  status: Status;
  estimatedMin: number | null;
  isRecurring: boolean;
  recurringRule: string | null;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
  subtasks: SubTask[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  _count?: { tasks: number };
}

export interface SubTask {
  id: string;
  title: string;
  isDone: boolean;
  taskId: string;
  order: number;
}

export type RecurringRule = "daily" | "weekly" | "monthly" | null;
