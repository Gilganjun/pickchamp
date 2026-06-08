-- PickFist production catch-up (events e0000004 through e0000021)
-- Run once in Supabase SQL Editor on the LIVE project.
-- Safe to re-run: every insert uses ON CONFLICT DO NOTHING.
-- Production already has e0000001-e0000003 from the original launch seed.
-- Misfits 23 — Fury vs. Hall: Beauty vs. The Beast (13 Jun 2026)
-- Run on an EXISTING production database (seed_launch.sql already applied).
-- Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000004-0004-4000-a000-000000000004','Fury vs. Hall: Beauty vs. The Beast','Misfits Boxing','AO Arena, Manchester, UK','Europe/London','2026-06-13T17:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000031-0031-4000-b000-000000000031','e0000004-0004-4000-a000-000000000004','boxing','Tommy Fury','Eddie Hall','6','Heavyweight','1','2026-06-13T20:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000032-0032-4000-b000-000000000032','e0000004-0004-4000-a000-000000000004','boxing','Anthony Taylor','Matt Floyd','5','Light Heavyweight','2','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000033-0033-4000-b000-000000000033','e0000004-0004-4000-a000-000000000004','boxing','Brandon Scott','Brendon Davis','6','Middleweight','3','2026-06-13T17:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000034-0034-4000-b000-000000000034','e0000004-0004-4000-a000-000000000004','boxing','Charlie Cox','Baffour Boateng','6','Cruiserweight','4','2026-06-13T17:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000035-0035-4000-b000-000000000035','e0000004-0004-4000-a000-000000000004','boxing','Jack Kay','Jordan McCann','6','Middleweight','5','2026-06-13T17:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000036-0036-4000-b000-000000000036','e0000004-0004-4000-a000-000000000004','boxing','Jade Jones','Federica Riccio','6','Women''s Cruiserweight','6','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000037-0037-4000-b000-000000000037','e0000004-0004-4000-a000-000000000004','boxing','Adam Brooks','Rahim Amer Pardesi','6','Light Heavyweight','7','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000038-0038-4000-b000-000000000038','e0000004-0004-4000-a000-000000000004','boxing','Arabella Amblea Del Busso','Andy Nguyen','6','Women''s Middleweight','8','2026-06-13T17:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000039-0039-4000-b000-000000000039','e0000004-0004-4000-a000-000000000004','boxing','Sheena Bathory','Christina Flanagan','6','Women''s Lightweight','9','2026-06-13T17:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000040-0040-4000-b000-000000000040','e0000004-0004-4000-a000-000000000004','boxing','Abdel Karim El-Madani','Luke Nevin','6','Light Heavyweight','10','2026-06-13T17:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


