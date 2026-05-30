"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useTasks, useCategories, useDeleteTask } from "@/lib/fetchers";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Plus, Filter, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCardSkeleton } from "@/components/ui/TaskSkeleton";
import type { Task } from "@/types";

interface TaskListProps {
  compact?: boolean;
  date?: string;
  showFilters?: boolean;
}

const TaskCardMemo = memo(function TaskCardMemo({ task, onClick }: { task: Task; onClick: () => void }) {
  return <TaskCard task={task} onClick={onClick} />;
});

export default function TaskList({ compact, date, showFilters = true }: TaskListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(showFilters ? "all" : "TODO");
  const [priority, setPriority] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status !== "all") params.status = status;
    if (priority !== "all") params.priority = priority;
    if (category !== "all") params.categoryId = category;
    if (date) params.date = date;
    return params;
  }, [debouncedSearch, status, priority, category, date]);

  const { data: tasks, error, isLoading, mutate } = useTasks(queryParams);
  const { data: categories } = useCategories();
  const { trigger: deleteTask } = useDeleteTask();

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
    setDefaultDate(null);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingTask(null);
    setDefaultDate(date || null);
    setFormOpen(true);
  }, [date]);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
    setDefaultDate(null);
    mutate();
  }, [mutate]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteTask({ id });
    mutate();
  }, [deleteTask, mutate]);

  const activeFilters = [status !== "all", priority !== "all", category !== "all", !!debouncedSearch].filter(Boolean).length;

  return (
    <div>
      {showFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Görev ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/10 bg-white/5 pl-9 pr-8 text-white placeholder:text-zinc-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v || "all")}>
            <SelectTrigger className="w-32 border-white/10 bg-white/5 text-white">
              <Filter className="mr-1 h-3 w-3" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a1a25] text-white max-h-60">
              <SelectItem value="all">Tümü</SelectItem>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v || "all")}>
            <SelectTrigger className="w-32 border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Öncelik" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a1a25] text-white max-h-60">
              <SelectItem value="all">Tümü</SelectItem>
              {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(v) => setCategory(v || "all")}>
            <SelectTrigger className="w-36 border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a1a25] text-white max-h-60">
              <SelectItem value="all">Tümü</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} className="bg-blue-600 text-white hover:bg-blue-700 shrink-0">
            <Plus className="mr-1 h-4 w-4" /> Ekle
          </Button>
        </div>
      )}

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          Görevler yüklenirken hata oluştu
        </div>
      ) : isLoading && tasks === undefined ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <div className="mb-3 rounded-full bg-white/5 p-4">
            <Search className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-zinc-400">
            {activeFilters > 0 ? "Aramanızla eşleşen görev bulunamadı" : "Henüz görev bulunmuyor"}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {activeFilters > 0 ? "Filtreleri temizleyip tekrar deneyin" : "Yeni bir görev ekleyerek başlayın"}
          </p>
          {activeFilters > 0 ? (
            <Button variant="link" onClick={() => { setSearch(""); setStatus("all"); setPriority("all"); setCategory("all"); }} className="mt-3 text-blue-400">
              Filtreleri Temizle
            </Button>
          ) : (
            <Button onClick={handleAdd} className="mt-3 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-1 h-4 w-4" /> İlk Görevi Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className={compact ? "space-y-1" : "space-y-2"}>
          {tasks.map((task) => (
            <div key={task.id} className="group relative">
              <TaskCardMemo task={task} onClick={() => handleEdit(task)} />
              {!compact && (
                <button
                  onClick={() => handleDelete(task.id)}
                  className="absolute right-2 top-2 hidden rounded-md p-1.5 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition-colors group-hover:block"
                  title="Sil"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!showFilters && tasks && tasks.length > 0 && (
        <Button onClick={handleAdd} className="mt-3 w-full border border-dashed border-white/10 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
          <Plus className="mr-1 h-4 w-4" /> Görev Ekle
        </Button>
      )}

      <TaskForm
        open={formOpen}
        onClose={handleClose}
        task={editingTask}
        defaultDate={defaultDate}
      />
    </div>
  );
}
