-- Garner vs. Magnesi — Queensberry Promotions, St Mary's Stadium Southampton (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000010-0010-4000-a000-000000000010','Garner vs. Magnesi','Queensberry Promotions','St Mary''s Stadium, Southampton, UK','Europe/London','2026-06-20T18:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000083-0083-4000-b000-000000000083','e0000010-0010-4000-a000-000000000010','boxing','Ryan Garner','Michael Magnesi','12','Super Featherweight','1','2026-06-20T21:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000084-0084-4000-b000-000000000084','e0000010-0010-4000-a000-000000000010','boxing','Brad Pauls','Bradley Goldsmith','10','Middleweight','2','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000085-0085-4000-b000-000000000085','e0000010-0010-4000-a000-000000000010','boxing','Lewis Edmondson','Lyndon Arthur','10','Light Heavyweight','3','2026-06-20T18:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000086-0086-4000-b000-000000000086','e0000010-0010-4000-a000-000000000010','boxing','Taylor Bevan','Ryszard Lewicki','8','Super Middleweight','4','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000087-0087-4000-b000-000000000087','e0000010-0010-4000-a000-000000000010','boxing','Lasha Guruli','Liam Dillon','8','Super Lightweight','5','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
