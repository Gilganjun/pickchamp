/**
 * One-time billing deploy helper (sandbox/test mode).
 *
 * Prerequisites in .env.local (gitignored):
 *   STRIPE_SECRET_KEY=sk_test_...
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *
 * Optional overrides:
 *   STRIPE_PRICE_ID, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL
 *
 * Usage: node scripts/setup-billing-vercel.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_LOCAL = resolve(ROOT, ".env.local");

const DEFAULTS = {
  STRIPE_PRICE_ID: "price_1TiTIpEZO2o1qInth1mLchpr",
  NEXT_PUBLIC_APP_URL: "https://pickfist.com",
  PICKFIST_SUBSCRIPTION_PRICE_LABEL: "$1.99/month",
};

const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL)) return {};
  const env = {};
  for (const line of readFileSync(ENV_LOCAL, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function getEnv(key) {
  return process.env[key] ?? loadEnvLocal()[key] ?? DEFAULTS[key];
}

function assertTestKey(name, value) {
  if (!value?.startsWith("sk_test_") && !value?.startsWith("pk_test_")) {
    throw new Error(`${name} must be a Stripe test key (sk_test_ / pk_test_)`);
  }
}

function vercelEnvAdd(name, value, environments = ["production", "preview"]) {
  for (const env of environments) {
    console.log(`Setting Vercel ${env}: ${name}`);
    execSync(`npx vercel env add ${name} ${env} --force`, {
      cwd: ROOT,
      input: value,
      stdio: ["pipe", "inherit", "inherit"],
    });
  }
}

async function ensureWebhook(stripe, url) {
  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = existing.data.find((ep) => ep.url === url);
  if (match) {
    console.log(`Webhook already exists: ${match.id}`);
    return match;
  }

  console.log(`Creating webhook endpoint: ${url}`);
  return stripe.webhookEndpoints.create({
    url,
    enabled_events: WEBHOOK_EVENTS,
    description: "PickFist billing v1",
  });
}

async function main() {
  const secretKey = getEnv("STRIPE_SECRET_KEY");
  const publishableKey = getEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const priceId = getEnv("STRIPE_PRICE_ID");
  const appUrl = getEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/, "");
  const priceLabel = getEnv("PICKFIST_SUBSCRIPTION_PRICE_LABEL");

  if (!secretKey || !publishableKey) {
    console.error(
      "Missing STRIPE_SECRET_KEY or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local"
    );
    process.exit(1);
  }

  assertTestKey("STRIPE_SECRET_KEY", secretKey);
  assertTestKey("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", publishableKey);

  const stripe = new Stripe(secretKey);
  const price = await stripe.prices.retrieve(priceId);
  if (price.livemode) {
    throw new Error("Refusing live-mode Stripe keys — use sk_test_ / pk_test_ only");
  }
  console.log(`Verified sandbox price: ${price.id} (${price.currency})`);

  const webhookUrl = `${appUrl}/api/stripe/webhook`;
  let webhookSecret = getEnv("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret?.startsWith("whsec_")) {
    const endpoint = await ensureWebhook(stripe, webhookUrl);
    webhookSecret = endpoint.secret;
    if (!webhookSecret) {
      throw new Error(
        "Webhook created but secret missing — copy whsec_ from Stripe Dashboard → Developers → Webhooks"
      );
    }
    console.log(`Webhook secret obtained for ${endpoint.id}`);
  }

  vercelEnvAdd("STRIPE_SECRET_KEY", secretKey);
  vercelEnvAdd("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", publishableKey);
  vercelEnvAdd("STRIPE_PRICE_ID", priceId);
  vercelEnvAdd("STRIPE_WEBHOOK_SECRET", webhookSecret);
  vercelEnvAdd("NEXT_PUBLIC_APP_URL", appUrl);
  vercelEnvAdd("PICKFIST_SUBSCRIPTION_PRICE_LABEL", priceLabel);

  console.log("\nDone. Redeploy production:");
  console.log("  npx vercel --prod --yes");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
