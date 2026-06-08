-- UFC Freedom 250 — Topuria vs. Gaethje (14 Jun 2026, White House, Washington D.C.)
-- Paramount+ main card. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000022-0022-4000-a000-000000000022','UFC Freedom 250: Topuria vs. Gaethje','UFC','The White House, Washington, D.C., USA','America/New_York','2026-06-15T00:00:00.000Z','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000176-0176-4000-b000-000000000176','e0000022-0022-4000-a000-000000000022','mma','Ilia Topuria','Justin Gaethje','5','Lightweight','1','2026-06-15T03:00:00.000Z','upcoming','fighterA','favourite','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000177-0177-4000-b000-000000000177','e0000022-0022-4000-a000-000000000022','mma','Alex Pereira','Ciryl Gane','5','Heavyweight','2','2026-06-15T00:00:00.000Z','upcoming','none','even','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000178-0178-4000-b000-000000000178','e0000022-0022-4000-a000-000000000022','mma','Sean O''Malley','Aiemann Zahabi','3','Bantamweight','3','2026-06-15T00:00:00.000Z','upcoming','fighterA','favourite','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000179-0179-4000-b000-000000000179','e0000022-0022-4000-a000-000000000022','mma','Josh Hokit','Derrick Lewis','3','Heavyweight','4','2026-06-15T00:00:00.000Z','upcoming','fighterA','favourite','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000180-0180-4000-b000-000000000180','e0000022-0022-4000-a000-000000000022','mma','Mauricio Ruffy','Michael Chandler','3','Lightweight','5','2026-06-15T00:00:00.000Z','upcoming','fighterA','favourite','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000181-0181-4000-b000-000000000181','e0000022-0022-4000-a000-000000000022','mma','Bo Nickal','Kyle Daukaus','3','Middleweight','6','2026-06-15T00:00:00.000Z','upcoming','fighterA','favourite','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000182-0182-4000-b000-000000000182','e0000022-0022-4000-a000-000000000022','mma','Diego Lopes','Steve Garcia','3','Featherweight','7','2026-06-15T00:00:00.000Z','upcoming','fighterA','favourite','2026-06-06T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
