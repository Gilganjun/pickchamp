import { describe, expect, it } from "vitest";
import {
  WEBHOOK_STALE_PROCESSING_MS,
  resolveWebhookClaimForExistingRow,
} from "./webhookClaimPolicy";

const now = new Date("2026-06-10T12:00:00.000Z");

describe("resolveWebhookClaimForExistingRow", () => {
  it("treats completed events as permanent duplicates", () => {
    expect(
      resolveWebhookClaimForExistingRow(
        { status: "completed", updatedAt: new Date("2026-06-01T00:00:00.000Z") },
        now
      )
    ).toBe("duplicate");
  });

  it("reclaims failed events immediately", () => {
    expect(
      resolveWebhookClaimForExistingRow(
        { status: "failed", updatedAt: new Date("2026-06-10T11:00:00.000Z") },
        now
      )
    ).toBe("claimed");
  });

  it("returns busy for recent processing claims", () => {
    expect(
      resolveWebhookClaimForExistingRow(
        {
          status: "processing",
          updatedAt: new Date(now.getTime() - 2 * 60 * 1000),
        },
        now
      )
    ).toBe("busy");
  });

  it("reclaims stale processing claims after five minutes", () => {
    expect(
      resolveWebhookClaimForExistingRow(
        {
          status: "processing",
          updatedAt: new Date(now.getTime() - WEBHOOK_STALE_PROCESSING_MS),
        },
        now
      )
    ).toBe("claimed");
  });

  it("reclaims processing claims older than five minutes", () => {
    expect(
      resolveWebhookClaimForExistingRow(
        {
          status: "processing",
          updatedAt: new Date(now.getTime() - WEBHOOK_STALE_PROCESSING_MS - 1000),
        },
        now
      )
    ).toBe("claimed");
  });
});

describe("stale reclaim route integration", () => {
  it("documents that a reclaimed stale event should complete successfully", () => {
    const staleProcessing = resolveWebhookClaimForExistingRow(
      {
        status: "processing",
        updatedAt: new Date(now.getTime() - 6 * 60 * 1000),
      },
      now
    );
    expect(staleProcessing).toBe("claimed");
  });
});
