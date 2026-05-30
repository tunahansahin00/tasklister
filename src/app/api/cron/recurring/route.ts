import { NextResponse } from "next/server";
import { processRecurringTasks } from "@/services/recurringService";

export async function GET() {
  try {
    const created = await processRecurringTasks();
    return NextResponse.json({ success: true, created });
  } catch (error) {
    console.error("Cron /api/cron/recurring error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
