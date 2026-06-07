-- Misfits 23 — Fury vs. Hall: Beauty vs. The Beast (13 Jun 2026)
-- Run on an EXISTING production database (seed_launch.sql already applied).
-- Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000004-0004-4000-a000-000000000004','Fury vs. Hall: Beauty vs. The Beast','Misfits Boxing','AO Arena, Manchester, UK','Europe/London','2026-06-13T17:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000031-0031-4000-b000-000000000031','e0000004-0004-4000-a000-000000000004','boxing','Tommy Fury','Eddie Hall','6','Heavyweight','1','2026-06-13T20:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000032-0032-4000-b000-000000000032','e0000004-0004-4000-a000-000000000004','boxing','Anthony Taylor','Matt Floyd','5','Light Heavyweight','2','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000033-0033-4000-b000-000000000033','e0000004-0004-4000-a000-000000000004','boxing','Brandon Scott','Brendon Davis','6','Middleweight','3','2026-06-13T17:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000034-0034-4000-b000-000000000034','e0000004-0004-4000-a000-000000000004','boxing','Charlie Cox','Baffour Boateng','6','Cruiserweight','4','2026-06-13T17:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000035-0035-4000-b000-000000000035','e0000004-0004-4000-a000-000000000004','boxing','Jack Kay','Jordan McCann','6','Middleweight','5','2026-06-13T17:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000036-0036-4000-b000-000000000036','e0000004-0004-4000-a000-000000000004','boxing','Jade Jones','Federica Riccio','6','Women''s Cruiserweight','6','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000037-0037-4000-b000-000000000037','e0000004-0004-4000-a000-000000000004','boxing','Adam Brooks','Rahim Amer','6','Light Heavyweight','7','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000038-0038-4000-b000-000000000038','e0000004-0004-4000-a000-000000000004','boxing','Arabella Amblea Del Busso','Andy Nguyen','6','Women''s Middleweight','8','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000039-0039-4000-b000-000000000039','e0000004-0004-4000-a000-000000000004','boxing','Sheena Bathory','Christina Flanagan','6','Women''s Lightweight','9','2026-06-13T17:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000040-0040-4000-b000-000000000040','e0000004-0004-4000-a000-000000000004','boxing','Abdel Karim El-Madani','Luke Nevin','6','Light Heavyweight','10','2026-06-13T17:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
