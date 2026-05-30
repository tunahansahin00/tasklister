const rateMap = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS = 100;
const WINDOW_MS = 60_000;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap) {
    if (now > entry.resetTime) {
      rateMap.delete(key);
    }
  }
}, 60_000).unref();
