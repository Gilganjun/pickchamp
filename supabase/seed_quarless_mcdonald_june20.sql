-- Quarless vs. McDonald — VIP Boxing, Olympia Liverpool (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000011-0011-4000-a000-000000000011','Quarless vs. McDonald','VIP Boxing','Olympia, Liverpool, UK','Europe/London','2026-06-20T18:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000088-0088-4000-b000-000000000088','e0000011-0011-4000-a000-000000000011','boxing','Nathan Quarless','Sheldon McDonald','10','Cruiserweight','1','2026-06-20T20:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000089-0089-4000-b000-000000000089','e0000011-0011-4000-a000-000000000011','boxing','Jack Dwyer','Fezan Shahid','10','Super Flyweight','2','2026-06-20T18:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000090-0090-4000-b000-000000000090','e0000011-0011-4000-a000-000000000011','boxing','Letjani Dube','Diego Tananta','6','Flyweight','3','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000091-0091-4000-b000-000000000091','e0000011-0011-4000-a000-000000000011','boxing','Anthony Welsh','Connor Meanwell','6','Middleweight','4','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000092-0092-4000-b000-000000000092','e0000011-0011-4000-a000-000000000011','boxing','Ryan Dickens','Mykhailo Sovtus','6','Super Welterweight','5','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000093-0093-4000-b000-000000000093','e0000011-0011-4000-a000-000000000011','boxing','Cory Jones','Jake Pollard','4','Super Bantamweight','6','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
