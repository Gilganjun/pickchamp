-- PickFist: settle results for cards on 6 June 2026 (last 24h as of 7 Jun 2026)
-- Sources: UFC.com, Wikipedia/MMA Junkie (UFC Vegas 118), UFC.com Zuffa Boxing 07,
--          Boxing News 24 / The Ring (Steel City King, Sheffield)
-- Safe to re-run: upserts fight_results and sets fight status to settled.

-- Steel City King (e0000001) — Utilita Arena, Sheffield
insert into public.fight_results (fight_id, outcome, method, result_round, official_notes, settled_at, updated_at) values
  ('f0000001-0001-4000-b000-000000000001','fighterA','decision',null,'Padley def. Fiaz SD (115-112, 114-113, 113-114)','2026-06-06T22:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000002-0002-4000-b000-000000000002','fighterB','decision',null,'Sulaimaan def. Nadim UD (100-90, 100-90, 98-92)','2026-06-06T20:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000003-0003-4000-b000-000000000003','fighterA','ko_tko',9,'Bowen def. Coleman TKO R9 (1:41)','2026-06-06T19:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000004-0004-4000-b000-000000000004','fighterA','ko_tko',1,'Atang def. Shaili TKO R1 (2:30)','2026-06-06T19:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000005-0005-4000-b000-000000000005','fighterA','decision',null,'Maca def. Paredes UD (6 rds)','2026-06-06T17:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000006-0006-4000-b000-000000000006','fighterA','ko_tko',4,'Mitchell def. Areco TKO R4','2026-06-06T17:15:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000007-0007-4000-b000-000000000007','fighterA','ko_tko',6,'Hardy def. Carrasco TKO R6','2026-06-06T17:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000008-0008-4000-b000-000000000008','fighterA','decision',null,'Mulunda def. Goulding UD (4 rds)','2026-06-06T16:45:00.000Z','2026-06-07T04:00:00.000Z')
on conflict (fight_id) do update set
  outcome = excluded.outcome,
  method = excluded.method,
  result_round = excluded.result_round,
  official_notes = excluded.official_notes,
  settled_at = excluded.settled_at,
  updated_at = excluded.updated_at;

update public.fights set
  fighter_b_name = 'Rodrigo Matias Areco',
  status = 'settled',
  updated_at = '2026-06-07T04:00:00.000Z'
where id = 'f0000006-0006-4000-b000-000000000006';

update public.fights set
  fighter_b_name = 'Jesus Carrasco',
  status = 'settled',
  updated_at = '2026-06-07T04:00:00.000Z'
where id = 'f0000007-0007-4000-b000-000000000007';

update public.fights set status = 'settled', updated_at = '2026-06-07T04:00:00.000Z'
where id in (
  'f0000001-0001-4000-b000-000000000001',
  'f0000002-0002-4000-b000-000000000002',
  'f0000003-0003-4000-b000-000000000003',
  'f0000004-0004-4000-b000-000000000004',
  'f0000005-0005-4000-b000-000000000005',
  'f0000008-0008-4000-b000-000000000008'
);

