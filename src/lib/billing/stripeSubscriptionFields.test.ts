import { describe, expect, it } from "vitest";
import {
  getStripeSubscriptionPeriodEnd,
  toIsoFromUnixSeconds,
} from "./stripeSubscriptionFields";

describe("getStripeSubscriptionPeriodEnd", () => {
  it("prefers root current_period_end when present", () => {
    const end = getStripeSubscriptionPeriodEnd({
      current_period_end: 100,
      items: { data: [{ current_period_end: 200 }] },
    } as never);
    expect(end).toBe(100);
  });

  it("falls back to subscription item period end", () => {
    const end = getStripeSubscriptionPeriodEnd({
      items: { data: [{ current_period_end: 1_783_282_671 }] },
      trial_end: 1_783_282_671,
    } as never);
    expect(end).toBe(1_783_282_671);
  });

  it("falls back to trial_end then billing_cycle_anchor", () => {
    expect(
      getStripeSubscriptionPeriodEnd({
        trial_end: 99,
        billing_cycle_anchor: 50,
      } as never)
    ).toBe(99);

    expect(
      getStripeSubscriptionPeriodEnd({
        billing_cycle_anchor: 50,
      } as never)
    ).toBe(50);
  });
});

describe("toIsoFromUnixSeconds", () => {
  it("returns null for missing values", () => {
    expect(toIsoFromUnixSeconds(undefined)).toBeNull();
    expect(toIsoFromUnixSeconds(null)).toBeNull();
  });

  it("converts unix seconds to ISO", () => {
    expect(toIsoFromUnixSeconds(0)).toBe("1970-01-01T00:00:00.000Z");
  });
});
