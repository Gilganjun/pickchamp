import type Stripe from "stripe";

/** Resolve period end across Stripe API shapes (root field or subscription item). */
export function getStripeSubscriptionPeriodEnd(
  subscription: Stripe.Subscription
): number | null {
  if (subscription.current_period_end != null) {
    return subscription.current_period_end;
  }

  const itemEnd = subscription.items?.data?.[0]?.current_period_end;
  if (itemEnd != null) return itemEnd;

  if (subscription.trial_end != null) return subscription.trial_end;
  if (subscription.billing_cycle_anchor != null) {
    return subscription.billing_cycle_anchor;
  }

  return null;
}

export function toIsoFromUnixSeconds(
  seconds: number | null | undefined
): string | null {
  if (seconds == null) return null;
  return new Date(seconds * 1000).toISOString();
}
