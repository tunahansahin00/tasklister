"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskList from "@/components/tasks/TaskList";

const TodayTasks = memo(function TodayTasks() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-white">Bugünkü Görevler</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskList compact showFilters={false} date={today} />
      </CardContent>
    </Card>
  );
});

export default TodayTasks;
