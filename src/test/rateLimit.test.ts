import { describe, it, expect } from "vitest";
import { isRateLimited } from "@/lib/rate-limit";

describe("Rate Limiter", () => {
  it("allows first request", () => {
    const result = isRateLimited("test-ip-1");
    expect(result).toBe(false);
  });

  it("allows requests within limit", () => {
    for (let i = 0; i < 50; i++) {
      expect(isRateLimited(`test-ip-${i}`)).toBe(false);
    }
  });

  it("blocks after exceeding limit on same key", () => {
    const key = "test-ip-overlimit";
    for (let i = 0; i < 100; i++) {
      isRateLimited(key);
    }
    expect(isRateLimited(key)).toBe(true);
  });
});
