import { NextResponse } from "next/server";
import * as taskService from "@/services/taskService";
import { createSubTaskSchema } from "@/lib/validations";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createSubTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const subtask = await taskService.createSubTask(parsed.data);
    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error("POST /api/subtasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
