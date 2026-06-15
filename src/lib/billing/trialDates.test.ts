import { describe, expect, it } from "vitest";
import {
  STRIPE_MIN_TRIAL_LEAD_MS,
  addCalendarDays,
  buildCheckoutIdempotencyKey,
  resolveCheckoutTrialEnd,
  toStripeTrialEndSeconds,
} from "./trialDates";

const HOUR_MS = 60 * 60 * 1000;

describe("resolveCheckoutTrialEnd", () => {
  const now = new Date("2026-06-10T12:00:00.000Z");

  it("preserves stored trial end when more than 49 hours remain", () => {
    const resolution = resolveCheckoutTrialEnd(
      {
        trial_ends_at: "2026-06-20T12:00:00.000Z",
        checkout_trial_adjusted_at: null,
      },
      now
    );

    expect(resolution.kind).toBe("trial");
    if (resolution.kind !== "trial") return;
    expect(resolution.trialEndsAt.toISOString()).toBe("2026-06-20T12:00:00.000Z");
    expect(resolution.shouldPersist).toBe(false);
    expect(resolution.wasAdjusted).toBe(false);
  });

  it("extends to three calendar days when fewer than 49 hours remain", () => {
    const resolution = resolveCheckoutTrialEnd(
      {
        trial_ends_at: "2026-06-11T12:00:00.000Z",
        checkout_trial_adjusted_at: null,
      },
      now
    );

    expect(resolution.kind).toBe("trial");
    if (resolution.kind !== "trial") return;
    expect(resolution.trialEndsAt.toISOString()).toBe("2026-06-13T12:00:00.000Z");
    expect(resolution.shouldPersist).toBe(true);
    expect(resolution.wasAdjusted).toBe(true);
  });

  it("reuses a previously adjusted stored date without extending again", () => {
    const resolution = resolveCheckoutTrialEnd(
      {
        trial_ends_at: "2026-06-13T12:00:00.000Z",
        checkout_trial_adjusted_at: "2026-06-10T12:00:00.000Z",
      },
      now
    );

    expect(resolution.kind).toBe("trial");
    if (resolution.kind !== "trial") return;
    expect(resolution.trialEndsAt.toISOString()).toBe("2026-06-13T12:00:00.000Z");
    expect(resolution.shouldPersist).toBe(false);
  });

  it("returns immediate billing when the trial has expired", () => {
    const resolution = resolveCheckoutTrialEnd(
      {
        trial_ends_at: "2026-06-09T12:00:00.000Z",
        checkout_trial_adjusted_at: null,
      },
      now
    );

    expect(resolution).toEqual({ kind: "immediate" });
  });

  it("keeps the same idempotency key for repeated attempts with the same resolved trial end", () => {
    const subscription = {
      trial_ends_at: "2026-06-13T12:00:00.000Z",
      checkout_trial_adjusted_at: "2026-06-10T12:00:00.000Z",
    };
    const first = resolveCheckoutTrialEnd(subscription, now);
    const second = resolveCheckoutTrialEnd(subscription, now);

    expect(buildCheckoutIdempotencyKey("user-1", first)).toBe(
      buildCheckoutIdempotencyKey("user-1", second)
    );
  });

  it("sends a Stripe trial_end safely beyond the 48-hour minimum", () => {
    const resolution = resolveCheckoutTrialEnd(
      {
        trial_ends_at: "2026-06-11T12:00:00.000Z",
        checkout_trial_adjusted_at: null,
      },
      now
    );

    expect(resolution.kind).toBe("trial");
    if (resolution.kind !== "trial") return;

    const stripeSeconds = toStripeTrialEndSeconds(resolution.trialEndsAt, now);
    const leadMs = stripeSeconds * 1000 - now.getTime();
    expect(leadMs).toBeGreaterThanOrEqual(STRIPE_MIN_TRIAL_LEAD_MS - 1000);
  });

  it("uses at least 49 hours when a previously adjusted date is now too close", () => {
    const lateNow = new Date("2026-06-13T00:00:00.000Z");
    const resolution = resolveCheckoutTrialEnd(
      {
        trial_ends_at: "2026-06-13T12:00:00.000Z",
        checkout_trial_adjusted_at: "2026-06-10T12:00:00.000Z",
      },
      lateNow
    );

    expect(resolution.kind).toBe("trial");
    if (resolution.kind !== "trial") return;
    expect(
      resolution.trialEndsAt.getTime() - lateNow.getTime()
    ).toBeGreaterThanOrEqual(STRIPE_MIN_TRIAL_LEAD_MS - 1000);
    expect(resolution.shouldPersist).toBe(true);
  });

  it("three-day extension exceeds the 49-hour safety buffer", () => {
    const adjusted = addCalendarDays(now, 3);
    expect(adjusted.getTime() - now.getTime()).toBeGreaterThan(49 * HOUR_MS);
  });
});
