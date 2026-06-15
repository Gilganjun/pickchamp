import {
  formatTrialDate,
  computeTrialWindow,
} from "@/lib/billing/trialDates";
import {
  hasScheduledBilling,
  isCanceledDuringTrial,
  isTrialing,
  isWithinTrialPeriod,
} from "@/lib/billing/subscriptionEntitlement";
import type { Subscription } from "@/types";

export type SubscriptionCardVariant =
  | "trialing"
  | "trialing_scheduled"
  | "active"
  | "canceled_during_trial"
  | "past_due"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused"
  | "trial_expired";

export type SubscriptionDisplayInfo = {
  variant: SubscriptionCardVariant;
  signupLabel: string;
  trialEndsLabel: string;
  trialEndsAt: Date;
  renewalLabel: string | null;
  showSubscribeCta: boolean;
  showManageCta: boolean;
  headline: string;
  subline: string | null;
  billingStartsImmediately: boolean;
};

function fromSubscription(subscription: Subscription): SubscriptionDisplayInfo {
  const trialStartedAt = new Date(subscription.trial_started_at);
  const trialEndsAt = new Date(subscription.trial_ends_at);
  const signupLabel = formatTrialDate(trialStartedAt);
  const trialEndsLabel = formatTrialDate(trialEndsAt);
  const withinTrial = isWithinTrialPeriod(subscription);
  const scheduled = hasScheduledBilling(subscription);
  const renewalLabel = subscription.current_period_end
    ? formatTrialDate(new Date(subscription.current_period_end))
    : trialEndsLabel;

  if (isCanceledDuringTrial(subscription)) {
    return {
      variant: "canceled_during_trial",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel: null,
      showSubscribeCta: false,
      showManageCta: true,
      headline: "Subscription canceled",
      subline: `Access continues until ${trialEndsLabel}. You will not be charged.`,
      billingStartsImmediately: false,
    };
  }

  if (subscription.status === "incomplete") {
    return {
      variant: "incomplete",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel,
      showSubscribeCta: false,
      showManageCta: Boolean(subscription.stripe_customer_id),
      headline: "Subscription setup incomplete",
      subline: "Finish payment setup to activate unlimited picks.",
      billingStartsImmediately: false,
    };
  }

  if (subscription.status === "incomplete_expired") {
    return {
      variant: "incomplete_expired",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel: null,
      showSubscribeCta: true,
      showManageCta: false,
      headline: "Subscription setup expired",
      subline: "Subscribe again to activate unlimited picks.",
      billingStartsImmediately: false,
    };
  }

  if (subscription.status === "paused") {
    return {
      variant: "paused",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel,
      showSubscribeCta: false,
      showManageCta: true,
      headline: "Subscription paused",
      subline: "Manage billing to resume unlimited picks.",
      billingStartsImmediately: false,
    };
  }

  if (subscription.status === "active") {
    return {
      variant: "active",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel,
      showSubscribeCta: false,
      showManageCta: true,
      headline: "Unlimited picks",
      subline: `Renews ${renewalLabel}`,
      billingStartsImmediately: false,
    };
  }

  if (subscription.status === "past_due") {
    return {
      variant: "past_due",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel,
      showSubscribeCta: false,
      showManageCta: true,
      headline: "Payment issue",
      subline: "Update your payment method to keep unlimited picks.",
      billingStartsImmediately: false,
    };
  }

  if (subscription.status === "unpaid") {
    return {
      variant: "unpaid",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel,
      showSubscribeCta: true,
      showManageCta: Boolean(subscription.stripe_customer_id),
      headline: "Subscription unpaid",
      subline: "Update billing or subscribe again to restore unlimited picks.",
      billingStartsImmediately: false,
    };
  }

  if (withinTrial && scheduled && isTrialing(subscription)) {
    return {
      variant: "trialing_scheduled",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel: trialEndsLabel,
      showSubscribeCta: false,
      showManageCta: true,
      headline: "1 Month Free Trial · Unlimited picks",
      subline: `Your free trial continues until ${trialEndsLabel}. You will not be charged before then.`,
      billingStartsImmediately: false,
    };
  }

  if (withinTrial) {
    return {
      variant: "trialing",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel: null,
      showSubscribeCta: true,
      showManageCta: false,
      headline: "1 Month Free Trial · Unlimited picks",
      subline: `Your free trial continues until ${trialEndsLabel}. You will not be charged before then.`,
      billingStartsImmediately: false,
    };
  }

  return {
    variant: "trial_expired",
    signupLabel,
    trialEndsLabel,
    trialEndsAt,
    renewalLabel: null,
    showSubscribeCta: true,
    showManageCta: Boolean(subscription.stripe_customer_id),
    headline: "Trial ended",
    subline: "Your free trial has ended. Your subscription will begin today.",
    billingStartsImmediately: true,
  };
}

function fromSignupDate(signupIso: string): SubscriptionDisplayInfo {
  const { trialStartedAt, trialEndsAt } = computeTrialWindow(signupIso);
  const signupLabel = formatTrialDate(trialStartedAt);
  const trialEndsLabel = formatTrialDate(trialEndsAt);
  const withinTrial = trialEndsAt.getTime() > Date.now();

  if (withinTrial) {
    return {
      variant: "trialing",
      signupLabel,
      trialEndsLabel,
      trialEndsAt,
      renewalLabel: null,
      showSubscribeCta: true,
      showManageCta: false,
      headline: "1 Month Free Trial · Unlimited picks",
      subline: `Your free trial continues until ${trialEndsLabel}. You will not be charged before then.`,
      billingStartsImmediately: false,
    };
  }

  return {
    variant: "trial_expired",
    signupLabel,
    trialEndsLabel,
    trialEndsAt,
    renewalLabel: null,
    showSubscribeCta: true,
    showManageCta: false,
    headline: "Trial ended",
    subline: "Your free trial has ended. Your subscription will begin today.",
    billingStartsImmediately: true,
  };
}

export function getSubscriptionDisplayInfo(
  subscription: Subscription | null | undefined,
  signupIso: string
): SubscriptionDisplayInfo {
  if (subscription) {
    return fromSubscription(subscription);
  }
  return fromSignupDate(signupIso);
}
