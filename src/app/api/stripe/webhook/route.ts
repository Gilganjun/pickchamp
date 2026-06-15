import Stripe from "stripe";
import { NextResponse } from "next/server";
import { mapStripeSubscriptionStatus } from "@/lib/billing/subscriptionEntitlement";
import {
  getStripeSubscriptionPeriodEnd,
  toIsoFromUnixSeconds,
} from "@/lib/billing/stripeSubscriptionFields";
import { getStripeClient } from "@/lib/billing/stripeClient";
import { getStripeWebhookSecret, stripeEnabled } from "@/lib/billing/stripeConfig";
import {
  claimStripeWebhookEvent,
  completeStripeWebhookEvent,
  ensureSubscriptionRowForStripeSync,
  failStripeWebhookEvent,
  fetchSubscriptionByStripeCustomerId,
  fetchSubscriptionByStripeSubscriptionId,
  updateSubscriptionFromStripe,
} from "@/lib/data/subscriptions";

export const runtime = "nodejs";

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
  const userId = await resolveUserIdFromSubscription(stripeSubscription);
  if (!userId) {
    throw new Error(
      `Unable to resolve user_id for Stripe subscription ${stripeSubscription.id}`
    );
  }

  await ensureSubscriptionRowForStripeSync(userId);

  const customerId =
    typeof stripeSubscription.customer === "string"
      ? stripeSubscription.customer
      : stripeSubscription.customer.id;

  const patch: Parameters<typeof updateSubscriptionFromStripe>[1] = {
    stripe_customer_id: customerId,
    stripe_subscription_id: stripeSubscription.id,
    status: mapStripeSubscriptionStatus(stripeSubscription.status),
    current_period_end: toIsoFromUnixSeconds(
      getStripeSubscriptionPeriodEnd(stripeSubscription)
    ),
    cancel_at_period_end: stripeSubscription.cancel_at_period_end,
  };

  const trialEnd = toIsoFromUnixSeconds(stripeSubscription.trial_end);
  const trialStart = toIsoFromUnixSeconds(stripeSubscription.trial_start);
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

  if (!userId || !customerId) {
    throw new Error(
      `checkout.session.completed missing user_id or customer (user_id=${userId ?? "null"})`
    );
  }

  await ensureSubscriptionRowForStripeSync(userId);

  await updateSubscriptionFromStripe(userId, {
    stripe_customer_id: customerId,
    ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}),
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

  let claim: Awaited<ReturnType<typeof claimStripeWebhookEvent>>;
  try {
    claim = await claimStripeWebhookEvent(event.id, event.type);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "claim_stripe_webhook_event failed";
    console.error("stripe webhook claim error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

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
    try {
      await failStripeWebhookEvent(event.id, message);
    } catch (failError) {
      const failMessage =
        failError instanceof Error ? failError.message : "fail_stripe_webhook_event failed";
      console.error("stripe webhook fail marker error:", failMessage);
    }
    console.error("stripe webhook processing error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
