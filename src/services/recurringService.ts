import { prisma } from "@/lib/prisma";

function getNextDate(currentDate: Date, rule: string): Date {
  const next = new Date(currentDate);
  next.setHours(0, 0, 0, 0);
  switch (rule) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      next.setDate(next.getDate() + 1);
  }
  return next;
}

export async function processRecurringTasks(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recurringTasks = await prisma.task.findMany({
    where: {
      isRecurring: true,
      recurringRule: { not: null },
    },
    include: { subtasks: true },
  });

  let created = 0;

  for (const task of recurringTasks) {
    if (!task.date || !task.recurringRule) continue;

    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    const nextDate = getNextDate(taskDate, task.recurringRule);

    if (nextDate.getTime() <= today.getTime()) {
      const existingTask = await prisma.task.findFirst({
        where: {
          title: task.title,
          date: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          },
        },
      });

      if (!existingTask) {
        await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            date: today,
            startTime: task.startTime,
            endTime: task.endTime,
            priority: task.priority,
            status: "TODO",
            estimatedMin: task.estimatedMin,
            isRecurring: true,
            recurringRule: task.recurringRule,
            categoryId: task.categoryId,
            subtasks: {
              create: task.subtasks.map((s) => ({
                title: s.title,
                order: s.order,
              })),
            },
          },
        });

        await prisma.task.update({
          where: { id: task.id },
          data: { date: today },
        });

        created++;
      }
    }
  }

  return created;
}
