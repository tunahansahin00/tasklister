export const PRIORITY_LABELS = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  CRITICAL: "Kritik",
} as const;

export const PRIORITY_COLORS = {
  LOW: "bg-slate-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
} as const;

export const STATUS_LABELS = {
  TODO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
} as const;

export const STATUS_COLORS = {
  TODO: "bg-zinc-500",
  IN_PROGRESS: "bg-amber-500",
  DONE: "bg-emerald-500",
} as const;

export const RECURRING_OPTIONS = [
  { value: "none", label: "Tekrarlanmasın" },
  { value: "daily", label: "Her Gün" },
  { value: "weekly", label: "Her Hafta" },
  { value: "monthly", label: "Her Ay" },
] as const;
