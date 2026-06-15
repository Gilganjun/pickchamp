-- Service-role grants for webhook + billing writes (idempotent).
-- Without these, webhooks fail with: permission denied for table subscriptions

grant usage on schema public to service_role;

grant select, insert, update, delete
on table public.subscriptions
to service_role;

grant select, insert, update, delete
on table public.stripe_webhook_events
to service_role;

grant execute on function public.claim_stripe_webhook_event(text, text)
to service_role;

grant execute on function public.complete_stripe_webhook_event(text)
to service_role;

grant execute on function public.fail_stripe_webhook_event(text, text)
to service_role;
