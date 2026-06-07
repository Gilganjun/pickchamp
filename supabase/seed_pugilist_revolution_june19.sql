-- Pugilist Revolution — MF Pro, Thunder Studios Long Beach (19 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000009-0009-4000-a000-000000000009','Pugilist Revolution','MF Pro','Thunder Studios, Long Beach, California, USA','America/Los_Angeles','2026-06-20T00:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000078-0078-4000-b000-000000000078','e0000009-0009-4000-a000-000000000009','boxing','Ashton Sylve','Joseph Diaz','10','Super Lightweight','1','2026-06-20T01:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000079-0079-4000-b000-000000000079','e0000009-0009-4000-a000-000000000009','boxing','J''Hon Ingram','Devin Cushing','10','Lightweight','2','2026-06-20T00:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000080-0080-4000-b000-000000000080','e0000009-0009-4000-a000-000000000009','boxing','Amir Anderson','Jonas Sylvain','10','Middleweight','3','2026-06-20T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000081-0081-4000-b000-000000000081','e0000009-0009-4000-a000-000000000009','boxing','David Lopez','Joey Borrero','8','Welterweight','4','2026-06-20T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000082-0082-4000-b000-000000000082','e0000009-0009-4000-a000-000000000009','boxing','Kayla Gomez','Shayntain Creer','6','Women''s Super Flyweight','5','2026-06-20T00:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
