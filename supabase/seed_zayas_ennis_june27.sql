-- Zayas vs. Ennis — Matchroom Boxing, Barclays Center Brooklyn (27 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000021-0021-4000-a000-000000000021','Zayas vs. Ennis','Matchroom Boxing','Barclays Center, Brooklyn, New York, USA','America/New_York','2026-06-28T00:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000169-0169-4000-b000-000000000169','e0000021-0021-4000-a000-000000000021','boxing','Xander Zayas','Jaron Ennis','12','Super Welterweight','1','2026-06-28T03:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000170-0170-4000-b000-000000000170','e0000021-0021-4000-a000-000000000021','boxing','Jahi Tucker','Euri Cedeno','10','Middleweight','2','2026-06-28T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000171-0171-4000-b000-000000000171','e0000021-0021-4000-a000-000000000021','boxing','Emiliano Vargas','Bryce Mills','10','Super Lightweight','3','2026-06-28T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000172-0172-4000-b000-000000000172','e0000021-0021-4000-a000-000000000021','boxing','Ben Whittaker','Richard Rivera','10','Light Heavyweight','4','2026-06-28T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000173-0173-4000-b000-000000000173','e0000021-0021-4000-a000-000000000021','boxing','Quincey Williams','Jerome Baxter','8','Welterweight','5','2026-06-28T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000174-0174-4000-b000-000000000174','e0000021-0021-4000-a000-000000000021','boxing','Dennis Thompson','Edwin Rodriguez','8','Super Bantamweight','6','2026-06-28T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000175-0175-4000-b000-000000000175','e0000021-0021-4000-a000-000000000021','boxing','Juanma Lopez De Jesus','Alberto Motos','6','Super Flyweight','7','2026-06-28T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
