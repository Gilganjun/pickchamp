-- Webhook RPC grants (service role must execute claim/complete/fail functions)
grant execute on function public.claim_stripe_webhook_event(text, text) to service_role;
grant execute on function public.complete_stripe_webhook_event(text) to service_role;
grant execute on function public.fail_stripe_webhook_event(text, text) to service_role;
