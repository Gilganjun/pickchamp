-- Back II The Future — Bey Bros Promotions, Goodyear Hall Akron (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000016-0016-4000-a000-000000000016','Back II The Future','Bey Bros Promotions','Goodyear Local 18282 Hall, Akron, Ohio, USA','America/New_York','2026-06-20T22:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000126-0126-4000-b000-000000000126','e0000016-0016-4000-a000-000000000016','boxing','Mickey Bey','Alexander Espinoza','10','Super Featherweight','1','2026-06-21T01:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000127-0127-4000-b000-000000000127','e0000016-0016-4000-a000-000000000016','boxing','Lamont Elmano Quarterman','James Martin','6','Super Middleweight','2','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000128-0128-4000-b000-000000000128','e0000016-0016-4000-a000-000000000016','boxing','Brandon Vega','Benji Gomez','6','Super Lightweight','3','2026-06-20T22:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000129-0129-4000-b000-000000000129','e0000016-0016-4000-a000-000000000016','boxing','Kingdamon Antoine','Angel Hernandez Pillado','6','Super Featherweight','4','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000130-0130-4000-b000-000000000130','e0000016-0016-4000-a000-000000000016','boxing','Charles Pugh','Giovanni Sarran','4','Cruiserweight','5','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000131-0131-4000-b000-000000000131','e0000016-0016-4000-a000-000000000016','boxing','Zahhier Fox','Don Linwood Stewart','4','Super Featherweight','6','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
