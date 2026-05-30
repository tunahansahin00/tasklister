"use client";

import { memo } from "react";
import { useStats } from "@/lib/fetchers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartTooltip = {
  contentStyle: {
    backgroundColor: "#1a1a25",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
  },
};

const StatusCard = memo(function StatusCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center transition-colors hover:bg-white/10">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
});

export default function Charts() {
  const { data, error } = useStats();

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        İstatistikler yüklenirken hata oluştu
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-white/10 bg-white/5">
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-[280px] w-full" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const categoryData = data.categoryStats.filter((c) => c.count > 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-sm text-white">Kategori Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...ChartTooltip} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-zinc-500">
              Henüz veri yok
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name} ({cat.count})
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-sm text-white">Haftalık Oluşturulan Görevler</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.weeklyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 12, width: 30 }} />
              <Tooltip {...ChartTooltip} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-white">Genel İstatistikler</CardTitle>
          <span className="text-xs text-zinc-500">
            Toplam {data.totalTasks} görev • %{data.completionRate} tamamlanma oranı
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatusCard label="Bugünkü Görevler" value={data.todayTasks} />
            <StatusCard label="Tamamlanan" value={data.completedTasks} />
            <StatusCard label="Devam Eden" value={data.inProgressTasks} />
            <StatusCard label="Haftalık Tamamlanan" value={data.weeklyCompleted} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
