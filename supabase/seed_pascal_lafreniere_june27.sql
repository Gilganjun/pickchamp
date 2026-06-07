-- Pascal vs. Lafreniere — New Era Sports & Entertainment, Colisee de Laval (27 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000019-0019-4000-a000-000000000019','Pascal vs. Lafreniere','New Era Sports & Entertainment','Colisee de Laval, Laval, Canada','America/Toronto','2026-06-27T23:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000150-0150-4000-b000-000000000150','e0000019-0019-4000-a000-000000000019','boxing','Jean Pascal','Francis Lafreniere','10','Light Heavyweight','1','2026-06-28T02:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000151-0151-4000-b000-000000000151','e0000019-0019-4000-a000-000000000019','boxing','Raphael Courchesne','Jan Michael Poulin','10','Super Welterweight','2','2026-06-27T23:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000152-0152-4000-b000-000000000152','e0000019-0019-4000-a000-000000000019','boxing','Winner Bondo','Christopher Missengue','6','Super Lightweight','3','2026-06-27T23:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000153-0153-4000-b000-000000000153','e0000019-0019-4000-a000-000000000019','boxing','Hubert Poulin','Kevin Boakye Schumann','6','Light Heavyweight','4','2026-06-27T23:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000154-0154-4000-b000-000000000154','e0000019-0019-4000-a000-000000000019','boxing','Guillaume Gosselin','David Canuel','6','Welterweight','5','2026-06-27T23:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000155-0155-4000-b000-000000000155','e0000019-0019-4000-a000-000000000019','boxing','Dante Tice Oliveira','Serge Ntetu','4','Welterweight','6','2026-06-27T23:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000156-0156-4000-b000-000000000156','e0000019-0019-4000-a000-000000000019','boxing','Alexandre Giraldeau Perron','Yoan Trottier','4','Welterweight','7','2026-06-27T23:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000157-0157-4000-b000-000000000157','e0000019-0019-4000-a000-000000000019','boxing','Brandon Poulard','Juan Andrade','4','Super Welterweight','8','2026-06-27T23:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
