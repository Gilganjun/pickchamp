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

  it("shows canceled-during-trial copy for trialing + cancel_at_period_end", () => {
    const display = getSubscriptionDisplayInfo(
      {
        ...baseSubscription,
        stripe_customer_id: "cus_test",
        stripe_subscription_id: "sub_test",
        status: "trialing",
        cancel_at_period_end: true,
        current_period_end: "2026-07-06T12:00:00.000Z",
      },
      baseSubscription.trial_started_at
    );

    expect(display.variant).toBe("canceled_during_trial");
    expect(display.headline).toBe("Subscription canceled");
    expect(display.subline).toBe(
      "Access continues until 6 Jul 2026. You will not be charged."
    );
    expect(display.subline).not.toMatch(/continues until.*not be charged before then/i);
    expect(display.showSubscribeCta).toBe(false);
    expect(display.showManageCta).toBe(true);
  });

  it("shows canceled-during-trial copy for immediate canceled status", () => {
    const display = getSubscriptionDisplayInfo(
      {
        ...baseSubscription,
        stripe_subscription_id: "sub_123",
        status: "canceled",
      },
      baseSubscription.trial_started_at
    );

    expect(display.variant).toBe("canceled_during_trial");
    expect(display.headline).toBe("Subscription canceled");
    expect(display.subline).toMatch(/Access continues until/i);
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
