import type { Subscription, SubscriptionStatus } from "@/types";

export function isWithinTrialPeriod(
  subscription: Pick<Subscription, "trial_ends_at">,
  now = Date.now()
): boolean {
  return new Date(subscription.trial_ends_at).getTime() > now;
}

export function isTrialing(
  subscription: Subscription,
  now = Date.now()
): boolean {
  return subscription.status === "trialing" && isWithinTrialPeriod(subscription, now);
}

export function isCanceledDuringTrial(
  subscription: Subscription,
  now = Date.now()
): boolean {
  return subscription.status === "canceled" && isWithinTrialPeriod(subscription, now);
}

export function hasActivePaidPeriod(
  subscription: Subscription,
  now = Date.now()
): boolean {
  const periodEndMs = subscription.current_period_end
    ? new Date(subscription.current_period_end).getTime()
    : null;

  if (subscription.status === "active") {
    return periodEndMs == null || periodEndMs > now;
  }

  if (subscription.status === "past_due") {
    return periodEndMs != null && periodEndMs > now;
  }

  return false;
}

/** @deprecated Prefer isTrialing() for status-aware checks. */
export function isTrialActive(
  subscription: Subscription,
  now = Date.now()
): boolean {
  return isTrialing(subscription, now);
}

/** Whether the user should retain unlimited picks (enforcement hook — not wired yet). */
export function hasPremiumAccess(
  subscription: Subscription,
  now = Date.now()
): boolean {
  const periodEndMs = subscription.current_period_end
    ? new Date(subscription.current_period_end).getTime()
    : null;

  if (subscription.status === "active") {
    if (periodEndMs != null && periodEndMs <= now) return false;
    return true;
  }

  if (isTrialing(subscription, now)) {
    return true;
  }

  if (isCanceledDuringTrial(subscription, now)) {
    return true;
  }

  if (subscription.status === "canceled" && periodEndMs != null && periodEndMs > now) {
    return true;
  }

  if (subscription.status === "past_due" && periodEndMs != null && periodEndMs > now) {
    return true;
  }

  if (
    (subscription.status === "paused" || subscription.status === "unpaid") &&
    periodEndMs != null &&
    periodEndMs > now
  ) {
    return true;
  }

  return false;
}

export function hasScheduledBilling(subscription: Subscription): boolean {
  return Boolean(subscription.stripe_subscription_id);
}

export function mapStripeSubscriptionStatus(
  stripeStatus: string
): SubscriptionStatus {
  switch (stripeStatus) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
      return "unpaid";
    case "incomplete":
      return "incomplete";
    case "incomplete_expired":
      return "incomplete_expired";
    case "paused":
      return "paused";
    default:
      return "incomplete";
  }
}

export function canStartCheckout(
  subscription: Subscription,
  now = Date.now()
): boolean {
  if (subscription.stripe_subscription_id) {
    if (isWithinTrialPeriod(subscription, now)) {
      return false;
    }
    if (hasActivePaidPeriod(subscription, now)) {
      return false;
    }
    if (subscription.status === "trialing") {
      return false;
    }
    if (
      subscription.status === "incomplete" ||
      subscription.status === "paused"
    ) {
      return false;
    }
  }

  return true;
}

export function getCheckoutBlockReason(
  subscription: Subscription,
  now = Date.now()
): "canceled_during_trial" | "already_subscribed" | null {
  if (
    subscription.stripe_subscription_id &&
    isCanceledDuringTrial(subscription, now)
  ) {
    return "canceled_during_trial";
  }
  if (!canStartCheckout(subscription, now)) {
    return "already_subscribed";
  }
  return null;
}
