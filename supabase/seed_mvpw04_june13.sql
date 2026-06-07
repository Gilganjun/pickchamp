-- MVPW-04 — Most Valuable Promotions, Caribe Royale Orlando (13 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000007-0007-4000-a000-000000000007','MVPW-04','Most Valuable Promotions','Caribe Royale Orlando, Orlando, Florida, USA','America/New_York','2026-06-13T22:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000058-0058-4000-b000-000000000058','e0000007-0007-4000-a000-000000000007','boxing','Evelin Nazarena Bermudez','Estefany Alegria Osorio','10','Women''s Light Flyweight','1','2026-06-14T01:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000059-0059-4000-b000-000000000059','e0000007-0007-4000-a000-000000000007','boxing','Jasmine Artiga','Nataly Delgado','10','Women''s Super Flyweight','2','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000060-0060-4000-b000-000000000060','e0000007-0007-4000-a000-000000000007','boxing','Tiara Brown','Hannah Noelle Rapp','10','Women''s Featherweight','3','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000061-0061-4000-b000-000000000061','e0000007-0007-4000-a000-000000000007','boxing','Oshae Jones','Elia Carranza','10','Women''s Super Welterweight','4','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000062-0062-4000-b000-000000000062','e0000007-0007-4000-a000-000000000007','boxing','Jordan Orozco Hernandez','Fernando Diaz','10','Bantamweight','5','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000063-0063-4000-b000-000000000063','e0000007-0007-4000-a000-000000000007','boxing','Brittany Sims','Naomy Cardenas Gomez','8','Women''s Bantamweight','6','2026-06-13T22:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000064-0064-4000-b000-000000000064','e0000007-0007-4000-a000-000000000007','boxing','LeAnna Cruz','Rubi Gutierrez','8','Women''s Super Flyweight','7','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000065-0065-4000-b000-000000000065','e0000007-0007-4000-a000-000000000007','boxing','Pedro Veitia','Taiwo Afolabi','6','Middleweight','8','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000066-0066-4000-b000-000000000066','e0000007-0007-4000-a000-000000000007','boxing','Keno Marley','Jordan Gruszewski','4','Cruiserweight','9','2026-06-13T22:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000067-0067-4000-b000-000000000067','e0000007-0007-4000-a000-000000000007','boxing','Sa''Rai Brown-El','Ashley Felix','4','Women''s Light Flyweight','10','2026-06-13T22:00:00.000Z','upcoming','fighterB','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000068-0068-4000-b000-000000000068','e0000007-0007-4000-a000-000000000007','boxing','Jadden Addison','Zavier Davis','4','Lightweight','11','2026-06-13T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000069-0069-4000-b000-000000000069','e0000007-0007-4000-a000-000000000007','boxing','Jully De Oliveira','Monica Ann Medina','4','Women''s Super Lightweight','12','2026-06-13T22:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;
