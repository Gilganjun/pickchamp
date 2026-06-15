export function stripeEnabled(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_PRICE_ID?.trim() &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );
}

export function getStripePriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID is not configured");
  }
  return priceId;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return secret;
}

/** Display price for subscribe page — override via env if needed. */
export function getSubscriptionPriceLabel(): string {
  return process.env.PICKFIST_SUBSCRIPTION_PRICE_LABEL?.trim() ?? "$1.99/month";
}
