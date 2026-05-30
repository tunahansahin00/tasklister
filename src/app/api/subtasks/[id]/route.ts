import { NextResponse } from "next/server";
import * as taskService from "@/services/taskService";
import { updateSubTaskSchema } from "@/lib/validations";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";

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

    const parsed = updateSubTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.isDone !== undefined) data.isDone = parsed.data.isDone;
    if (parsed.data.order !== undefined) data.order = parsed.data.order;

    const subtask = await taskService.updateSubTask(id, data);
    return NextResponse.json(subtask);
  } catch (error) {
    console.error("PATCH /api/subtasks/[id] error:", error);
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
    await taskService.deleteSubTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/subtasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
