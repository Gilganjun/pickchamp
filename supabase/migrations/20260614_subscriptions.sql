-- Subscription entitlement + Stripe sync (billing v1 — no pick enforcement yet)
-- Safe to rerun: uses IF NOT EXISTS, guarded policies, and idempotent backfill.

create table if not exists public.subscriptions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'trialing'
    check (status in (
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused'
    )),
  trial_started_at timestamptz not null,
  trial_ends_at timestamptz not null,
  checkout_trial_adjusted_at timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions
  add column if not exists checkout_trial_adjusted_at timestamptz;

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- Stripe webhook processing with explicit state
create table if not exists public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  status text not null default 'processing'
    check (status in ('processing', 'completed', 'failed')),
  attempt_count integer not null default 1,
  last_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stripe_webhook_events
  add column if not exists status text default 'processing';

alter table public.stripe_webhook_events
  add column if not exists attempt_count integer default 1;

alter table public.stripe_webhook_events
  add column if not exists last_error text;

alter table public.stripe_webhook_events
  add column if not exists processed_at timestamptz;

alter table public.stripe_webhook_events
  add column if not exists created_at timestamptz default now();

alter table public.stripe_webhook_events
  add column if not exists updated_at timestamptz default now();

-- Backfill trial entitlement for existing profiles (one-time, idempotent)
insert into public.subscriptions (user_id, status, trial_started_at, trial_ends_at)
select
  p.id,
  'trialing',
  p.created_at,
  p.created_at + interval '1 month'
from public.profiles p
where not exists (
  select 1 from public.subscriptions s where s.user_id = p.id
);

-- Auto-create subscription row when a profile is created
create or replace function public.handle_new_profile_subscription()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.subscriptions (user_id, status, trial_started_at, trial_ends_at)
  values (NEW.id, 'trialing', NEW.created_at, NEW.created_at + interval '1 month')
  on conflict (user_id) do nothing;
  return NEW;
end;
$$;

drop trigger if exists on_profile_created_subscription on public.profiles;
create trigger on_profile_created_subscription
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile_subscription();

-- Atomic webhook claim: claimed | duplicate | busy
-- Stale processing rows (>5 minutes) are reclaimed for crash recovery.
create or replace function public.claim_stripe_webhook_event(
  p_event_id text,
  p_event_type text
)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_stale interval := interval '5 minutes';
  v_status text;
begin
  insert into public.stripe_webhook_events (id, event_type, status, attempt_count)
  values (p_event_id, p_event_type, 'processing', 1)
  on conflict (id) do nothing;

  if found then
    return 'claimed';
  end if;

  update public.stripe_webhook_events
  set
    status = 'processing',
    event_type = p_event_type,
    attempt_count = attempt_count + 1,
    last_error = null,
    updated_at = now()
  where id = p_event_id
    and status = 'failed';

  if found then
    return 'claimed';
  end if;

  update public.stripe_webhook_events
  set
    status = 'processing',
    event_type = p_event_type,
    attempt_count = attempt_count + 1,
    last_error = null,
    updated_at = now()
  where id = p_event_id
    and status = 'processing'
    and updated_at <= now() - v_stale;

  if found then
    return 'claimed';
  end if;

  select status into v_status
  from public.stripe_webhook_events
  where id = p_event_id;

  if v_status = 'completed' then
    return 'duplicate';
  end if;

  return 'busy';
end;
$$;

create or replace function public.complete_stripe_webhook_event(p_event_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.stripe_webhook_events
  set
    status = 'completed',
    processed_at = now(),
    updated_at = now(),
    last_error = null
  where id = p_event_id;
end;
$$;

create or replace function public.fail_stripe_webhook_event(
  p_event_id text,
  p_error text
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.stripe_webhook_events
  set
    status = 'failed',
    last_error = left(p_error, 2000),
    updated_at = now()
  where id = p_event_id;
end;
$$;

alter table public.subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

grant select on public.subscriptions to authenticated;

grant execute on function public.claim_stripe_webhook_event(text, text) to service_role;
grant execute on function public.complete_stripe_webhook_event(text) to service_role;
grant execute on function public.fail_stripe_webhook_event(text, text) to service_role;

-- Writes via service role only (Checkout + webhooks)
