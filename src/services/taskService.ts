import { prisma } from "@/lib/prisma";
import type { Priority, Status } from "@/types";

interface TaskFilters {
  status?: string;
  priority?: string;
  categoryId?: string;
  date?: string;
  search?: string;
}

export async function getTasks(filters: TaskFilters) {
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.date) {
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.task.findMany({
    where,
    include: { category: true, subtasks: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: { category: true, subtasks: { orderBy: { order: "asc" } } },
  });
}

export async function createTask(data: {
  title: string;
  description?: string | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  priority?: string;
  status?: string;
  estimatedMin?: number | null;
  isRecurring?: boolean;
  recurringRule?: string | null;
  categoryId?: string | null;
}) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      date: data.date ? new Date(data.date) : null,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      priority: (data.priority as Priority) || "MEDIUM",
      status: (data.status as Status) || "TODO",
      estimatedMin: data.estimatedMin ? Number(data.estimatedMin) : null,
      isRecurring: data.isRecurring || false,
      recurringRule: data.recurringRule || null,
      categoryId: data.categoryId || null,
    },
    include: { category: true, subtasks: { orderBy: { order: "asc" } } },
  });
}

export async function updateTask(id: string, data: Record<string, unknown>) {
  return prisma.task.update({
    where: { id },
    data,
    include: { category: true, subtasks: { orderBy: { order: "asc" } } },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createCategory(data: { name: string; color?: string; icon?: string }) {
  return prisma.category.create({
    data: {
      name: data.name,
      color: data.color || "#3b82f6",
      icon: data.icon || "📋",
    },
    include: { _count: { select: { tasks: true } } },
  });
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  return prisma.category.update({
    where: { id },
    data,
    include: { _count: { select: { tasks: true } } },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

export async function createSubTask(data: { title: string; taskId: string; order?: number }) {
  return prisma.subTask.create({
    data: {
      title: data.title,
      taskId: data.taskId,
      order: data.order ?? 0,
    },
  });
}

export async function updateSubTask(id: string, data: Record<string, unknown>) {
  return prisma.subTask.update({ where: { id }, data });
}

export async function deleteSubTask(id: string) {
  return prisma.subTask.delete({ where: { id } });
}

export async function getStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const [
    totalTasks,
    todayTasks,
    completedTasks,
    weeklyCompleted,
    categoryStats,
    weeklyData,
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({
      where: { date: { gte: todayStart, lt: todayEnd } },
    }),
    prisma.task.count({ where: { status: "DONE" } }),
    prisma.task.count({
      where: { status: "DONE", updatedAt: { gte: weekStart } },
    }),
    prisma.category.findMany({
      include: { _count: { select: { tasks: true } } },
    }),
    Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        return prisma.task.count({
          where: {
            createdAt: { gte: day, lt: nextDay },
          },
        });
      })
    ),
  ]);

  const inProgressTasks = await prisma.task.count({
    where: { status: "IN_PROGRESS" },
  });

  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  return {
    totalTasks,
    todayTasks,
    completedTasks,
    weeklyCompleted,
    inProgressTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    categoryStats: categoryStats.map((c) => ({
      name: c.name,
      color: c.color,
      count: c._count.tasks,
    })),
    weeklyChart: dayNames.map((name, i) => ({
      day: name,
      count: weeklyData[i],
    })),
  };
}
