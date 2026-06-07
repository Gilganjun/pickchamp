import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_EVENT_CARD_STYLE,
  cycleEventCardStyle,
  getStoredEventCardStyle,
  setStoredEventCardStyle,
} from "@/lib/ui/eventCardStyle";

describe("eventCardStyle", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });
    vi.stubGlobal("document", {
      documentElement: {
        setAttribute: vi.fn(),
        getAttribute: vi.fn(() => storage.get("pickfist-event-card-style") ?? null),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defaults to enhanced when storage is empty", () => {
    expect(getStoredEventCardStyle()).toBe(DEFAULT_EVENT_CARD_STYLE);
    expect(DEFAULT_EVENT_CARD_STYLE).toBe("enhanced");
  });

  it("persists classic in localStorage", () => {
    setStoredEventCardStyle("classic");
    expect(getStoredEventCardStyle()).toBe("classic");
  });

  it("cycles classic -> enhanced -> classic", () => {
    setStoredEventCardStyle("classic");
    expect(cycleEventCardStyle()).toBe("enhanced");
    expect(cycleEventCardStyle()).toBe("classic");
  });
});
