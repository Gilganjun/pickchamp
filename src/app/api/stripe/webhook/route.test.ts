import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  claimStripeWebhookEvent: vi.fn(),
  completeStripeWebhookEvent: vi.fn(),
  failStripeWebhookEvent: vi.fn(),
  updateSubscriptionFromStripe: vi.fn(),
  constructEvent: vi.fn(),
  retrieveSubscription: vi.fn(),
}));

vi.mock("@/lib/billing/stripeConfig", () => ({
  stripeEnabled: () => true,
  getStripeWebhookSecret: () => "whsec_test",
}));

vi.mock("@/lib/billing/stripeClient", () => ({
  getStripeClient: () => ({
    webhooks: { constructEvent: mocks.constructEvent },
    subscriptions: { retrieve: mocks.retrieveSubscription },
  }),
}));

vi.mock("@/lib/data/subscriptions", () => ({
  claimStripeWebhookEvent: mocks.claimStripeWebhookEvent,
  completeStripeWebhookEvent: mocks.completeStripeWebhookEvent,
  failStripeWebhookEvent: mocks.failStripeWebhookEvent,
  updateSubscriptionFromStripe: mocks.updateSubscriptionFromStripe,
  fetchSubscriptionByStripeCustomerId: vi.fn(),
  fetchSubscriptionByStripeSubscriptionId: vi.fn(),
}));

import { POST } from "@/app/api/stripe/webhook/route";

function makeRequest(body = "{}") {
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: {
      "stripe-signature": "sig_test",
      "content-type": "application/json",
    },
    body,
  });
}

describe("stripe webhook route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.constructEvent.mockReturnValue({
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: "user-1",
          customer: "cus_1",
          subscription: "sub_1",
          metadata: { user_id: "user-1" },
        },
      },
    });
    mocks.retrieveSubscription.mockResolvedValue({
      id: "sub_1",
      customer: "cus_1",
      status: "trialing",
      metadata: { user_id: "user-1" },
      trial_end: null,
      trial_start: null,
      current_period_end: 1_789_000_000,
      cancel_at_period_end: false,
    });
  });

  it("processes a first successful delivery", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("claimed");
    mocks.updateSubscriptionFromStripe.mockResolvedValue({});
    mocks.completeStripeWebhookEvent.mockResolvedValue(undefined);

    const response = await POST(makeRequest('{"id":"evt_1"}'));
    expect(response.status).toBe(200);
    expect(mocks.completeStripeWebhookEvent).toHaveBeenCalledWith("evt_1");
    expect(mocks.failStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("skips duplicate completed deliveries", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("duplicate");

    const response = await POST(makeRequest('{"id":"evt_1"}'));
    expect(response.status).toBe(200);
    expect(mocks.updateSubscriptionFromStripe).not.toHaveBeenCalled();
    expect(mocks.completeStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("marks failed processing and returns 500 for Stripe retries", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("claimed");
    mocks.updateSubscriptionFromStripe.mockRejectedValue(new Error("db failed"));
    mocks.failStripeWebhookEvent.mockResolvedValue(undefined);

    const response = await POST(makeRequest('{"id":"evt_1"}'));
    expect(response.status).toBe(500);
    expect(mocks.failStripeWebhookEvent).toHaveBeenCalledWith("evt_1", "db failed");
    expect(mocks.completeStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("processes a claimed retry after a previous failure", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("claimed");
    mocks.updateSubscriptionFromStripe.mockResolvedValue({});
    mocks.completeStripeWebhookEvent.mockResolvedValue(undefined);

    const response = await POST(makeRequest('{"id":"evt_retry"}'));
    expect(response.status).toBe(200);
    expect(mocks.claimStripeWebhookEvent).toHaveBeenCalledWith(
      "evt_1",
      "checkout.session.completed"
    );
  });

  it("returns busy when another worker already owns recent processing", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("busy");

    const response = await POST(makeRequest('{"id":"evt_1"}'));
    expect(response.status).toBe(200);
    expect(mocks.updateSubscriptionFromStripe).not.toHaveBeenCalled();
    expect(mocks.completeStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("processes successfully after a stale processing reclaim", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("claimed");
    mocks.updateSubscriptionFromStripe.mockResolvedValue({});
    mocks.completeStripeWebhookEvent.mockResolvedValue(undefined);

    const response = await POST(makeRequest('{"id":"evt_stale"}'));
    expect(response.status).toBe(200);
    expect(mocks.updateSubscriptionFromStripe).toHaveBeenCalled();
    expect(mocks.completeStripeWebhookEvent).toHaveBeenCalledWith("evt_1");
  });

  it("rejects invalid signatures", async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error("invalid");
    });

    const response = await POST(makeRequest('{"id":"evt_1"}'));
    expect(response.status).toBe(400);
    expect(mocks.claimStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("uses the raw request body for signature verification", async () => {
    mocks.claimStripeWebhookEvent.mockResolvedValue("duplicate");
    const rawBody = '{"id":"evt_raw"}';

    await POST(makeRequest(rawBody));

    expect(mocks.constructEvent).toHaveBeenCalledWith(
      rawBody,
      "sig_test",
      "whsec_test"
    );
  });
});
