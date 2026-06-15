import { formatTrialDate, computeTrialWindow } from "@/lib/billing/trialDates";

export { TRIAL_LENGTH_MONTHS } from "@/lib/billing/trialDates";

export type TrialDisplayInfo = {
  signupDate: Date;
  trialEndsAt: Date;
  signupLabel: string;
  trialEndsLabel: string;
};

/** @deprecated Prefer getSubscriptionDisplayInfo with a Subscription row. */
export function getTrialDisplayInfo(signupIso: string): TrialDisplayInfo {
  const { trialStartedAt, trialEndsAt } = computeTrialWindow(signupIso);
  return {
    signupDate: trialStartedAt,
    trialEndsAt,
    signupLabel: formatTrialDate(trialStartedAt),
    trialEndsLabel: formatTrialDate(trialEndsAt),
  };
}

export { formatTrialDate } from "@/lib/billing/trialDates";
