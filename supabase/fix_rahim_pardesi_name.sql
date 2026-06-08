-- Fury vs. Hall — Brooks vs. Pardesi: correct fighter_b_name on production.
-- Safe to re-run.

update public.fights
set
  fighter_b_name = 'Rahim Amer Pardesi',
  updated_at = now()
where id = 'f0000037-0037-4000-b000-000000000037'
  and fighter_b_name in ('Rahim Amer', 'Rahim Ahmer', 'Rahim Pardesi');
