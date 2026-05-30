import { NextResponse } from "next/server";
import * as taskService from "@/services/taskService";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const stats = await taskService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
