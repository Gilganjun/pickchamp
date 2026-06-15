import { describe, expect, it } from "vitest";
import {
  canStartCheckout,
  getCheckoutBlockReason,
  hasPremiumAccess,
  isCanceledDuringTrial,
  isTrialing,
  isWithinTrialPeriod,
  mapStripeSubscriptionStatus,
} from "./subscriptionEntitlement";
import type { Subscription } from "@/types";

const baseSubscription: Subscription = {
  user_id: "user-1",
  stripe_customer_id: null,
  stripe_subscription_id: null,
  status: "trialing",
  trial_started_at: "2026-06-01T00:00:00.000Z",
  trial_ends_at: "2026-07-01T00:00:00.000Z",
  checkout_trial_adjusted_at: null,
  current_period_end: null,
  cancel_at_period_end: false,
  created_at: "2026-06-01T00:00:00.000Z",
  updated_at: "2026-06-01T00:00:00.000Z",
};

describe("subscriptionEntitlement", () => {
  const midTrial = new Date("2026-06-15T00:00:00.000Z").getTime();

  it("grants premium access during trial", () => {
    expect(hasPremiumAccess(baseSubscription, midTrial)).toBe(true);
    expect(isTrialing(baseSubscription, midTrial)).toBe(true);
    expect(isWithinTrialPeriod(baseSubscription, midTrial)).toBe(true);
  });

  it("allows checkout when no Stripe subscription exists", () => {
    expect(canStartCheckout(baseSubscription, midTrial)).toBe(true);
  });

  it("blocks duplicate checkout when Stripe subscription is active", () => {
    expect(
      canStartCheckout(
        {
          ...baseSubscription,
          stripe_subscription_id: "sub_123",
          status: "active",
          current_period_end: "2026-08-01T00:00:00.000Z",
        },
        midTrial
      )
    ).toBe(false);
  });

  it("detects canceled-during-trial when Stripe keeps status trialing", () => {
    const scheduledCancel = {
      ...baseSubscription,
      stripe_customer_id: "cus_test",
      stripe_subscription_id: "sub_test",
      status: "trialing" as const,
      cancel_at_period_end: true,
      current_period_end: "2026-07-01T00:00:00.000Z",
    };

    expect(isCanceledDuringTrial(scheduledCancel, midTrial)).toBe(true);
    expect(isTrialing(scheduledCancel, midTrial)).toBe(true);
    expect(hasPremiumAccess(scheduledCancel, midTrial)).toBe(true);
    expect(canStartCheckout(scheduledCancel, midTrial)).toBe(false);
    expect(getCheckoutBlockReason(scheduledCancel, midTrial)).toBe(
      "canceled_during_trial"
    );
  });

  it("retains access when canceled during trial", () => {
    const canceledDuringTrial = {
      ...baseSubscription,
      stripe_subscription_id: "sub_123",
      status: "canceled" as const,
    };

    expect(isCanceledDuringTrial(canceledDuringTrial, midTrial)).toBe(true);
    expect(isTrialing(canceledDuringTrial, midTrial)).toBe(false);
    expect(hasPremiumAccess(canceledDuringTrial, midTrial)).toBe(true);
  });

  it("blocks checkout for canceled-during-trial users with an existing Stripe sub", () => {
    const canceledDuringTrial = {
      ...baseSubscription,
      stripe_subscription_id: "sub_123",
      status: "canceled" as const,
    };

    expect(canStartCheckout(canceledDuringTrial, midTrial)).toBe(false);
    expect(getCheckoutBlockReason(canceledDuringTrial, midTrial)).toBe(
      "canceled_during_trial"
    );
  });

  it("allows a new checkout after trial and paid period have fully ended", () => {
    const afterTrial = new Date("2026-08-01T00:00:00.000Z").getTime();
    expect(
      canStartCheckout(
        {
          ...baseSubscription,
          stripe_subscription_id: "sub_old",
          status: "canceled",
          trial_ends_at: "2026-07-01T00:00:00.000Z",
          current_period_end: "2026-07-01T00:00:00.000Z",
        },
        afterTrial
      )
    ).toBe(true);
  });

  it("maps incomplete and paused Stripe statuses explicitly", () => {
    expect(mapStripeSubscriptionStatus("incomplete")).toBe("incomplete");
    expect(mapStripeSubscriptionStatus("incomplete_expired")).toBe(
      "incomplete_expired"
    );
    expect(mapStripeSubscriptionStatus("paused")).toBe("paused");
  });
});
