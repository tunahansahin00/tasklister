"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/tasks": "Görevler",
  "/calendar": "Takvim",
  "/board": "Kart Görünümü",
  "/stats": "İstatistikler",
  "/categories": "Kategoriler",
  "/settings": "Ayarlar",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Task Lister";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-6 backdrop-blur-xl">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">TTM v1.0</span>
      </div>
    </header>
  );
}
