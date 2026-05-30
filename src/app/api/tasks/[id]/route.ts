import { NextResponse } from "next/server";
import * as taskService from "@/services/taskService";
import * as webhookService from "@/services/webhookService";
import { updateTaskSchema } from "@/lib/validations";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;
    const task = await taskService.getTaskById(id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.date !== undefined) data.date = parsed.data.date ? new Date(parsed.data.date) : null;
    if (parsed.data.startTime !== undefined) data.startTime = parsed.data.startTime;
    if (parsed.data.endTime !== undefined) data.endTime = parsed.data.endTime;
    if (parsed.data.priority !== undefined) data.priority = parsed.data.priority;
    if (parsed.data.status !== undefined) data.status = parsed.data.status;
    if (parsed.data.estimatedMin !== undefined) data.estimatedMin = parsed.data.estimatedMin ? Number(parsed.data.estimatedMin) : null;
    if (parsed.data.isRecurring !== undefined) data.isRecurring = parsed.data.isRecurring;
    if (parsed.data.recurringRule !== undefined) data.recurringRule = parsed.data.recurringRule;
    if (parsed.data.categoryId !== undefined) data.categoryId = parsed.data.categoryId;

    const task = await taskService.updateTask(id, data);

    const wh = webhookService.getWebhookUrl();
    if (wh) {
      webhookService.sendWebhook(
        wh,
        webhookService.buildWebhookPayload(
          "task.updated",
          task.id,
          task.title,
          { status: task.status, priority: task.priority }
        )
      ).catch(() => {});
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;
    await taskService.deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
