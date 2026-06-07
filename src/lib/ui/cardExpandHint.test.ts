import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  dismissCardExpandHint,
  isCardExpandHintDismissed,
} from "@/lib/ui/cardExpandHint";

describe("cardExpandHint", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is not dismissed by default", () => {
    expect(isCardExpandHintDismissed("picks")).toBe(false);
  });

  it("persists dismissal per screen for the session", () => {
    dismissCardExpandHint("picks");
    expect(isCardExpandHintDismissed("picks")).toBe(true);
    expect(isCardExpandHintDismissed("events")).toBe(false);
  });
});
