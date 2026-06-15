import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapSubscription } from "@/lib/supabase/subscriptionMapper";
import {
  computeTrialWindow,
  toIsoTimestamp,
} from "@/lib/billing/trialDates";
import type { Subscription, SubscriptionStatus } from "@/types";

function throwQueryError(table: string, error: { message: string }) {
  throw new Error(`Supabase ${table} query failed: ${error.message}`);
}

function stripUndefined<T extends Record<string, unknown>>(patch: T): T {
  return Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  ) as T;
}

export type WebhookClaimResult = "claimed" | "duplicate" | "busy";

/** Service-role read — webhooks and server actions without a user session. */
export async function fetchSubscriptionByUserIdAdmin(
  userId: string
): Promise<Subscription | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throwQueryError("subscriptions", error);
  return data ? mapSubscription(data) : null;
}

export async function fetchSubscriptionByUserId(
  userId: string
): Promise<Subscription | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throwQueryError("subscriptions", error);
  return data ? mapSubscription(data) : null;
}

export async function ensureSubscriptionForUser(
  userId: string,
  signupIso: string
): Promise<Subscription> {
  const existing = await fetchSubscriptionByUserIdAdmin(userId);
  if (existing) return existing;

  const admin = createAdminClient();
  const { trialStartedAt, trialEndsAt } = computeTrialWindow(signupIso);
  const { data, error } = await admin
    .from("subscriptions")
    .insert({
      user_id: userId,
      status: "trialing",
      trial_started_at: toIsoTimestamp(trialStartedAt),
      trial_ends_at: toIsoTimestamp(trialEndsAt),
    })
    .select("*")
    .single();

  if (error) {
    const retry = await fetchSubscriptionByUserIdAdmin(userId);
    if (retry) return retry;
    throwQueryError("subscriptions", error);
  }

  return mapSubscription(data);
}

export async function ensureSubscriptionRowForStripeSync(
  userId: string
): Promise<Subscription> {
  const existing = await fetchSubscriptionByUserIdAdmin(userId);
  if (existing) return existing;

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("created_at")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) throwQueryError("profiles", profileError);
  if (!profile?.created_at) {
    throw new Error(`No profile row for user_id=${userId}`);
  }

  return ensureSubscriptionForUser(userId, String(profile.created_at));
}

export async function persistCheckoutTrialEnd(
  userId: string,
  trialEndsAt: Date,
  markAdjusted: boolean
): Promise<Subscription> {
  const admin = createAdminClient();
  const patch: Record<string, string> = {
    trial_ends_at: toIsoTimestamp(trialEndsAt),
    updated_at: new Date().toISOString(),
  };

  if (markAdjusted) {
    patch.checkout_trial_adjusted_at = new Date().toISOString();
  }

  const { data, error } = await admin
    .from("subscriptions")
    .update(patch)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throwQueryError("subscriptions", error);
  return mapSubscription(data);
}

export type SubscriptionStripePatch = {
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  status?: SubscriptionStatus;
  trial_started_at?: string;
  trial_ends_at?: string;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
};

export async function updateSubscriptionFromStripe(
  userId: string,
  patch: SubscriptionStripePatch
): Promise<Subscription> {
  const admin = createAdminClient();
  const payload = stripUndefined({
    ...patch,
    updated_at: new Date().toISOString(),
  });

  const { data, error } = await admin
    .from("subscriptions")
    .update(payload)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) throwQueryError("subscriptions", error);
  if (!data) {
    throw new Error(
      `Supabase subscriptions update affected 0 rows for user_id=${userId}`
    );
  }
  return mapSubscription(data);
}

export async function fetchSubscriptionByStripeCustomerId(
  stripeCustomerId: string
): Promise<Subscription | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  if (error) throwQueryError("subscriptions", error);
  return data ? mapSubscription(data) : null;
}

export async function fetchSubscriptionByStripeSubscriptionId(
  stripeSubscriptionId: string
): Promise<Subscription | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();
  if (error) throwQueryError("subscriptions", error);
  return data ? mapSubscription(data) : null;
}

export async function claimStripeWebhookEvent(
  eventId: string,
  eventType: string
): Promise<WebhookClaimResult> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("claim_stripe_webhook_event", {
    p_event_id: eventId,
    p_event_type: eventType,
  });

  if (error) throwQueryError("claim_stripe_webhook_event", error);
  return data as WebhookClaimResult;
}

export async function completeStripeWebhookEvent(eventId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.rpc("complete_stripe_webhook_event", {
    p_event_id: eventId,
  });
  if (error) throwQueryError("complete_stripe_webhook_event", error);
}

export async function failStripeWebhookEvent(
  eventId: string,
  errorMessage: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.rpc("fail_stripe_webhook_event", {
    p_event_id: eventId,
    p_error: errorMessage,
  });
  if (error) throwQueryError("fail_stripe_webhook_event", error);
}
