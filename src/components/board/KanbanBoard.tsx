"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useTasks } from "@/lib/fetchers";
import TaskForm from "@/components/tasks/TaskForm";
import { STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCardSkeleton } from "@/components/ui/TaskSkeleton";
import type { Task, Status } from "@/types";

const columns: Status[] = ["TODO", "IN_PROGRESS", "DONE"];

const columnConfig = {
  TODO: { label: STATUS_LABELS.TODO, color: "border-t-zinc-500", dot: "bg-zinc-500" },
  IN_PROGRESS: { label: STATUS_LABELS.IN_PROGRESS, color: "border-t-amber-500", dot: "bg-amber-500" },
  DONE: { label: STATUS_LABELS.DONE, color: "border-t-emerald-500", dot: "bg-emerald-500" },
};

const KanbanCard = memo(function KanbanCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
      onClick={() => onClick()}
      className="cursor-grab rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10 active:cursor-grabbing active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-white leading-snug">{task.title}</p>
      </div>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500 leading-relaxed">
          {task.description}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {task.category && (
          <span className="text-xs text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
            {task.category.icon} {task.category.name}
          </span>
        )}
        <span className={cn(
          "text-xs font-medium",
          task.priority === "CRITICAL" && "text-red-400",
          task.priority === "HIGH" && "text-orange-400",
          task.priority === "MEDIUM" && "text-blue-400",
          task.priority === "LOW" && "text-zinc-400",
        )}>
          ● {task.priority === "CRITICAL" ? "Kritik" : task.priority === "HIGH" ? "Yüksek" : task.priority === "MEDIUM" ? "Orta" : "Düşük"}
        </span>
      </div>
    </div>
  );
});

export default function KanbanBoard() {
  const { data: tasks, error, mutate } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedOverCol, setDraggedOverCol] = useState<Status | null>(null);

  const { columnsByStatus } = useMemo(() => {
    const map: Record<Status, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    if (tasks) {
      for (const t of tasks) {
        if (map[t.status]) map[t.status].push(t);
      }
    }
    return { columnsByStatus: map };
  }, [tasks]);

  const handleDragOver = useCallback((e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setDraggedOverCol(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOverCol(null);
  }, []);

  const handleDropOnColumn = useCallback(async (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  }, [mutate]);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        Board yüklenirken hata oluştu
      </div>
    );
  }

  if (!tasks) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <TaskCardSkeleton key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((status) => {
        const config = columnConfig[status];
        const columnTasks = columnsByStatus[status] || [];
        const isOver = draggedOverCol === status;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDropOnColumn(e, status)}
            className={cn(
              "flex flex-col rounded-lg border border-white/10 bg-white/5 border-t-2 transition-colors",
              config.color,
              isOver && "bg-white/10 ring-1 ring-blue-500/50"
            )}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-3">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", config.dot)} />
                <span className="text-sm font-semibold text-white">{config.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400 tabular-nums">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={handleAdd}
                className="rounded p-1 text-zinc-500 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2 p-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                  <p className="text-xs">Henüz görev yok</p>
                  <Button variant="link" onClick={handleAdd} className="text-blue-400 text-xs h-6">
                    Görev ekle
                  </Button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <KanbanCard key={task.id} task={task} onClick={() => handleEdit(task)} />
                ))
              )}
            </div>
          </div>
        );
      })}

      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTask(null); mutate(); }}
        task={editingTask}
      />
    </div>
  );
}
