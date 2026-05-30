"use client";

import StatsCards from "@/components/dashboard/StatsCards";
import TodayTasks from "@/components/dashboard/TodayTasks";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <TodayTasks />
    </div>
  );
}
