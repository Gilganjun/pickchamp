import Stripe from "stripe";
import { stripeEnabled } from "@/lib/billing/stripeConfig";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeEnabled()) {
    throw new Error("Stripe is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  return stripeClient;
}
