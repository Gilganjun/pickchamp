-- PickFist MVP Schema
-- Apply in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_initials text,
  global_rating integer not null default 1000,
  boxing_rating integer not null default 1000,
  mma_rating integer not null default 1000,
  total_picks integer not null default 0,
  total_correct integer not null default 0,
  boxing_picks integer not null default 0,
  boxing_correct integer not null default 0,
  mma_picks integer not null default 0,
  mma_correct integer not null default 0,
  perfect_picks integer not null default 0,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  promotion text,
  location text,
  timezone text,
  event_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fights
create table if not exists public.fights (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  sport text not null check (sport in ('boxing', 'mma')),
  fighter_a_name text not null,
  fighter_b_name text not null,
  scheduled_rounds integer not null check (scheduled_rounds > 0),
  weight_class text,
  fight_order integer,
  lock_time timestamptz not null,
  status text not null default 'upcoming' check (
    status in ('upcoming', 'locked', 'result_pending', 'settled', 'cancelled', 'no_contest')
  ),
  favourite_side text not null default 'none' check (
    favourite_side in ('fighterA', 'fighterB', 'none')
  ),
  favourite_level text not null default 'even' check (
    favourite_level in ('heavy_favourite', 'favourite', 'even')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fights_favourite_consistency check (
    (favourite_side = 'none' and favourite_level = 'even')
    or
    (favourite_side in ('fighterA', 'fighterB') and favourite_level in ('favourite', 'heavy_favourite'))
  )
);

create index if not exists fights_event_id_idx on public.fights(event_id);
create index if not exists fights_status_idx on public.fights(status);
create index if not exists fights_lock_time_idx on public.fights(lock_time);

-- Predictions
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  fight_id uuid not null references public.fights(id) on delete cascade,
  predicted_outcome text not null check (
    predicted_outcome in ('fighterA', 'fighterB', 'draw')
  ),
  predicted_method text check (
    predicted_method in (
      'decision', 'ko_tko', 'submission', 'dq', 'technical_decision', 'draw'
    )
  ),
  predicted_round integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked_at timestamptz,
  graded_at timestamptz,
  rating_change integer,
  main_correct boolean,
  method_correct boolean,
  round_correct boolean,
  perfect_pick boolean,
  grading_details jsonb,
  unique (user_id, fight_id)
);

create index if not exists predictions_fight_id_idx on public.predictions(fight_id);
create index if not exists predictions_user_id_idx on public.predictions(user_id);

-- Fight results
create table if not exists public.fight_results (
  id uuid primary key default gen_random_uuid(),
  fight_id uuid not null unique references public.fights(id) on delete cascade,
  outcome text not null check (
    outcome in ('fighterA', 'fighterB', 'draw', 'no_contest', 'cancelled')
  ),
  method text not null check (
    method in (
      'decision', 'ko_tko', 'submission', 'dq', 'technical_decision',
      'draw', 'no_contest', 'cancelled'
    )
  ),
  result_round integer,
  official_notes text,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Rating history
create table if not exists public.rating_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  fight_id uuid not null references public.fights(id) on delete cascade,
  sport text not null check (sport in ('boxing', 'mma')),
  old_global_rating integer not null,
  new_global_rating integer not null,
  old_sport_rating integer not null,
  new_sport_rating integer not null,
  rating_change integer not null,
  reason jsonb not null,
  created_at timestamptz not null default now()
);

-- Grading runs
create table if not exists public.grading_runs (
  id uuid primary key default gen_random_uuid(),
  fight_id uuid not null references public.fights(id) on delete cascade,
  total_predictions integer not null,
  fighter_a_pick_count integer not null default 0,
  fighter_b_pick_count integer not null default 0,
  draw_pick_count integer not null default 0,
  result_summary jsonb not null,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    upper(left(coalesce(new.raw_user_meta_data->>'username', 'U'), 2))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.fights enable row level security;
alter table public.predictions enable row level security;
alter table public.fight_results enable row level security;
alter table public.rating_history enable row level security;
alter table public.grading_runs enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Events are viewable by everyone"
  on public.events for select using (true);

create policy "Fights are viewable by everyone"
  on public.fights for select using (true);

create policy "Predictions viewable by everyone"
  on public.predictions for select using (true);

create policy "Users insert own predictions"
  on public.predictions for insert with check (auth.uid() = user_id);

create policy "Users update own predictions"
  on public.predictions for update using (auth.uid() = user_id);

create policy "Fight results viewable by everyone"
  on public.fight_results for select using (true);

create policy "Rating history viewable by everyone"
  on public.rating_history for select using (true);

create policy "Grading runs viewable by everyone"
  on public.grading_runs for select using (true);

-- Table grants (required for anon/authenticated API access with RLS)
grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.events to anon, authenticated;
grant select on public.fights to anon, authenticated;
grant select on public.predictions to anon, authenticated;
grant select on public.fight_results to anon, authenticated;
grant select on public.rating_history to anon, authenticated;
grant select on public.grading_runs to anon, authenticated;

grant insert, update on public.profiles to authenticated;
grant insert, update on public.predictions to authenticated;

-- Admin writes use service role in server actions (bypass RLS)
