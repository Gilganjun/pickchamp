/**
 * One-off repair: sync a Stripe subscription into Supabase subscriptions.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... \
 *   NEXT_PUBLIC_SUPABASE_URL=... \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/reconcile-stripe-subscription.mjs sub_xxx
 *
 * Or pass user UUID to sync the newest Stripe sub with matching metadata.user_id:
 *   node scripts/reconcile-stripe-subscription.mjs --user 7e5aff2b-...
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const arg = process.argv[2];
const userFlag = process.argv[3];

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
const supabase = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY")
);

function periodEndIso(sub) {
  const seconds =
    sub.current_period_end ??
    sub.items?.data?.[0]?.current_period_end ??
    sub.trial_end ??
    sub.billing_cycle_anchor ??
    null;
  return seconds == null ? null : new Date(seconds * 1000).toISOString();
}

async function loadSubscription(subscriptionId) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  if (sub.livemode) {
    throw new Error("Refusing live-mode subscription — use sk_test_ only");
  }
  return sub;
}

async function findSubscriptionForUser(userId) {
  const subs = await stripe.subscriptions.list({ limit: 20 });
  const match = subs.data.find((s) => s.metadata?.user_id === userId);
  if (!match) {
    throw new Error(`No Stripe subscription with metadata.user_id=${userId}`);
  }
  return match;
}

async function main() {
  let sub;
  if (arg === "--user" && userFlag) {
    sub = await findSubscriptionForUser(userFlag);
  } else if (arg?.startsWith("sub_")) {
    sub = await loadSubscription(arg);
  } else {
    throw new Error("Pass sub_... or --user <uuid>");
  }

  const userId = sub.metadata?.user_id;
  if (!userId) {
    throw new Error(`Subscription ${sub.id} has no metadata.user_id`);
  }

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const patch = {
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    trial_started_at: sub.trial_start
      ? new Date(sub.trial_start * 1000).toISOString()
      : undefined,
    trial_ends_at: sub.trial_end
      ? new Date(sub.trial_end * 1000).toISOString()
      : undefined,
    current_period_end: periodEndIso(sub),
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .update(patch)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(`No subscriptions row for user_id=${userId}`);
  }

  console.log(
    JSON.stringify(
      {
        user_id: data.user_id,
        stripe_customer_id: data.stripe_customer_id,
        stripe_subscription_id: data.stripe_subscription_id,
        status: data.status,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
