-- Bam Rodriguez vs. Vargas — Matchroom Boxing, Desert Diamond Arena (13 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000006-0006-4000-a000-000000000006','Bam Rodriguez vs. Vargas','Matchroom Boxing','Desert Diamond Arena, Glendale, Arizona, USA','America/Phoenix','2026-06-14T00:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000050-0050-4000-b000-000000000050','e0000006-0006-4000-a000-000000000006','boxing','Antonio Vargas','Jesse Rodriguez','12','Bantamweight','1','2026-06-14T03:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000051-0051-4000-b000-000000000051','e0000006-0006-4000-a000-000000000006','boxing','Arturo Cardenas','Jordan Martinez','10','Super Bantamweight','2','2026-06-14T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000052-0052-4000-b000-000000000052','e0000006-0006-4000-a000-000000000006','boxing','Adrian Rodriguez','Elias Montoya Terraza','10','Lightweight','3','2026-06-14T00:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000053-0053-4000-b000-000000000053','e0000006-0006-4000-a000-000000000006','boxing','Elif Nur Turhan','Gabriela Tellez','10','Women''s Lightweight','4','2026-06-14T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000054-0054-4000-b000-000000000054','e0000006-0006-4000-a000-000000000006','boxing','Ronny Alvarez','Filip Stankovic','8','Super Middleweight','5','2026-06-14T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000055-0055-4000-b000-000000000055','e0000006-0006-4000-a000-000000000006','boxing','Trini Ochoa','Cristian Perez Hernandez','8','Super Lightweight','6','2026-06-14T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000056-0056-4000-b000-000000000056','e0000006-0006-4000-a000-000000000006','boxing','Hector Beltran','Shaquile Felicia','8','Super Welterweight','7','2026-06-14T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000057-0057-4000-b000-000000000057','e0000006-0006-4000-a000-000000000006','boxing','Xechal Xavier Esquivel','Rayshawn Taylor','8','Featherweight','8','2026-06-14T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
