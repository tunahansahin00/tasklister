import { describe, it, expect } from "vitest";
import { PRIORITY_LABELS, STATUS_LABELS, RECURRING_OPTIONS } from "@/lib/constants";

describe("Constants", () => {
  it("has all priority labels", () => {
    const keys = Object.keys(PRIORITY_LABELS);
    expect(keys).toHaveLength(4);
    expect(PRIORITY_LABELS.LOW).toBe("Düşük");
    expect(PRIORITY_LABELS.MEDIUM).toBe("Orta");
    expect(PRIORITY_LABELS.HIGH).toBe("Yüksek");
    expect(PRIORITY_LABELS.CRITICAL).toBe("Kritik");
  });

  it("has all status labels", () => {
    const keys = Object.keys(STATUS_LABELS);
    expect(keys).toHaveLength(3);
    expect(STATUS_LABELS.TODO).toBe("Yapılacak");
    expect(STATUS_LABELS.IN_PROGRESS).toBe("Devam Ediyor");
    expect(STATUS_LABELS.DONE).toBe("Tamamlandı");
  });

  it("has valid recurring options", () => {
    expect(RECURRING_OPTIONS).toHaveLength(4);
    expect(RECURRING_OPTIONS[0].value).toBe("none");
    expect(RECURRING_OPTIONS[1].value).toBe("daily");
    expect(RECURRING_OPTIONS[2].value).toBe("weekly");
    expect(RECURRING_OPTIONS[3].value).toBe("monthly");
  });
});
