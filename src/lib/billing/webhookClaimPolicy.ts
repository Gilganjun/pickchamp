/** Matches claim_stripe_webhook_event stale threshold in SQL. */
export const WEBHOOK_STALE_PROCESSING_MS = 5 * 60 * 1000;

export type WebhookEventRecordStatus = "processing" | "completed" | "failed";

export type WebhookEventRecord = {
  status: WebhookEventRecordStatus;
  updatedAt: Date;
};

export type WebhookClaimResult = "claimed" | "duplicate" | "busy";

/**
 * Pure policy mirror of claim_stripe_webhook_event (existing row paths).
 * First delivery (no row) is always claimed via INSERT in SQL.
 */
export function resolveWebhookClaimForExistingRow(
  existing: WebhookEventRecord,
  now: Date,
  staleMs = WEBHOOK_STALE_PROCESSING_MS
): WebhookClaimResult {
  if (existing.status === "completed") {
    return "duplicate";
  }

  if (existing.status === "failed") {
    return "claimed";
  }

  const ageMs = now.getTime() - existing.updatedAt.getTime();
  if (ageMs < staleMs) {
    return "busy";
  }

  return "claimed";
}

/** Handlers must overwrite Stripe fields — safe to rerun after stale reclaim. */
export const WEBHOOK_HANDLER_IDEMPOTENCY_NOTE =
  "Subscription webhook handlers upsert the latest Stripe subscription state.";
