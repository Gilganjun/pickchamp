-- York Hall — Hawley vs. Steward (13 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000005-0005-4000-a000-000000000005','Hawley vs. Steward','Warren Boxing Management','York Hall, Bethnal Green, London, UK','Europe/London','2026-06-13T16:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000041-0041-4000-b000-000000000041','e0000005-0005-4000-a000-000000000005','boxing','James Hawley','Ellis Steward','10','Super Middleweight','1','2026-06-13T19:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000042-0042-4000-b000-000000000042','e0000005-0005-4000-a000-000000000005','boxing','Abnor Jashari','Marley Mason','10','Super Featherweight','2','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000043-0043-4000-b000-000000000043','e0000005-0005-4000-a000-000000000005','boxing','Dean Gardner','Joseph Butler','10','Super Lightweight','3','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000044-0044-4000-b000-000000000044','e0000005-0005-4000-a000-000000000005','boxing','Hamzah Butt','Amar Kayani','8','Welterweight','4','2026-06-13T16:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000045-0045-4000-b000-000000000045','e0000005-0005-4000-a000-000000000005','boxing','Jesse Brandon','James Gardiner','8','Welterweight','5','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000046-0046-4000-b000-000000000046','e0000005-0005-4000-a000-000000000005','boxing','Alfie Gaskin','Robbie Chapman','6','Super Middleweight','6','2026-06-13T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000047-0047-4000-b000-000000000047','e0000005-0005-4000-a000-000000000005','boxing','Hamza Mehmood','Diego Tananta','6','Super Bantamweight','7','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000048-0048-4000-b000-000000000048','e0000005-0005-4000-a000-000000000005','boxing','Khalid Ali','Connor Meanwell','6','Super Welterweight','8','2026-06-13T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000049-0049-4000-b000-000000000049','e0000005-0005-4000-a000-000000000005','boxing','Freddie Ketteringham','Naeem Ali','4','Super Welterweight','9','2026-06-13T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
