-- Bibby vs. Walsh — St Andrew's Sporting Club, DoubleTree Hilton Glasgow (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000012-0012-4000-a000-000000000012','Bibby vs. Walsh','St Andrew''s Sporting Club','DoubleTree Hilton Hotel, Glasgow, UK','Europe/London','2026-06-20T18:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000094-0094-4000-b000-000000000094','e0000012-0012-4000-a000-000000000012','boxing','Luke Bibby','Paddy Walsh','10','Lightweight','1','2026-06-20T20:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000095-0095-4000-b000-000000000095','e0000012-0012-4000-a000-000000000012','boxing','Lee Welsh','Jose Exequiel Sanchez','6','Super Featherweight','2','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000096-0096-4000-b000-000000000096','e0000012-0012-4000-a000-000000000012','boxing','Will Porter','Marius Vysniauskas','6','Super Flyweight','3','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000097-0097-4000-b000-000000000097','e0000012-0012-4000-a000-000000000012','boxing','Marc Johnstone','Grant Dennis','6','Middleweight','4','2026-06-20T18:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000098-0098-4000-b000-000000000098','e0000012-0012-4000-a000-000000000012','boxing','Jimmy Laing','Jordan Grannum','4','Super Welterweight','5','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
