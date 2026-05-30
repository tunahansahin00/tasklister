"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { useTasks } from "@/lib/fetchers";
import { CalendarSkeleton } from "@/components/ui/TaskSkeleton";
import TaskForm from "@/components/tasks/TaskForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@/types";

const DayNames = memo(function DayNames() {
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  return (
    <div className="grid grid-cols-7 border-b border-white/10">
      {days.map((d) => (
        <div key={d} className="p-2 text-center text-xs font-medium text-zinc-500">
          {d}
        </div>
      ))}
    </div>
  );
});

const DayCell = memo(function DayCell({
  day,
  dateStr,
  isToday,
  isCurrentMonth,
  tasks,
  onDayClick,
  onTaskClick,
}: {
  day: number;
  dateStr: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  tasks: Task[];
  onDayClick: (date: string) => void;
  onTaskClick: (e: React.MouseEvent, task: Task) => void;
}) {
  return (
    <div
      onClick={() => onDayClick(dateStr)}
      className={`min-h-[90px] cursor-pointer border-r border-b border-white/5 p-1 transition-colors hover:bg-white/5 ${
        isToday ? "bg-blue-500/10" : ""
      } ${!isCurrentMonth ? "opacity-30" : ""}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
          isToday
            ? "bg-blue-600 text-white font-semibold"
            : "text-zinc-400"
        }`}
      >
        {day}
      </span>
      <div className="mt-0.5 space-y-0.5">
        {tasks.slice(0, 2).map((task) => (
          <div
            key={task.id}
            onClick={(e) => onTaskClick(e, task)}
            className={`truncate rounded px-1 py-0.5 text-[10px] leading-tight cursor-pointer transition-colors hover:opacity-80 ${
              task.status === "DONE"
                ? "bg-emerald-500/20 text-emerald-400 line-through"
                : task.priority === "HIGH" || task.priority === "CRITICAL"
                ? "bg-red-500/20 text-red-300"
                : "bg-blue-500/15 text-blue-300"
            }`}
          >
            {task.title}
          </div>
        ))}
        {tasks.length > 2 && (
          <div className="text-[10px] text-zinc-500 font-medium pl-1">
            +{tasks.length - 2} daha
          </div>
        )}
      </div>
    </div>
  );
});

export default function CalendarView() {
  const { data: tasks, error, mutate } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { year, month } = useMemo(() => ({
    year: currentMonth.getFullYear(),
    month: currentMonth.getMonth(),
  }), [currentMonth]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const today = new Date().toISOString().split("T")[0];

    const cells: { day: number; dateStr: string; isToday: boolean; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isToday: false, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, dateStr, isToday: dateStr === today, isCurrentMonth: true });
    }

    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = month + 2 > 12 ? 1 : month + 2;
      const nextYear = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, dateStr, isToday: false, isCurrentMonth: false });
    }

    return cells;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    if (!tasks) return new Map<string, Task[]>();
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      if (task.date) {
        const dateKey = task.date.split("T")[0];
        const existing = map.get(dateKey) || [];
        existing.push(task);
        map.set(dateKey, existing);
      }
    }
    return map;
  }, [tasks]);

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(year, month - 1, 1));
  }, [year, month]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(year, month + 1, 1));
  }, [year, month]);

  const handleDayClick = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const handleTaskClick = useCallback((e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setSelectedDate(null);
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
    setSelectedDate(null);
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        Takvim yüklenirken hata oluştu
      </div>
    );
  }

  if (!tasks) return <CalendarSkeleton />;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <button
          onClick={handlePrevMonth}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DayNames />

      <div className="grid grid-cols-7">
        {calendarDays.map((cell, i) => (
          <DayCell
            key={`${cell.dateStr}-${i}`}
            {...cell}
            tasks={tasksByDate.get(cell.dateStr) || []}
            onDayClick={handleDayClick}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      <TaskForm
        open={formOpen}
        onClose={() => { handleClose(); mutate(); }}
        task={editingTask}
        defaultDate={selectedDate}
      />
    </div>
  );
}
