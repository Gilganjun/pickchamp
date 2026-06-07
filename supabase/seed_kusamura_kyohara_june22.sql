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