-- York Hall — Hawley vs. Steward (13 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000005-0005-4000-a000-000000000005','Hawley vs. Steward','Warren Boxing Management','York Hall, Bethnal Green, London, UK','Europe/London','2026-06-13T16:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000041-0041-4000-b000-000000000041','e0000005-0005-4000-a000-000000000005','boxing','James Hawley','Ellis Steward','10','Super Middleweight','1','2026-06-13T19:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000042-0042-4000-b000-000000000042','e0000005-0005-4000-a000-000000000005','boxing','Abnor Jashari','Marley Mason','10','Super Featherweight','2','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000043-0043-4000-b000-000000000043','e0000005-0005-4000-a000-000000000005','boxing','Dean Gardner','Joseph Butler','10','Super Lightweight','3','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000044-0044-4000-b000-000000000044','e0000005-0005-4000-a000-000000000005','boxing','Hamzah Butt','Amar Kayani','8','Welterweight','4','2026-06-13T16:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000045-0045-4000-b000-000000000045','e0000005-0005-4000-a000-000000000005','boxing','Jesse Brandon','James Gardiner','8','Welterweight','5','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000046-0046-4000-b000-000000000046','e0000005-0005-4000-a000-000000000005','boxing','Alfie Gaskin','Robbie Chapman','6','Super Middleweight','6','2026-06-13T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000047-0047-4000-b000-000000000047','e0000005-0005-4000-a000-000000000005','boxing','Hamza Mehmood','Diego Tananta','6','Super Bantamweight','7','2026-06-13T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000048-0048-4000-b000-000000000048','e0000005-0005-4000-a000-000000000005','boxing','Khalid Ali','Connor Meanwell','6','Super Welterweight','8','2026-06-13T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000049-0049-4000-b000-000000000049','e0000005-0005-4000-a000-000000000005','boxing','Freddie Ketteringham','Naeem Ali','4','Super Welterweight','9','2026-06-13T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


-- Rodriguez vs. Vargas — Matchroom Boxing, Desert Diamond Arena (13 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000006-0006-4000-a000-000000000006','Rodriguez vs. Vargas','Matchroom Boxing','Desert Diamond Arena, Glendale, Arizona, USA','America/Phoenix','2026-06-14T00:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
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


-- Gonzalez vs. Perez — Salita Promotions, GLC Live at 20 Monroe (14 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000008-0008-4000-a000-000000000008','Gonzalez vs. Perez','Salita Promotions','GLC Live at 20 Monroe, Grand Rapids, Michigan, USA','America/Detroit','2026-06-14T22:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000070-0070-4000-b000-000000000070','e0000008-0008-4000-a000-000000000008','boxing','Jonathan Gonzalez','Abraham R Perez','12','Flyweight','1','2026-06-15T03:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000071-0071-4000-b000-000000000071','e0000008-0008-4000-a000-000000000008','boxing','Joshua Pagan','Rodolfo Bustamante Salazar','10','Lightweight','2','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000072-0072-4000-b000-000000000072','e0000008-0008-4000-a000-000000000008','boxing','Troy Isley','Leonardo Di Stefano','10','Middleweight','3','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000073-0073-4000-b000-000000000073','e0000008-0008-4000-a000-000000000008','boxing','Brandon Moore','Donald Haynesworth','8','Heavyweight','4','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000074-0074-4000-b000-000000000074','e0000008-0008-4000-a000-000000000008','boxing','Bryant Jennings','Robert Simms','8','Heavyweight','5','2026-06-14T22:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000075-0075-4000-b000-000000000075','e0000008-0008-4000-a000-000000000008','boxing','Jaquan McElroy','Damian Munoz','6','Super Welterweight','6','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000076-0076-4000-b000-000000000076','e0000008-0008-4000-a000-000000000008','boxing','Sardius Simmons','Walter Burns','6','Heavyweight','7','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000077-0077-4000-b000-000000000077','e0000008-0008-4000-a000-000000000008','boxing','Lance Smith','Jovanis Rodriguez Pallares','4','Super Lightweight','8','2026-06-14T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


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


-- Garner vs. Magnesi — Queensberry Promotions, St Mary's Stadium Southampton (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000010-0010-4000-a000-000000000010','Garner vs. Magnesi','Queensberry Promotions','St Mary''s Stadium, Southampton, UK','Europe/London','2026-06-20T18:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000083-0083-4000-b000-000000000083','e0000010-0010-4000-a000-000000000010','boxing','Ryan Garner','Michael Magnesi','12','Super Featherweight','1','2026-06-20T21:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000084-0084-4000-b000-000000000084','e0000010-0010-4000-a000-000000000010','boxing','Brad Pauls','Bradley Goldsmith','10','Middleweight','2','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000085-0085-4000-b000-000000000085','e0000010-0010-4000-a000-000000000010','boxing','Lewis Edmondson','Lyndon Arthur','10','Light Heavyweight','3','2026-06-20T18:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000086-0086-4000-b000-000000000086','e0000010-0010-4000-a000-000000000010','boxing','Taylor Bevan','Ryszard Lewicki','8','Super Middleweight','4','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000087-0087-4000-b000-000000000087','e0000010-0010-4000-a000-000000000010','boxing','Lasha Guruli','Liam Dillon','8','Super Lightweight','5','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


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


-- Davey vs. Thompson — Mark Bateson Promotions, Batley Bulldogs Stadium (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000013-0013-4000-a000-000000000013','Davey vs. Thompson','Mark Bateson Promotions','Batley Bulldogs Stadium, Batley, UK','Europe/London','2026-06-20T16:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000099-0099-4000-b000-000000000099','e0000013-0013-4000-a000-000000000013','boxing','George Davey','David Thompson','10','Super Welterweight','1','2026-06-20T19:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000100-0100-4000-b000-000000000100','e0000013-0013-4000-a000-000000000013','boxing','Jack Marshall','Harry Edgecumbe','10','Lightweight','2','2026-06-20T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000101-0101-4000-b000-000000000101','e0000013-0013-4000-a000-000000000013','boxing','Nathan Shepherd','Joe Hardy','6','Middleweight','3','2026-06-20T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000102-0102-4000-b000-000000000102','e0000013-0013-4000-a000-000000000013','boxing','Ben Thompson','Dale Arrowsmith','6','Super Welterweight','4','2026-06-20T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000103-0103-4000-b000-000000000103','e0000013-0013-4000-a000-000000000013','boxing','Junaid Khan','Sam Kirk','4','Middleweight','5','2026-06-20T16:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000104-0104-4000-b000-000000000104','e0000013-0013-4000-a000-000000000013','boxing','Elliott Bridges','Josh Cook','4','Middleweight','6','2026-06-20T16:00:00.000Z','upcoming','fighterB','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000105-0105-4000-b000-000000000105','e0000013-0013-4000-a000-000000000013','boxing','Ryan Robinson','Owen Durnan','4','Super Lightweight','7','2026-06-20T16:00:00.000Z','upcoming','fighterB','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000106-0106-4000-b000-000000000106','e0000013-0013-4000-a000-000000000013','boxing','Kai Gale','Bahadur Karami','4','Super Middleweight','8','2026-06-20T16:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000107-0107-4000-b000-000000000107','e0000013-0013-4000-a000-000000000013','boxing','Henri Cooper','Jake Osgood','4','Welterweight','9','2026-06-20T16:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


-- Allen vs. Chvarkou — White Rhino Boxing, Magna Centre Rotherham (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000014-0014-4000-a000-000000000014','Allen vs. Chvarkou','White Rhino Boxing','Magna Centre, Rotherham, UK','Europe/London','2026-06-20T18:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000108-0108-4000-b000-000000000108','e0000014-0014-4000-a000-000000000014','boxing','David Allen','Viktar Chvarkou','4','Heavyweight','1','2026-06-20T20:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000109-0109-4000-b000-000000000109','e0000014-0014-4000-a000-000000000014','boxing','Gideon Anaba','Tom Ramsden','4','Light Heavyweight','2','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000110-0110-4000-b000-000000000110','e0000014-0014-4000-a000-000000000014','boxing','Charlie Ellis','Liam McElhinney','4','Super Welterweight','3','2026-06-20T18:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000111-0111-4000-b000-000000000111','e0000014-0014-4000-a000-000000000014','boxing','Shae Gowler','Fonz Alexander','4','Welterweight','4','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000112-0112-4000-b000-000000000112','e0000014-0014-4000-a000-000000000014','boxing','Liam Carrigan','Naeem Ali','4','Welterweight','5','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000113-0113-4000-b000-000000000113','e0000014-0014-4000-a000-000000000014','boxing','Elias Sinani','Kasey Bradnum','4','Super Lightweight','6','2026-06-20T18:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


-- King of the West — Toro Promotions, Celebrity Theater Phoenix (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000015-0015-4000-a000-000000000015','King of the West','Toro Promotions','Celebrity Theater, Phoenix, Arizona, USA','America/Phoenix','2026-06-21T00:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000114-0114-4000-b000-000000000114','e0000015-0015-4000-a000-000000000015','boxing','Kingsley Ibeh','Dante Stone','10','Heavyweight','1','2026-06-21T04:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000115-0115-4000-b000-000000000115','e0000015-0015-4000-a000-000000000015','boxing','Elijah Garcia','Ryan Adams','8','Super Middleweight','2','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000116-0116-4000-b000-000000000116','e0000015-0015-4000-a000-000000000015','boxing','Adam Stewart','Desmond Thompson','6','Heavyweight','3','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000117-0117-4000-b000-000000000117','e0000015-0015-4000-a000-000000000015','boxing','Brayan Gonzalez','Carlos Mujica','6','Featherweight','4','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000118-0118-4000-b000-000000000118','e0000015-0015-4000-a000-000000000015','boxing','Pedro Valencia','Pedro Pinillo','6','Super Lightweight','5','2026-06-21T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000119-0119-4000-b000-000000000119','e0000015-0015-4000-a000-000000000015','boxing','Sergio Leon Rodriguez','Antonio Louis Hernandez','6','Light Heavyweight','6','2026-06-21T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000120-0120-4000-b000-000000000120','e0000015-0015-4000-a000-000000000015','boxing','Narek Hovhannisyan','Diuhl Olguin','6','Lightweight','7','2026-06-21T00:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000121-0121-4000-b000-000000000121','e0000015-0015-4000-a000-000000000015','boxing','Angel Lainez','Javier Arroyo','4','Heavyweight','8','2026-06-21T00:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000122-0122-4000-b000-000000000122','e0000015-0015-4000-a000-000000000015','boxing','Solomon Buchanan','Lucus Griego','4','Cruiserweight','9','2026-06-21T00:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000123-0123-4000-b000-000000000123','e0000015-0015-4000-a000-000000000015','boxing','Rahman Muhammad','Daryus Cotton','4','Super Welterweight','10','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000124-0124-4000-b000-000000000124','e0000015-0015-4000-a000-000000000015','boxing','Adam Lopez','Jamal Johnson','4','Super Lightweight','11','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000125-0125-4000-b000-000000000125','e0000015-0015-4000-a000-000000000015','boxing','Trevor Kotara','Jalen Davis','4','Heavyweight','12','2026-06-21T00:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


-- Back II The Future — Bey Bros Promotions, Goodyear Hall Akron (20 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000016-0016-4000-a000-000000000016','Back II The Future','Bey Bros Promotions','Goodyear Local 18282 Hall, Akron, Ohio, USA','America/New_York','2026-06-20T22:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000126-0126-4000-b000-000000000126','e0000016-0016-4000-a000-000000000016','boxing','Mickey Bey','Alexander Espinoza','10','Super Featherweight','1','2026-06-21T01:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000127-0127-4000-b000-000000000127','e0000016-0016-4000-a000-000000000016','boxing','Lamont Elmano Quarterman','James Martin','6','Super Middleweight','2','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000128-0128-4000-b000-000000000128','e0000016-0016-4000-a000-000000000016','boxing','Brandon Vega','Benji Gomez','6','Super Lightweight','3','2026-06-20T22:00:00.000Z','upcoming','fighterA','heavy_favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000129-0129-4000-b000-000000000129','e0000016-0016-4000-a000-000000000016','boxing','Kingdamon Antoine','Angel Hernandez Pillado','6','Super Featherweight','4','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000130-0130-4000-b000-000000000130','e0000016-0016-4000-a000-000000000016','boxing','Charles Pugh','Giovanni Sarran','4','Cruiserweight','5','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000131-0131-4000-b000-000000000131','e0000016-0016-4000-a000-000000000016','boxing','Zahhier Fox','Don Linwood Stewart','4','Super Featherweight','6','2026-06-20T22:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


-- Kusamura vs. Kyohara — Ichiriki Promotions, Korakuen Hall Tokyo (22 Jun 2026)
-- Run on an EXISTING production database. Safe to re-run: ON CONFLICT DO NOTHING.

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
  ('e0000017-0017-4000-a000-000000000017','Kusamura vs. Kyohara','Ichiriki Promotions','Korakuen Hall, Tokyo, Japan','Asia/Tokyo','2026-06-22T08:00:00.000Z','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
  ('f0000132-0132-4000-b000-000000000132','e0000017-0017-4000-a000-000000000017','boxing','Ryuya Kusamura','Kazuki Kyohara','10','Super Middleweight','1','2026-06-22T11:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000133-0133-4000-b000-000000000133','e0000017-0017-4000-a000-000000000017','boxing','Shoto Ochiai','Ryu Suzuki','8','Super Lightweight','2','2026-06-22T08:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000134-0134-4000-b000-000000000134','e0000017-0017-4000-a000-000000000017','boxing','Rikito Hirayama','Yuta Seki','6','Light Flyweight','3','2026-06-22T08:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000135-0135-4000-b000-000000000135','e0000017-0017-4000-a000-000000000017','boxing','Kuto Nema','Ren Shibata','6','Super Bantamweight','4','2026-06-22T08:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000136-0136-4000-b000-000000000136','e0000017-0017-4000-a000-000000000017','boxing','Ginjiro Asakura','Haruto Suzuki','4','Super Featherweight','5','2026-06-22T08:00:00.000Z','upcoming','fighterB','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000137-0137-4000-b000-000000000137','e0000017-0017-4000-a000-000000000017','boxing','Toya Fukumoto','Ryosuke Sato','4','Featherweight','6','2026-06-22T08:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000138-0138-4000-b000-000000000138','e0000017-0017-4000-a000-000000000017','boxing','Daijiro Hosaka','Fuki Matsumoto','4','Lightweight','7','2026-06-22T08:00:00.000Z','upcoming','none','even','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z'),
  ('f0000139-0139-4000-b000-000000000139','e0000017-0017-4000-a000-000000000017','boxing','Keigo Sato','Yusuke Imai','4','Welterweight','8','2026-06-22T08:00:00.000Z','upcoming','fighterA','favourite','2026-05-15T12:00:00.000Z','2026-06-06T12:00:00.000Z')
on conflict (id) do nothing;


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
