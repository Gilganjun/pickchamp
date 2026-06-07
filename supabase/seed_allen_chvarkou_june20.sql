-- Allen vs. Chvarkou — White Rhino Boxing, Magna Centre Rotherham (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000014-0014-4000-a000-000000000014','Allen vs. Chvarkou','White Rhino Boxing','Magna Centre, Rotherham, UK','Europe/London','2026-06-20T18:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000108-0108-4000-b000-000000000108','e0000014-0014-4000-a000-000000000014','boxing','David Allen','Viktar Chvarkou','4','Heavyweight','1','2026-06-20T20:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000109-0109-4000-b000-000000000109','e0000014-0014-4000-a000-000000000014','boxing','Gideon Anaba','Tom Ramsden','4','Light Heavyweight','2','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000110-0110-4000-b000-000000000110','e0000014-0014-4000-a000-000000000014','boxing','Charlie Ellis','Liam McElhinney','4','Super Welterweight','3','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000111-0111-4000-b000-000000000111','e0000014-0014-4000-a000-000000000014','boxing','Shae Gowler','Fonz Alexander','4','Welterweight','4','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000112-0112-4000-b000-000000000112','e0000014-0014-4000-a000-000000000014','boxing','Liam Carrigan','Naeem Ali','4','Welterweight','5','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000113-0113-4000-b000-000000000113','e0000014-0014-4000-a000-000000000014','boxing','Elias Sinani','Kasey Bradnum','4','Super Lightweight','6','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
