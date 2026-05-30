interface WebhookPayload {
  event: string;
  taskId: string;
  taskTitle: string;
  status?: string;
  priority?: string;
  timestamp: string;
}

const WEBHOOK_URL_KEY = "tasklister_webhook_url";

export function getWebhookUrl(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WEBHOOK_URL_KEY);
}

export function saveWebhookUrl(url: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WEBHOOK_URL_KEY, url);
}

export async function sendWebhook(
  webhookUrl: string,
  payload: WebhookPayload
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function buildWebhookPayload(
  event: string,
  taskId: string,
  taskTitle: string,
  extra?: { status?: string; priority?: string }
): WebhookPayload {
  return {
    event,
    taskId,
    taskTitle,
    status: extra?.status,
    priority: extra?.priority,
    timestamp: new Date().toISOString(),
  };
}
