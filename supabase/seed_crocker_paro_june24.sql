-- Crocker vs. Paro — No Limit Boxing, Pat Rafter Arena Tennyson (24 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000018-0018-4000-a000-000000000018','Crocker vs. Paro','No Limit Boxing','Pat Rafter Arena, Tennyson, Australia','Australia/Brisbane','2026-06-24T07:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000140-0140-4000-b000-000000000140','e0000018-0018-4000-a000-000000000018','boxing','Lewis Crocker','Liam Paro','12','Welterweight','1','2026-06-24T12:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000141-0141-4000-b000-000000000141','e0000018-0018-4000-a000-000000000018','boxing','Liam Wilson','Alexandru Marin','10','Super Featherweight','2','2026-06-24T07:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000142-0142-4000-b000-000000000142','e0000018-0018-4000-a000-000000000018','boxing','Demsey McKean','Liam Talivaa','10','Heavyweight','3','2026-06-24T07:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000143-0143-4000-b000-000000000143','e0000018-0018-4000-a000-000000000018','boxing','Luke Modini','Peng Qu','10','Cruiserweight','4','2026-06-24T07:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000144-0144-4000-b000-000000000144','e0000018-0018-4000-a000-000000000018','boxing','Calvin Jensen','Adem Spaull','5','Welterweight','5','2026-06-24T07:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000145-0145-4000-b000-000000000145','e0000018-0018-4000-a000-000000000018','boxing','Riley Candy','Nathan Watson','5','Super Middleweight','6','2026-06-24T07:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000146-0146-4000-b000-000000000146','e0000018-0018-4000-a000-000000000018','boxing','Vegas Larfield','Shamal Ram Anuj','5','Featherweight','7','2026-06-24T07:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000147-0147-4000-b000-000000000147','e0000018-0018-4000-a000-000000000018','boxing','Nelson Asofa-Solomona','George Burgess','4','Heavyweight','8','2026-06-24T07:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000148-0148-4000-b000-000000000148','e0000018-0018-4000-a000-000000000018','boxing','Jack Javed','Lance McDonald','4','Super Welterweight','9','2026-06-24T07:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000149-0149-4000-b000-000000000149','e0000018-0018-4000-a000-000000000018','boxing','Stevan Ivic','Caleb Tialu','4','Heavyweight','10','2026-06-24T07:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