-- UFC Fight Night: Muhammad vs. Bonfim (e0000002) — Meta APEX, Las Vegas
insert into public.fight_results (fight_id, outcome, method, result_round, official_notes, settled_at, updated_at) values
  ('f0000009-0009-4000-b000-000000000009','fighterB','decision',null,'Bonfim def. Muhammad UD (50-45 x3)','2026-06-07T03:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000010-0010-4000-b000-000000000010','fighterA','decision',null,'Allen def. Shahbazyan UD (30-27, 30-27, 29-28)','2026-06-07T02:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000011-0011-4000-b000-000000000011','fighterB','decision',null,'Nolan def. Ziam UD (29-28 x3)','2026-06-07T01:45:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000012-0012-4000-b000-000000000012','fighterA','submission',3,'Mitchell def. Luna arm-triangle R3 (4:52)','2026-06-07T01:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000013-0013-4000-b000-000000000013','fighterA','ko_tko',1,'Baraniewski def. Tafa TKO R1 (1:25)','2026-06-07T00:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000014-0014-4000-b000-000000000014','fighterB','ko_tko',1,'Costa def. Schnell TKO R1 (2:28)','2026-06-06T23:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000015-0015-4000-b000-000000000015','fighterA','decision',null,'McGhee def. Yannis UD (30-27, 30-27, 29-28)','2026-06-06T23:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000016-0016-4000-b000-000000000016','fighterB','submission',1,'Cháirez def. da Silva neck crank R1 (4:13)','2026-06-06T22:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000017-0017-4000-b000-000000000017','fighterB','submission',1,'Chandler def. Cachoeira armbar R1 (3:42)','2026-06-06T22:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000018-0018-4000-b000-000000000018','fighterB','submission',1,'Brito def. Leavitt ninja choke R1 (4:19)','2026-06-06T21:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000019-0019-4000-b000-000000000019','fighterA','decision',null,'Chaves def. Duben SD (29-28, 28-29, 29-28)','2026-06-06T21:15:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000020-0020-4000-b000-000000000020','fighterA','ko_tko',1,'Souza def. Carnelossi KO R1 (1:34)','2026-06-06T21:00:00.000Z','2026-06-07T04:00:00.000Z')
on conflict (fight_id) do update set
  outcome = excluded.outcome,
  method = excluded.method,
  result_round = excluded.result_round,
  official_notes = excluded.official_notes,
  settled_at = excluded.settled_at,
  updated_at = excluded.updated_at;

update public.fights set status = 'settled', updated_at = '2026-06-07T04:00:00.000Z'
where event_id = 'e0000002-0002-4000-a000-000000000002';

-- Zuffa Boxing 7 (e0000003) — Bournemouth International Centre
insert into public.fight_results (fight_id, outcome, method, result_round, official_notes, settled_at, updated_at) values
  ('f0000021-0021-4000-b000-000000000021','fighterA','ko_tko',7,'Billam-Smith def. Rozicki TKO R7 (corner retirement)','2026-06-06T22:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000022-0022-4000-b000-000000000022','fighterB','ko_tko',7,'Clarke def. Massey TKO R7 (1:24)','2026-06-06T21:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000023-0023-4000-b000-000000000023','fighterA','ko_tko',3,'Cutler def. Sutton TKO R3 (0:31, shoulder injury)','2026-06-06T20:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000024-0024-4000-b000-000000000024','fighterA','ko_tko',1,'McKenna def. Streeter TKO R1 (1:04)','2026-06-06T20:15:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000025-0025-4000-b000-000000000025','fighterA','ko_tko',2,'Hickey def. Tompkins TKO R2 (1:22)','2026-06-06T20:00:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000026-0026-4000-b000-000000000026','fighterB','decision',null,'Dychko def. Dykes SD (97-92, 94-95, 97-92)','2026-06-06T18:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000027-0027-4000-b000-000000000027','fighterA','ko_tko',3,'Hughes def. Vergiev TKO R3 (0:52)','2026-06-06T17:30:00.000Z','2026-06-07T04:00:00.000Z'),
  ('f0000028-0028-4000-b000-000000000028','fighterA','ko_tko',2,'MacMillan def. Fanthome TKO R2 (1:44)','2026-06-06T17:00:00.000Z','2026-06-07T04:00:00.000Z')
on conflict (fight_id) do update set
  outcome = excluded.outcome,
  method = excluded.method,
  result_round = excluded.result_round,
  official_notes = excluded.official_notes,
  settled_at = excluded.settled_at,
  updated_at = excluded.updated_at;

update public.fights set status = 'settled', updated_at = '2026-06-07T04:00:00.000Z'
where event_id = 'e0000003-0003-4000-a000-000000000003';
