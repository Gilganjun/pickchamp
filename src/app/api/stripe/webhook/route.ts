import Stripe from "stripe";
import { NextResponse } from "next/server";
import { mapStripeSubscriptionStatus } from "@/lib/billing/subscriptionEntitlement";
import { getStripeClient } from "@/lib/billing/stripeClient";
import { getStripeWebhookSecret, stripeEnabled } from "@/lib/billing/stripeConfig";
import {
  claimStripeWebhookEvent,
  completeStripeWebhookEvent,
  failStripeWebhookEvent,
  fetchSubscriptionByStripeCustomerId,
  fetchSubscriptionByStripeSubscriptionId,
  updateSubscriptionFromStripe,
} from "@/lib/data/subscriptions";

export const runtime = "nodejs";

function toIsoFromUnix(seconds: number | null | undefined): string | null {
  if (seconds == null) return null;
  return new Date(seconds * 1000).toISOString();
}

async function resolveUserIdFromSubscription(
  stripeSubscription: Stripe.Subscription
): Promise<string | null> {
  const metaUserId = stripeSubscription.metadata?.user_id;
  if (metaUserId) return metaUserId;

  const existing = await fetchSubscriptionByStripeSubscriptionId(
    stripeSubscription.id
  );
  if (existing) return existing.user_id;

  const customerId =
    typeof stripeSubscription.customer === "string"
      ? stripeSubscription.customer
      : stripeSubscription.customer?.id;

  if (customerId) {
    const byCustomer = await fetchSubscriptionByStripeCustomerId(customerId);
    if (byCustomer) return byCustomer.user_id;
  }

  return null;
}

async function syncStripeSubscription(
  stripeSubscription: Stripe.Subscription
): Promise<void> {
  // Idempotent state sync — safe to rerun after stale webhook reclaim.
  const userId = await resolveUserIdFromSubscription(stripeSubscription);
  if (!userId) return;

  const customerId =
    typeof stripeSubscription.customer === "string"
      ? stripeSubscription.customer
      : stripeSubscription.customer.id;

  const patch: Parameters<typeof updateSubscriptionFromStripe>[1] = {
    stripe_customer_id: customerId,
    stripe_subscription_id: stripeSubscription.id,
    status: mapStripeSubscriptionStatus(stripeSubscription.status),
    current_period_end: toIsoFromUnix(stripeSubscription.current_period_end),
    cancel_at_period_end: stripeSubscription.cancel_at_period_end,
  };

  const trialEnd = toIsoFromUnix(stripeSubscription.trial_end);
  const trialStart = toIsoFromUnix(stripeSubscription.trial_start);
  if (trialEnd) patch.trial_ends_at = trialEnd;
  if (trialStart) patch.trial_started_at = trialStart;

  await updateSubscriptionFromStripe(userId, patch);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId =
    session.client_reference_id ??
    session.metadata?.user_id ??
    null;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!userId || !customerId) return;

  await updateSubscriptionFromStripe(userId, {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId ?? undefined,
  });

  if (subscriptionId) {
    const stripe = getStripeClient();
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    await syncStripeSubscription(stripeSubscription);
  }
}

async function processStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncStripeSubscription(event.data.object as Stripe.Subscription);
      break;
    default:
      break;
  }
}

export async function POST(request: Request) {
  if (!stripeEnabled()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripeClient();
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret()
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const claim = await claimStripeWebhookEvent(event.id, event.type);

  if (claim === "duplicate") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (claim === "busy") {
    return NextResponse.json({ received: true, busy: true });
  }

  try {
    await processStripeEvent(event);
    await completeStripeWebhookEvent(event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    await failStripeWebhookEvent(event.id, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
