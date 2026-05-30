"use client";

import { cn } from "@/lib/utils";
import { PRIORITY_COLORS, STATUS_LABELS } from "@/lib/constants";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import type { Task } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  compact?: boolean;
}

export default function TaskCard({ task, onClick, compact }: TaskCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority];
  const isOverdue =
    task.date &&
    new Date(task.date) < new Date(new Date().toDateString()) &&
    task.status !== "DONE";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10",
        isOverdue && "border-red-500/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {task.status === "DONE" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-zinc-500" />
            )}
            <h3
              className={cn(
                "truncate text-sm font-medium text-white",
                task.status === "DONE" && "text-zinc-500 line-through"
              )}
            >
              {task.title}
            </h3>
          </div>
          {!compact && task.description && (
            <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">
              {task.description}
            </p>
          )}
          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className={cn("h-1.5 w-1.5 rounded-full", priorityColor)} />
              <span className="text-xs capitalize text-zinc-500">
                {task.priority === "CRITICAL" ? "Kritik" :
                 task.priority === "HIGH" ? "Yüksek" :
                 task.priority === "MEDIUM" ? "Orta" : "Düşük"}
              </span>
              {task.category && (
                <Badge
                  variant="secondary"
                  className="border-0 bg-white/5 text-xs text-zinc-400"
                >
                  {task.category.icon} {task.category.name}
                </Badge>
              )}
              {task.estimatedMin && (
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  {task.estimatedMin}dk
                </span>
              )}
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  Gecikmiş
                </span>
              )}
            </div>
          )}
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 border-0 text-xs",
            task.status === "TODO" && "bg-zinc-500/20 text-zinc-400",
            task.status === "IN_PROGRESS" && "bg-amber-500/20 text-amber-400",
            task.status === "DONE" && "bg-emerald-500/20 text-emerald-400"
          )}
        >
          {STATUS_LABELS[task.status]}
        </Badge>
      </div>
    </div>
  );
}
