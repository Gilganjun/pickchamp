import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("url present:", Boolean(url));
console.log("key present:", Boolean(key));

const sb = createClient(url, key);
for (const table of ["events", "fights", "profiles"]) {
  const { data, error } = await sb.from(table).select("id");
  console.log(table, { error: error?.message ?? null, count: data?.length ?? 0 });
}
