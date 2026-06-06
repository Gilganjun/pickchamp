# PickFist

**You Don't Know S\*\*\* About Fighting.**

Combat-sports prediction competition for boxing and MMA. Not a betting or gambling app — skill-based ratings and rankings only.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (auth + Postgres) — optional; mock data works without env vars
- Vitest for rating tests

## Quick start

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually [http://localhost:3000](http://localhost:3000)).

`npm run dev` clears the `.next` cache first (helps on OneDrive / Windows). Use `npm run dev:fast` to skip that step.

### UI looks unstyled (white page, default fonts)?

That means **CSS did not load**, usually because:

1. A **stale** `next dev` process is still running on port 3000 (broken cache).
2. The **`.next` folder is corrupted** — common when the project lives in **OneDrive** (`EINVAL: invalid argument, readlink`).

**Fix:**

```powershell
# Stop all Node dev servers, then:
cd path\to\your-project-folder
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

Use the **exact port** shown in the terminal (e.g. 3002 if 3000 is busy). Hard-refresh the browser (Ctrl+Shift+R).

**Local dev uses mock data by default** (demo user `fightfan42`) — no login needed for `/profile` or `/picks`, even if `.env.local` has Supabase keys. Set `PICKFIST_USE_SUPABASE=true` in `.env.local` when you want to test auth and live data locally.

Without Supabase credentials at all, the same mock mode applies.

**Production (`pickfist.com`) requires Supabase env vars** — otherwise picks are not persisted and accounts do not work.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production admin | Service role — **server only**, never client |
| `ADMIN_EMAILS` | Production admin | Comma-separated emails allowed on `/admin` |

## Supabase setup (launch)

1. Create a Supabase project.
2. **SQL Editor → run `supabase/schema.sql`** (full schema + RLS + profile trigger).
3. **SQL Editor → run `supabase/seed_launch.sql`** (real launch fight cards from the app).
4. **Authentication → Providers → Email** — enable; for fastest MVP signup, disable “Confirm email”.
5. **Authentication → URL configuration** — add site URL and redirect URLs:
   - `https://pickfist.com`
   - `https://pickfist.com/auth/callback`
   - `http://localhost:3000/auth/callback` (local dev)
6. Add env vars to `.env.local` and **Vercel** (then redeploy).
7. Set `ADMIN_EMAILS` to your admin email(s).

**Do not run** `supabase/migrations/20260603_favourite_rating_v2.sql` on a blank database — those columns are already in `schema.sql`.

## Mock data

Built-in mock content lives in `src/data/mock.ts`:

- Events: **Steel City King** (Sheffield, 6 Jun 2026) and **UFC Fight Night: Muhammad vs. Bonfim** (Las Vegas, 6 Jun 2026)
- Full bout lists with real calendar dates (no relative mock time offsets for cards)
- Demo user: `fightfan42` (`MOCK_USER_ID`)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm test` | Rating system tests (Vitest) |

## Rating logic (V2 — difficulty-based)

Scoring uses admin `favourite_side` + `favourite_level` → effective pick tier → fixed base table. **Popularity is analytics only** (not used for `ratingChange`).

- `src/lib/rating/calculateRatingChange.ts` — main formula
- `src/lib/rating/tierRatings.ts` — base gain/loss table
- `src/lib/rating/getEffectivePickTier.ts` — tier mapping
- `src/lib/rating/calculateRatingChange.test.ts` — V2 test cases

Documentation for external review:

- `docs/RATING_SYSTEM_IMPLEMENTATION.md`
- `docs/CURSOR_BUILD_LOG.md` (includes migration section)

## Display rank ladder (profile UI only)

Users still have an **internal numeric rating** (e.g. 1000, 1042, 1100) used by V2 scoring and stored in the database. **Profile and sport cards show a separate 12-step display ladder** (Novice → All-Time Great) with progress within each band — this does **not** change how picks are scored.

- Helper: `src/lib/profile/ratingTiers.ts`
- Raw rating is de-emphasized in the UI (`Rating: 1042` secondary text)
- Progress resets when crossing into the next display rank band

## Admin

- Dashboard: `/admin`
- Events: `/admin/events`
- Fights: `/admin/fights`
- Results & grading: `/admin/results`

Grading uses `src/lib/grading/gradeFight.ts` and never duplicates rating math in UI.

## Main routes

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/picks` | Predictions (primary UI) |
| `/rankings` | Leaderboards |
| `/events` | Event list |
| `/events/[id]` | Event detail |
| `/login` | Log in |
| `/signup` | Create account |
| `/profile` | Current user (requires login when Supabase connected) |
| `/profile/[username]` | Public profile |
| `/admin` | Admin hub (protected when Supabase connected) |

## Scheduled rounds

Admin enters `scheduled_rounds` per fight. Round pick options are generated dynamically from 1..N — never hardcoded to 12 (boxing) or 5 (MMA).

## License

Private MVP — all rights reserved.
