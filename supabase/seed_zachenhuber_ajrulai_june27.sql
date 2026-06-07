-- Zachenhuber vs. Ajrulai — German Boxing Series, Strassenkicker Base Cologne (27 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000020-0020-4000-a000-000000000020','Zachenhuber vs. Ajrulai','German Boxing Series','Strassenkicker Base, Cologne, Germany','Europe/Berlin','2026-06-27T14:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000158-0158-4000-b000-000000000158','e0000020-0020-4000-a000-000000000020','boxing','Simon Zachenhuber','Armin Ajrulai','10','Super Middleweight','1','2026-06-27T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000159-0159-4000-b000-000000000159','e0000020-0020-4000-a000-000000000020','boxing','Younes Zarraa','Meriton Karaxha','8','Welterweight','2','2026-06-27T14:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000160-0160-4000-b000-000000000160','e0000020-0020-4000-a000-000000000020','boxing','Gregor Soenius','Alexander Lorch','8','Cruiserweight','3','2026-06-27T14:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000161-0161-4000-b000-000000000161','e0000020-0020-4000-a000-000000000020','boxing','Steven Nduka','Navid Iran','8','Light Heavyweight','4','2026-06-27T14:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000162-0162-4000-b000-000000000162','e0000020-0020-4000-a000-000000000020','boxing','Maximilian Schnell','Pedro Perales','6','Cruiserweight','5','2026-06-27T14:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000163-0163-4000-b000-000000000163','e0000020-0020-4000-a000-000000000020','boxing','Mohammed Azaoun','Atilla Kayabasi','6','Super Lightweight','6','2026-06-27T14:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000164-0164-4000-b000-000000000164','e0000020-0020-4000-a000-000000000020','boxing','Arminius Rolle','Max Teschke','6','Super Welterweight','7','2026-06-27T14:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000165-0165-4000-b000-000000000165','e0000020-0020-4000-a000-000000000020','boxing','Vladimir Scherban','Karen Gevorgyan','4','Light Heavyweight','8','2026-06-27T14:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000166-0166-4000-b000-000000000166','e0000020-0020-4000-a000-000000000020','boxing','Tim Knoefel','Patrick Jager','4','Super Welterweight','9','2026-06-27T14:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000167-0167-4000-b000-000000000167','e0000020-0020-4000-a000-000000000020','boxing','Stjepan Biljan','Mahsum Balaban','4','Super Welterweight','10','2026-06-27T14:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000168-0168-4000-b000-000000000168','e0000020-0020-4000-a000-000000000020','boxing','Claudio Mirko Vizzini','Kemal Salih','4','Super Welterweight','11','2026-06-27T14:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
