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

Without Supabase credentials, the app uses in-memory mock data so you can review the UI immediately.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For admin writes | Service role (server only) |
| `ADMIN_EMAILS` | No | Comma-separated admin emails (Option B) |

**Admin (MVP):** Option B via `ADMIN_EMAILS`, with Option A `profiles.is_admin` supported in schema. Mock mode allows `/admin` without auth.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Optionally run `supabase/seed.sql`.
4. Add env vars to `.env.local`.
5. Enable Email auth (or your preferred provider) in Supabase Dashboard.

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
| `/profile` | Current user |
| `/profile/[username]` | Public profile |
| `/admin` | Admin hub |

## Scheduled rounds

Admin enters `scheduled_rounds` per fight. Round pick options are generated dynamically from 1..N — never hardcoded to 12 (boxing) or 5 (MMA).

## License

Private MVP — all rights reserved.
