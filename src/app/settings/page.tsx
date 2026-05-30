"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Webhook, Save } from "lucide-react";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");

  async function handleSave() {
    localStorage.setItem("webhookUrl", webhookUrl);

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    alert("Ayarlar kaydedildi!");
  }

  async function testNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Tunahan Task Manager", {
        body: "Bildirimler başarıyla çalışıyor!",
      });
    } else if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Tunahan Task Manager", {
          body: "Bildirim izni verildi!",
        });
      }
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <Bell className="h-4 w-4" />
            Tarayıcı Bildirimleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-500">
            Görev zamanı geldiğinde tarayıcı bildirimi almak için izin verin.
          </p>
          <Button
            onClick={testNotification}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10"
          >
            Bildirimleri Test Et
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <Webhook className="h-4 w-4" />
            Webhook URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-500">
            Görevler oluşturulduğunda veya tamamlandığında bildirim göndermek için bir webhook URL&apos;si girin.
          </p>
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.example.com/..."
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Ayarları Kaydet
        </Button>
      </div>
    </div>
  );
}
