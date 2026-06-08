-- UFC Freedom 250 — correct favourite fields after odds cross-check (UFC.com / CBS).
-- Run if you already applied seed_ufc_freedom_250_june14.sql with the old favourites.
-- Safe to re-run.

update public.fights
set
  favourite_side = 'none',
  favourite_level = 'even',
  updated_at = now()
where id = 'f0000177-0177-4000-b000-000000000177'
  and (favourite_side <> 'none' or favourite_level <> 'even');

update public.fights
set
  favourite_side = 'fighterA',
  favourite_level = 'favourite',
  updated_at = now()
where id = 'f0000179-0179-4000-b000-000000000179'
  and favourite_side = 'fighterB';

update public.fights
set
  favourite_level = 'favourite',
  updated_at = now()
where id = 'f0000181-0181-4000-b000-000000000181'
  and favourite_level = 'heavy_favourite';
