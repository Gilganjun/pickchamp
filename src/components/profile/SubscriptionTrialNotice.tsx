import { getTrialDisplayInfo } from "@/lib/billing/trialDisplay";
import type { Profile } from "@/types";

interface SubscriptionTrialNoticeProps {
  profile: Profile;
}

export function SubscriptionTrialNotice({ profile }: SubscriptionTrialNoticeProps) {
  const trial = getTrialDisplayInfo(profile.created_at);

  return (
    <section
      className="rounded-xl border border-[#d4a853]/35 bg-gradient-to-br from-[#d4a853]/10 via-[#181818] to-[#111111] px-3 py-3"
      aria-label="Subscription status"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d4a853]/80">
        Subscription type
      </p>
      <p className="mt-1 font-[family-name:var(--font-teko)] text-xl font-bold uppercase leading-tight tracking-wide text-white">
        1 Month Free Trial
        <span className="mx-1.5 text-[#d4a853]">·</span>
        <span className="text-[#d4a853]">Unlimited picks</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-400">
        <span>
          Member since{" "}
          <span className="font-semibold text-zinc-300">{trial.signupLabel}</span>
        </span>
        <span className="text-zinc-600" aria-hidden>
          ·
        </span>
        <span>
          Trial ends{" "}
          <span className="font-semibold text-zinc-300">{trial.trialEndsLabel}</span>
        </span>
      </div>
    </section>
  );
}
