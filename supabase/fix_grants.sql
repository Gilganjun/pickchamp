-- Run this in Supabase SQL Editor if public reads fail with
-- "permission denied for table fights" (or events, profiles, etc.)

grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.events to anon, authenticated;
grant select on public.fights to anon, authenticated;
grant select on public.predictions to anon, authenticated;
grant select on public.fight_results to anon, authenticated;
grant select on public.rating_history to anon, authenticated;
grant select on public.grading_runs to anon, authenticated;

grant insert, update on public.profiles to authenticated;
grant insert, update on public.predictions to authenticated;
