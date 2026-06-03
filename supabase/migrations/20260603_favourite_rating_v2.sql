-- V2 difficulty-based rating: favourite_side + favourite_level
-- Run on existing databases that already have fights table without these columns

alter table public.fights
  add column if not exists favourite_side text not null default 'none',
  add column if not exists favourite_level text not null default 'even';

alter table public.fights
  drop constraint if exists fights_favourite_side_check;

alter table public.fights
  add constraint fights_favourite_side_check
  check (favourite_side in ('fighterA', 'fighterB', 'none'));

alter table public.fights
  drop constraint if exists fights_favourite_level_check;

alter table public.fights
  add constraint fights_favourite_level_check
  check (favourite_level in ('heavy_favourite', 'favourite', 'even'));

alter table public.fights
  drop constraint if exists fights_favourite_consistency;

alter table public.fights
  add constraint fights_favourite_consistency check (
    (favourite_side = 'none' and favourite_level = 'even')
    or
    (favourite_side in ('fighterA', 'fighterB') and favourite_level in ('favourite', 'heavy_favourite'))
  );
