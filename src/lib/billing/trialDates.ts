/** Calendar-month trial length — single source for signup + backfill. */

export const TRIAL_LENGTH_MONTHS = 1;

/** Stripe minimum lead time plus safety buffer (49 hours). */
export const STRIPE_MIN_TRIAL_LEAD_MS = 49 * 60 * 60 * 1000;

export function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function computeTrialWindow(signupIso: string): {
  trialStartedAt: Date;
  trialEndsAt: Date;
} {
  const trialStartedAt = new Date(signupIso);
  return {
    trialStartedAt,
    trialEndsAt: addCalendarMonths(trialStartedAt, TRIAL_LENGTH_MONTHS),
  };
}

export function formatTrialDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function toIsoTimestamp(date: Date): string {
  return date.toISOString();
}

export type CheckoutTrialResolution =
  | {
      kind: "trial";
      trialEndsAt: Date;
      /** True when trial_ends_at should be written to the database. */
      shouldPersist: boolean;
      wasAdjusted: boolean;
    }
  | { kind: "immediate" };

function ensureStripeSafeTrialEnd(storedEnd: Date, now: Date): Date {
  const minSafeMs = now.getTime() + STRIPE_MIN_TRIAL_LEAD_MS;
  return storedEnd.getTime() >= minSafeMs
    ? storedEnd
    : new Date(minSafeMs);
}

/**
 * Resolves the trial end used for Checkout and Stripe.
 * Does not mutate subscription rows — caller persists when shouldPersist is true.
 */
export function resolveCheckoutTrialEnd(
  subscription: {
    trial_ends_at: string;
    checkout_trial_adjusted_at?: string | null;
  },
  now: Date = new Date()
): CheckoutTrialResolution {
  const storedEnd = new Date(subscription.trial_ends_at);
  const nowMs = now.getTime();

  if (storedEnd.getTime() <= nowMs) {
    return { kind: "immediate" };
  }

  const msUntilStoredEnd = storedEnd.getTime() - nowMs;

  if (msUntilStoredEnd >= STRIPE_MIN_TRIAL_LEAD_MS) {
    return {
      kind: "trial",
      trialEndsAt: storedEnd,
      shouldPersist: false,
      wasAdjusted: false,
    };
  }

  if (subscription.checkout_trial_adjusted_at) {
    const safeEnd = ensureStripeSafeTrialEnd(storedEnd, now);
    return {
      kind: "trial",
      trialEndsAt: safeEnd,
      shouldPersist: safeEnd.getTime() !== storedEnd.getTime(),
      wasAdjusted: false,
    };
  }

  const threeDayEnd = addCalendarDays(now, 3);
  const adjustedEnd = ensureStripeSafeTrialEnd(threeDayEnd, now);

  return {
    kind: "trial",
    trialEndsAt: adjustedEnd,
    shouldPersist: true,
    wasAdjusted: true,
  };
}

/** Unix seconds for Stripe trial_end — must exceed Stripe's 48-hour minimum. */
export function toStripeTrialEndSeconds(trialEndsAt: Date, now: Date = new Date()): number {
  const safeEnd = ensureStripeSafeTrialEnd(trialEndsAt, now);
  return Math.floor(safeEnd.getTime() / 1000);
}

export function buildCheckoutIdempotencyKey(
  userId: string,
  resolution: CheckoutTrialResolution
): string {
  const suffix =
    resolution.kind === "trial"
      ? String(resolution.trialEndsAt.getTime())
      : "immediate";
  return `checkout_${userId}_${suffix}`;
}
