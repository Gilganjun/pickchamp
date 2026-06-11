/** Visual trial template — billing not wired yet. Uses profile signup date for later reminders. */

export const TRIAL_LENGTH_MONTHS = 1;

export type TrialDisplayInfo = {
  signupDate: Date;
  trialEndsAt: Date;
  signupLabel: string;
  trialEndsLabel: string;
};

function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function formatTrialDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getTrialDisplayInfo(signupIso: string): TrialDisplayInfo {
  const signupDate = new Date(signupIso);
  const trialEndsAt = addCalendarMonths(signupDate, TRIAL_LENGTH_MONTHS);

  return {
    signupDate,
    trialEndsAt,
    signupLabel: formatTrialDate(signupDate),
    trialEndsLabel: formatTrialDate(trialEndsAt),
  };
}
