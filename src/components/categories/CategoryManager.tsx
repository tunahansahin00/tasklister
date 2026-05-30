"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/lib/fetchers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types";

const presetColors = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#f97316", "#ec4899",
  "#22c55e", "#a855f7", "#6366f1", "#14b8a6",
];

const presetIcons = ["📋", "💼", "👤", "💪", "🛒", "🏃", "📖", "📁", "👨‍👩‍👧‍👦", "💰", "🤝", "🎯", "✍️", "📞", "🎨", "⚡"];

export default function CategoryManager() {
  const { data: categories, mutate } = useCategories();
  const { trigger: createCategory, isMutating: creating } = useCreateCategory();
  const { trigger: updateCategory, isMutating: updating } = useUpdateCategory();
  const { trigger: deleteCategory } = useDeleteCategory();

  const [name, setName] = useState("");
  const [color, setColor] = useState(presetColors[0]);
  const [icon, setIcon] = useState(presetIcons[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateCategory({ id: editingId, body: { name, color, icon } });
      } else {
        await createCategory({ body: { name, color, icon } });
      }
      setName("");
      setColor(presetColors[0]);
      setIcon(presetIcons[0]);
      setEditingId(null);
      mutate();
    } catch {
      // Error handled by SWR
    }
  }

  function handleEdit(cat: Category) {
    setName(cat.name);
    setColor(cat.color);
    setIcon(cat.icon);
    setEditingId(cat.id);
  }

  async function handleDelete(id: string) {
    await deleteCategory({ id });
    mutate();
  }

  function handleCancel() {
    setName("");
    setColor(presetColors[0]);
    setIcon(presetIcons[0]);
    setEditingId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-sm text-white">
            {editingId ? "Kategori Düzenle" : "Yeni Kategori"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Kategori Adı</Label>
              <Input
                id="catName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kategori adı..."
                required
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label>Renk</Label>
              <div className="flex flex-wrap gap-1.5">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full border-2 transition-all ${
                      color === c ? "border-white scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>İkon</Label>
              <div className="flex flex-wrap gap-1.5">
                {presetIcons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${
                      icon === ic
                        ? "bg-white/20 ring-1 ring-white"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={creating || updating}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                {editingId ? "Güncelle" : "Ekle"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-zinc-400"
                >
                  İptal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm text-white">Kategoriler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-zinc-500">
                      {cat._count?.tasks || 0} görev
                      {cat.isDefault && " • Varsayılan"}
                    </p>
                  </div>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(cat)}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {!cat.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cat.id)}
                      className="h-8 w-8 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
