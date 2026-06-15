"use server";

import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/session";
import {
  buildCheckoutIdempotencyKey,
  resolveCheckoutTrialEnd,
  toStripeTrialEndSeconds,
} from "@/lib/billing/trialDates";
import {
  canStartCheckout,
  getCheckoutBlockReason,
} from "@/lib/billing/subscriptionEntitlement";
import { getStripeClient } from "@/lib/billing/stripeClient";
import {
  getStripePriceId,
  stripeEnabled,
} from "@/lib/billing/stripeConfig";
import { usesLiveSupabase } from "@/lib/config";
import {
  ensureSubscriptionForUser,
  fetchSubscriptionByUserId,
  persistCheckoutTrialEnd,
} from "@/lib/data/subscriptions";
import { getCurrentUserProfile } from "@/lib/data/profiles";

function billingUnavailableRedirect() {
  redirect("/subscribe?error=billing_unavailable");
}

async function findReusableCheckoutUrl(
  stripeCustomerId: string
): Promise<string | null> {
  const stripe = getStripeClient();
  const sessions = await stripe.checkout.sessions.list({
    customer: stripeCustomerId,
    limit: 5,
  });

  const openSession = sessions.data.find(
    (session) => session.status === "open" && session.url
  );
  return openSession?.url ?? null;
}

export async function createCheckoutSessionAction(): Promise<void> {
  if (!usesLiveSupabase() || !stripeEnabled()) {
    billingUnavailableRedirect();
  }

  const user = await getAuthUser();
  if (!user?.email) {
    redirect("/login?next=/subscribe");
  }

  const profile = await getCurrentUserProfile(user.id);
  if (!profile) {
    redirect("/login?next=/subscribe");
  }

  let subscription = await fetchSubscriptionByUserId(user.id);
  if (!subscription) {
    subscription = await ensureSubscriptionForUser(user.id, profile.created_at);
  }

  const blockReason = getCheckoutBlockReason(subscription);
  if (blockReason === "canceled_during_trial") {
    redirect("/subscribe?status=canceled_during_trial");
  }
  if (!canStartCheckout(subscription)) {
    redirect("/subscribe?status=already_subscribed");
  }

  if (subscription.stripe_customer_id) {
    const reusableUrl = await findReusableCheckoutUrl(
      subscription.stripe_customer_id
    );
    if (reusableUrl) {
      redirect(reusableUrl);
    }
  }

  const now = new Date();
  const resolution = resolveCheckoutTrialEnd(subscription, now);

  if (resolution.kind === "trial" && resolution.shouldPersist) {
    subscription = await persistCheckoutTrialEnd(
      user.id,
      resolution.trialEndsAt,
      resolution.wasAdjusted
    );
  } else if (
    resolution.kind === "trial" &&
    !resolution.shouldPersist &&
    resolution.trialEndsAt.getTime() !==
      new Date(subscription.trial_ends_at).getTime()
  ) {
    subscription = await persistCheckoutTrialEnd(
      user.id,
      resolution.trialEndsAt,
      false
    );
  }

  const stripe = getStripeClient();
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const idempotencyKey = buildCheckoutIdempotencyKey(user.id, resolution);

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      customer: subscription.stripe_customer_id ?? undefined,
      customer_email: subscription.stripe_customer_id ? undefined : user.email,
      client_reference_id: user.id,
      line_items: [{ price: getStripePriceId(), quantity: 1 }],
      subscription_data:
        resolution.kind === "trial"
          ? {
              trial_end: toStripeTrialEndSeconds(resolution.trialEndsAt, now),
              metadata: { user_id: user.id },
            }
          : { metadata: { user_id: user.id } },
      metadata: { user_id: user.id },
      success_url: `${origin}/subscribe?success=1`,
      cancel_url: `${origin}/subscribe?canceled=1`,
    },
    { idempotencyKey }
  );

  if (!session.url) {
    redirect("/subscribe?error=checkout_failed");
  }

  redirect(session.url);
}

export async function createCustomerPortalSessionAction(): Promise<void> {
  if (!usesLiveSupabase() || !stripeEnabled()) {
    billingUnavailableRedirect();
  }

  const user = await getAuthUser();
  if (!user) {
    redirect("/login?next=/subscribe");
  }

  const subscription = await fetchSubscriptionByUserId(user.id);
  if (!subscription?.stripe_customer_id) {
    redirect("/subscribe?error=no_billing_account");
  }

  const stripe = getStripeClient();
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${origin}/profile`,
  });

  redirect(portalSession.url);
}
