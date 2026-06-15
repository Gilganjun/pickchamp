import type { Subscription } from "@/types";

export function mapSubscription(row: Record<string, unknown>): Subscription {
  return {
    user_id: String(row.user_id),
    stripe_customer_id: (row.stripe_customer_id as string | null) ?? null,
    stripe_subscription_id: (row.stripe_subscription_id as string | null) ?? null,
    status: row.status as Subscription["status"],
    trial_started_at: String(row.trial_started_at),
    trial_ends_at: String(row.trial_ends_at),
    checkout_trial_adjusted_at:
      (row.checkout_trial_adjusted_at as string | null) ?? null,
    current_period_end: (row.current_period_end as string | null) ?? null,
    cancel_at_period_end: Boolean(row.cancel_at_period_end),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}
