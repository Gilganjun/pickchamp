-- Bam Rodriguez vs. Vargas — correct event title on production.
-- Safe to re-run.

update public.events
set
  name = 'Bam Rodriguez vs. Vargas',
  updated_at = now()
where id = 'e0000006-0006-4000-a000-000000000006'
  and name = 'Rodriguez vs. Vargas';
