"use client";

import { useStats } from "@/lib/fetchers";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCardSkeleton } from "@/components/ui/TaskSkeleton";
import { ListTodo, CheckCircle2, Timer, TrendingUp } from "lucide-react";

const statCards = [
  { label: "Toplam Görev", key: "totalTasks" as const, icon: ListTodo, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Tamamlanan", key: "completedTasks" as const, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Devam Eden", key: "inProgressTasks" as const, icon: Timer, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Tamamlanma Oranı", key: "completionRate" as const, icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10", suffix: "%" },
];

export default function StatsCards() {
  const { data: stats, error } = useStats();

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        İstatistikler yüklenirken hata oluştu
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const displayValue = typeof value === "number" ? (card.suffix ? `${value}${card.suffix}` : value) : value;
        return (
          <Card key={card.label} className="border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:scale-[1.02]">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2.5 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-white tabular-nums">{displayValue}</p>
                <p className="text-xs text-zinc-500 truncate">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
