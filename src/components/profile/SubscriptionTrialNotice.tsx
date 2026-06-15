import Link from "next/link";
import { getSubscriptionDisplayInfo } from "@/lib/billing/subscriptionDisplay";
import type { Profile, Subscription } from "@/types";

interface SubscriptionTrialNoticeProps {
  profile: Profile;
  subscription?: Subscription | null;
}

export function SubscriptionTrialNotice({
  profile,
  subscription,
}: SubscriptionTrialNoticeProps) {
  const display = getSubscriptionDisplayInfo(subscription, profile.created_at);

  const content = (
    <>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d4a853]/80">
        Subscription type
      </p>
      <p className="mt-1 font-[family-name:var(--font-teko)] text-base font-bold uppercase leading-snug tracking-wide text-white sm:text-lg">
        {display.headline.includes("·") ? (
          display.headline
        ) : (
          <>
            {display.headline}
            {display.variant === "trialing" ||
            display.variant === "trialing_scheduled" ? (
              <>
                <span className="mx-1.5 text-[#d4a853]">·</span>
                <span className="text-[#d4a853]">Unlimited picks</span>
              </>
            ) : null}
          </>
        )}
      </p>
      {display.subline ? (
        <p className="mt-1.5 text-xs text-zinc-400">{display.subline}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-400">
        <span>
          Member since{" "}
          <span className="font-semibold text-zinc-300">{display.signupLabel}</span>
        </span>
        <span className="text-zinc-600" aria-hidden>
          ·
        </span>
        <span>
          {display.variant === "active"
            ? "Renews"
            : display.variant === "canceled_during_trial"
              ? "Access until"
              : "Trial ends"}{" "}
          <span className="font-semibold text-zinc-300">
            {display.variant === "active" && display.renewalLabel
              ? display.renewalLabel
              : display.trialEndsLabel}
          </span>
        </span>
      </div>
      {display.showSubscribeCta || display.showManageCta ? (
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#d4a853]">
          {display.showSubscribeCta ? "Subscribe now →" : "Manage subscription →"}
        </p>
      ) : null}
    </>
  );

  if (!display.showSubscribeCta && !display.showManageCta) {
    return (
      <section
        className="rounded-xl border border-[#d4a853]/35 bg-gradient-to-br from-[#d4a853]/10 via-[#181818] to-[#111111] px-3 py-3"
        aria-label="Subscription status"
      >
        {content}
      </section>
    );
  }

  return (
    <Link
      href="/subscribe"
      className="block rounded-xl border border-[#d4a853]/35 bg-gradient-to-br from-[#d4a853]/10 via-[#181818] to-[#111111] px-3 py-3 transition-colors hover:border-[#d4a853]/55 hover:bg-[#d4a853]/15"
      aria-label="Subscription status"
    >
      {content}
    </Link>
  );
}
