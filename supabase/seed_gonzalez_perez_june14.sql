-- Gonzalez vs. Perez — Salita Promotions, GLC Live at 20 Monroe (14 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000008-0008-4000-a000-000000000008','Gonzalez vs. Perez','Salita Promotions','GLC Live at 20 Monroe, Grand Rapids, Michigan, USA','America/Detroit','2026-06-14T22:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000070-0070-4000-b000-000000000070','e0000008-0008-4000-a000-000000000008','boxing','Jonathan Gonzalez','Abraham R Perez','12','Flyweight','1','2026-06-15T03:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000071-0071-4000-b000-000000000071','e0000008-0008-4000-a000-000000000008','boxing','Joshua Pagan','Rodolfo Bustamante Salazar','10','Lightweight','2','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000072-0072-4000-b000-000000000072','e0000008-0008-4000-a000-000000000008','boxing','Troy Isley','Leonardo Di Stefano','10','Middleweight','3','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000073-0073-4000-b000-000000000073','e0000008-0008-4000-a000-000000000008','boxing','Brandon Moore','Donald Haynesworth','8','Heavyweight','4','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000074-0074-4000-b000-000000000074','e0000008-0008-4000-a000-000000000008','boxing','Bryant Jennings','Robert Simms','8','Heavyweight','5','2026-06-14T22:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000075-0075-4000-b000-000000000075','e0000008-0008-4000-a000-000000000008','boxing','Jaquan McElroy','Damian Munoz','6','Super Welterweight','6','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000076-0076-4000-b000-000000000076','e0000008-0008-4000-a000-000000000008','boxing','Sardius Simmons','Walter Burns','6','Heavyweight','7','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000077-0077-4000-b000-000000000077','e0000008-0008-4000-a000-000000000008','boxing','Lance Smith','Jovanis Rodriguez Pallares','4','Super Lightweight','8','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
