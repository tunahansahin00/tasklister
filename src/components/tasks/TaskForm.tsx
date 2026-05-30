"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LABELS, RECURRING_OPTIONS } from "@/lib/constants";
import { useCategories, useCreateTask, useUpdateTask } from "@/lib/fetchers";
import SubTaskList from "./SubTaskList";
import type { Task, SubTask, Priority } from "@/types";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultDate?: string | null;
}

export default function TaskForm({ open, onClose, task, defaultDate }: TaskFormProps) {
  const initialTitle = task?.title || "";
  const initialDescription = task?.description || "";
  const initialDate = task?.date ? task.date.split("T")[0] : defaultDate || "";
  const initialStartTime = task?.startTime || "";
  const initialEndTime = task?.endTime || "";
  const initialPriority = task?.priority || ("MEDIUM" as Priority);
  const initialEstimatedMin = task?.estimatedMin?.toString() || "";
  const initialCategoryId = task?.categoryId || "";
  const initialRecurring = task?.recurringRule || "none";
  const initialSubtasks = task?.subtasks || [];

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [estimatedMin, setEstimatedMin] = useState(initialEstimatedMin);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [isRecurring, setIsRecurring] = useState(initialRecurring);
  const [subtasks, setSubtasks] = useState<SubTask[]>(initialSubtasks);

  const { data: categories } = useCategories();
  const { trigger: createTask, isMutating: creating } = useCreateTask();
  const { trigger: updateTask, isMutating: updating } = useUpdateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      title,
      description: description || null,
      date: date || null,
      startTime: startTime || null,
      endTime: endTime || null,
      priority,
      estimatedMin: estimatedMin || null,
      categoryId: categoryId || null,
      isRecurring: isRecurring !== "none",
      recurringRule: isRecurring !== "none" ? isRecurring : null,
    };

    try {
      if (task) {
        await updateTask({ id: task.id, body });
      } else {
        await createTask({ body });
      }
      onClose();
    } catch {
      // Error handled by SWR
    }
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onClose} key={task?.id ?? "new"}>
      <DialogContent className="border-white/10 bg-[#12121a] text-white sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {task ? "Görevi Düzenle" : "Yeni Görev"}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full border border-white/10 bg-white/5">
            <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-blue-600">Detaylar</TabsTrigger>
            <TabsTrigger value="subtasks" className="flex-1 data-[state=active]:bg-blue-600">
              Alt Görevler {subtasks.length > 0 && `(${subtasks.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Görev başlığı..."
                  required
                  className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Açıklama</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Açıklama ekleyin..."
                  rows={3}
                  className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tarih</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Öncelik</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#1a1a25] text-white">
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Başlangıç</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Bitiş</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="est">Tahmini Süre (dk)</Label>
                  <Input
                    id="est"
                    type="number"
                    value={estimatedMin}
                    onChange={(e) => setEstimatedMin(e.target.value)}
                    placeholder="30"
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurring">Tekrar</Label>
                  <Select value={isRecurring} onValueChange={(v) => setIsRecurring(v || "none")}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#1a1a25] text-white">
                      {RECURRING_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v || "none")}>
                  <SelectTrigger className="border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#1a1a25] text-white">
                    <SelectItem value="none">Kategorisiz</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                  İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 min-w-[100px]">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Kaydediliyor
                    </span>
                  ) : (
                    task ? "Güncelle" : "Oluştur"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="subtasks" className="mt-4">
            {task ? (
              <SubTaskList subtasks={subtasks} taskId={task.id} onChange={() => {
                fetch(`/api/tasks/${task.id}`)
                  .then((r) => r.json())
                  .then((t) => setSubtasks(t.subtasks || []));
              }} />
            ) : (
              <div className="flex flex-col items-center py-8 text-zinc-500">
                <p className="text-sm">Önce görevi kaydedin, ardından alt görev ekleyebilirsiniz.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
