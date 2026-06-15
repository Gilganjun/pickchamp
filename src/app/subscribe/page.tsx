import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  createCheckoutSessionAction,
  createCustomerPortalSessionAction,
} from "@/app/actions/billing";
import { getAuthUser } from "@/lib/auth/session";
import { getSubscriptionDisplayInfo } from "@/lib/billing/subscriptionDisplay";
import {
  getSubscriptionPriceLabel,
  stripeEnabled,
} from "@/lib/billing/stripeConfig";
import { usesLiveSupabase } from "@/lib/config";
import { MOCK_USER_ID } from "@/data/mock";
import { getCurrentUserProfile } from "@/lib/data/profiles";
import {
  ensureSubscriptionForUser,
  fetchSubscriptionByUserId,
} from "@/lib/data/subscriptions";

export const dynamic = "force-dynamic";

interface SubscribePageProps {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    error?: string;
    status?: string;
  }>;
}

export default async function SubscribePage({ searchParams }: SubscribePageProps) {
  const params = await searchParams;
  const liveMode = usesLiveSupabase();
  const billingReady = liveMode && stripeEnabled();
  const user = liveMode ? await getAuthUser() : null;
  const userId = liveMode ? user?.id : MOCK_USER_ID;

  let display = null;
  if (userId) {
    const profile = await getCurrentUserProfile(userId);
    if (profile) {
      let subscription = liveMode
        ? await fetchSubscriptionByUserId(userId)
        : null;
      if (liveMode && !subscription) {
        subscription = await ensureSubscriptionForUser(userId, profile.created_at);
      }
      display = getSubscriptionDisplayInfo(subscription, profile.created_at);
    }
  }

  const priceLabel = getSubscriptionPriceLabel();

  return (
    <AppShell showTagline={false} centeredBrand>
      <div className="pickfist-content mx-auto w-full max-w-lg space-y-4 pb-6 pt-2">
        <header className="text-center">
          <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold uppercase tracking-wide text-white">
            Subscribe
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Unlimited picks across boxing and MMA.
          </p>
        </header>

        {params.success === "1" ? (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-300">
            Subscription setup complete. Your trial continues until billing begins.
          </p>
        ) : null}

        {params.canceled === "1" ? (
          <p className="rounded-xl border border-zinc-700 bg-[#111111] px-4 py-3 text-sm text-zinc-400">
            Checkout canceled. You can subscribe anytime from your profile.
          </p>
        ) : null}

        {params.status === "already_subscribed" ? (
          <p className="rounded-xl border border-[#d4a853]/30 bg-[#d4a853]/10 px-4 py-3 text-sm text-[#d4a853]">
            You already have a subscription on file. Manage it below.
          </p>
        ) : null}

        {params.status === "canceled_during_trial" ? (
          <p className="rounded-xl border border-[#d4a853]/30 bg-[#d4a853]/10 px-4 py-3 text-sm text-[#d4a853]">
            Your subscription is canceled, but your trial access continues. Manage
            billing from your profile if you need to update payment details.
          </p>
        ) : null}

        {params.error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {params.error === "billing_unavailable"
              ? "Billing is not available in this environment yet."
              : "Something went wrong. Please try again or contact support."}
          </p>
        ) : null}

        <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            PickFist Unlimited
          </p>
          <p className="mt-1 font-[family-name:var(--font-teko)] text-2xl font-bold text-white">
            {priceLabel}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
            <li>Unlimited fight picks</li>
            <li>Global, boxing and MMA rankings</li>
            <li>Pick Record export</li>
          </ul>
        </section>

        {display ? (
          <section className="rounded-xl border border-[#d4a853]/35 bg-gradient-to-br from-[#d4a853]/10 via-[#181818] to-[#111111] px-4 py-4">
            {display.subline ? (
              <p className="text-sm text-zinc-300">{display.subline}</p>
            ) : (
              <p className="text-sm text-zinc-300">
                Your free trial ends{" "}
                <span className="font-semibold text-white">
                  {display.trialEndsLabel}
                </span>
                .
              </p>
            )}
          </section>
        ) : null}

        {!user && liveMode ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-zinc-400">Log in to subscribe.</p>
            <Link
              href="/login?next=/subscribe"
              className="inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-bold uppercase text-white hover:bg-red-500"
            >
              Log in
            </Link>
          </div>
        ) : null}

        {user && billingReady && display?.showSubscribeCta ? (
          <form action={createCheckoutSessionAction}>
            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-500"
            >
              Subscribe now
            </button>
          </form>
        ) : null}

        {user && billingReady && display?.showManageCta ? (
          <form action={createCustomerPortalSessionAction}>
            <button
              type="submit"
              className="w-full rounded-xl border border-[#d4a853]/50 py-3.5 text-sm font-bold uppercase tracking-wide text-[#d4a853] hover:border-[#d4a853]"
            >
              Manage subscription
            </button>
          </form>
        ) : null}

        {!billingReady && user ? (
          <p className="text-center text-xs text-zinc-500">
            {liveMode
              ? "Stripe billing is being configured for production."
              : "Billing is available on the live site after you create an account."}
          </p>
        ) : null}

        <p className="text-center text-xs text-zinc-600">
          <Link href="/profile" className="text-zinc-400 hover:text-white">
            Back to profile
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
