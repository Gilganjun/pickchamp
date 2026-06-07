-- King of the West — Toro Promotions, Celebrity Theater Phoenix (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000015-0015-4000-a000-000000000015','King of the West','Toro Promotions','Celebrity Theater, Phoenix, Arizona, USA','America/Phoenix','2026-06-21T00:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000114-0114-4000-b000-000000000114','e0000015-0015-4000-a000-000000000015','boxing','Kingsley Ibeh','Dante Stone','10','Heavyweight','1','2026-06-21T04:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000115-0115-4000-b000-000000000115','e0000015-0015-4000-a000-000000000015','boxing','Elijah Garcia','Ryan Adams','8','Super Middleweight','2','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000116-0116-4000-b000-000000000116','e0000015-0015-4000-a000-000000000015','boxing','Adam Stewart','Desmond Thompson','6','Heavyweight','3','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000117-0117-4000-b000-000000000117','e0000015-0015-4000-a000-000000000015','boxing','Brayan Gonzalez','Carlos Mujica','6','Featherweight','4','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000118-0118-4000-b000-000000000118','e0000015-0015-4000-a000-000000000015','boxing','Pedro Valencia','Pedro Pinillo','6','Super Lightweight','5','2026-06-21T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000119-0119-4000-b000-000000000119','e0000015-0015-4000-a000-000000000015','boxing','Sergio Leon Rodriguez','Antonio Louis Hernandez','6','Light Heavyweight','6','2026-06-21T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000120-0120-4000-b000-000000000120','e0000015-0015-4000-a000-000000000015','boxing','Narek Hovhannisyan','Diuhl Olguin','6','Lightweight','7','2026-06-21T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000121-0121-4000-b000-000000000121','e0000015-0015-4000-a000-000000000015','boxing','Angel Lainez','Javier Arroyo','4','Heavyweight','8','2026-06-21T00:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000122-0122-4000-b000-000000000122','e0000015-0015-4000-a000-000000000015','boxing','Solomon Buchanan','Lucus Griego','4','Cruiserweight','9','2026-06-21T00:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000123-0123-4000-b000-000000000123','e0000015-0015-4000-a000-000000000015','boxing','Rahman Muhammad','Daryus Cotton','4','Super Welterweight','10','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000124-0124-4000-b000-000000000124','e0000015-0015-4000-a000-000000000015','boxing','Adam Lopez','Jamal Johnson','4','Super Lightweight','11','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000125-0125-4000-b000-000000000125','e0000015-0015-4000-a000-000000000015','boxing','Trevor Kotara','Jalen Davis','4','Heavyweight','12','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
