import { describe, expect, it } from "vitest";
import { getSubscriptionDisplayInfo } from "./subscriptionDisplay";
import type { Subscription } from "@/types";

const baseSubscription: Subscription = {
  user_id: "user-1",
  stripe_customer_id: null,
  stripe_subscription_id: null,
  status: "trialing",
  trial_started_at: "2026-06-06T12:00:00.000Z",
  trial_ends_at: "2026-07-06T12:00:00.000Z",
  checkout_trial_adjusted_at: null,
  current_period_end: null,
  cancel_at_period_end: false,
  created_at: "2026-06-06T12:00:00.000Z",
  updated_at: "2026-06-06T12:00:00.000Z",
};

describe("getSubscriptionDisplayInfo", () => {
  it("shows subscribe CTA during active trial without Stripe sub", () => {
    const display = getSubscriptionDisplayInfo(
      baseSubscription,
      baseSubscription.trial_started_at
    );
    expect(display.variant).toBe("trialing");
    expect(display.showSubscribeCta).toBe(true);
    expect(display.subline).toMatch(/not be charged before then/i);
  });

  it("shows scheduled billing copy when Stripe sub exists during trial", () => {
    const display = getSubscriptionDisplayInfo(
      {
        ...baseSubscription,
        stripe_subscription_id: "sub_123",
        stripe_customer_id: "cus_123",
      },
      baseSubscription.trial_started_at
    );
    expect(display.variant).toBe("trialing_scheduled");
    expect(display.showSubscribeCta).toBe(false);
    expect(display.showManageCta).toBe(true);
  });

  it("shows canceled-during-trial copy instead of trial-expired", () => {
    const display = getSubscriptionDisplayInfo(
      {
        ...baseSubscription,
        stripe_subscription_id: "sub_123",
        status: "canceled",
      },
      baseSubscription.trial_started_at
    );

    expect(display.variant).toBe("canceled_during_trial");
    expect(display.headline).toMatch(/Canceled · Access continues until/i);
    expect(display.variant).not.toBe("trial_expired");
  });

  it("does not show ordinary trial copy for incomplete subscriptions", () => {
    const display = getSubscriptionDisplayInfo(
      {
        ...baseSubscription,
        stripe_subscription_id: "sub_123",
        status: "incomplete",
      },
      baseSubscription.trial_started_at
    );

    expect(display.variant).toBe("incomplete");
    expect(display.headline).toMatch(/incomplete/i);
  });

  it("shows immediate billing copy when the trial has expired", () => {
    const display = getSubscriptionDisplayInfo(
      {
        ...baseSubscription,
        trial_ends_at: "2026-05-01T12:00:00.000Z",
        status: "canceled",
      },
      baseSubscription.trial_started_at
    );

    expect(display.variant).toBe("trial_expired");
    expect(display.billingStartsImmediately).toBe(true);
    expect(display.subline).toMatch(/begin today/i);
  });

  it("falls back to signup date when subscription row is missing", () => {
    const display = getSubscriptionDisplayInfo(null, "2026-06-06T12:00:00.000Z");
    expect(display.variant).toBe("trialing");
    expect(display.trialEndsLabel).toBe("6 Jul 2026");
  });
});
