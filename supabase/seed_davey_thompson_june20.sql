-- Davey vs. Thompson — Mark Bateson Promotions, Batley Bulldogs Stadium (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000013-0013-4000-a000-000000000013','Davey vs. Thompson','Mark Bateson Promotions','Batley Bulldogs Stadium, Batley, UK','Europe/London','2026-06-20T16:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000099-0099-4000-b000-000000000099','e0000013-0013-4000-a000-000000000013','boxing','George Davey','David Thompson','10','Super Welterweight','1','2026-06-20T19:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000100-0100-4000-b000-000000000100','e0000013-0013-4000-a000-000000000013','boxing','Jack Marshall','Harry Edgecumbe','10','Lightweight','2','2026-06-20T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000101-0101-4000-b000-000000000101','e0000013-0013-4000-a000-000000000013','boxing','Nathan Shepherd','Joe Hardy','6','Middleweight','3','2026-06-20T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000102-0102-4000-b000-000000000102','e0000013-0013-4000-a000-000000000013','boxing','Ben Thompson','Dale Arrowsmith','6','Super Welterweight','4','2026-06-20T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000103-0103-4000-b000-000000000103','e0000013-0013-4000-a000-000000000013','boxing','Junaid Khan','Sam Kirk','4','Middleweight','5','2026-06-20T16:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000104-0104-4000-b000-000000000104','e0000013-0013-4000-a000-000000000013','boxing','Elliott Bridges','Josh Cook','4','Middleweight','6','2026-06-20T16:00:00.000Z','upcoming','fighterB','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000105-0105-4000-b000-000000000105','e0000013-0013-4000-a000-000000000013','boxing','Ryan Robinson','Owen Durnan','4','Super Lightweight','7','2026-06-20T16:00:00.000Z','upcoming','fighterB','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000106-0106-4000-b000-000000000106','e0000013-0013-4000-a000-000000000013','boxing','Kai Gale','Bahadur Karami','4','Super Middleweight','8','2026-06-20T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000107-0107-4000-b000-000000000107','e0000013-0013-4000-a000-000000000013','boxing','Henri Cooper','Jake Osgood','4','Welterweight','9','2026-06-20T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
