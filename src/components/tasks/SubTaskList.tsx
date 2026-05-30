"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { SubTask } from "@/types";

interface SubTaskListProps {
  subtasks: SubTask[];
  taskId: string;
  onChange: () => void;
}

export default function SubTaskList({ subtasks, taskId, onChange }: SubTaskListProps) {
  const [newTitle, setNewTitle] = useState("");

  async function handleToggle(sub: SubTask) {
    await fetch(`/api/subtasks/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDone: !sub.isDone }),
    });
    onChange();
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;
    await fetch(`/api/subtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, taskId, order: subtasks.length }),
    });
    setNewTitle("");
    onChange();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/subtasks/${id}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className="space-y-1">
      {subtasks.map((sub) => (
        <div
          key={sub.id}
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"
        >
          <GripVertical className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <Checkbox
              checked={sub.isDone}
              onCheckedChange={() => handleToggle(sub)}
              className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <span
              className={`text-sm ${
                sub.isDone
                  ? "text-zinc-500 line-through"
                  : "text-zinc-300"
              }`}
            >
              {sub.title}
            </span>
          </label>
          <button
            onClick={() => handleDelete(sub.id)}
            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 px-2 pt-1">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Alt görev ekle..."
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-8 border-0 bg-white/5 text-xs text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-blue-500"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAdd}
          className="h-8 text-zinc-400 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
