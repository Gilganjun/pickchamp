# PickFist — Cursor Build Log

Build date: 2026-06-03

---

## 1. Main files created

### Application core

- `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/app/page.tsx` — landing
- `src/app/picks/page.tsx`, `PicksClient.tsx`
- `src/app/rankings/page.tsx`, `RankingsClient.tsx`
- `src/app/events/page.tsx`, `src/app/events/[id]/page.tsx`
- `src/app/profile/page.tsx`, `src/app/profile/[username]/page.tsx`
- `src/app/admin/page.tsx`, `admin/events`, `admin/fights`, `admin/results`

### Components

- `AppShell`, `BottomNav`, `BrandHeader`, `TabBar`, `SportFilter`
- `FightCard`, `AdvancedPredictionPanel`
- `RankingCard`, `ProfileStatCard`, `AdminFormSection`
- `admin/results/ResultsForm.tsx`

### Libraries

- `src/lib/rating/*` — rating engine
- `src/lib/grading/gradeFight.ts`
- `src/lib/rankings.ts`, `utils.ts`, `config.ts`
- `src/lib/data/fights.ts`, `profiles.ts`, `events.ts`
- `src/app/actions/admin.ts`
- `src/data/mock.ts`
- `src/types/index.ts`, `grading.ts`

---

## 2. Database schema files

- `supabase/schema.sql` — full MVP tables, RLS policies, profile trigger
- `supabase/seed.sql` — placeholder admin note

Tables: `profiles`, `events`, `fights`, `predictions`, `fight_results`, `rating_history`, `grading_runs`

---

## 3. Rating files created

- `src/lib/rating/calculateRatingChange.ts`
- `src/lib/rating/constants.ts`
- `src/lib/rating/helpers.ts`
- `src/lib/rating/validatePrediction.ts`
- `src/lib/rating/calculateRatingChange.test.ts`
- `src/lib/grading/gradeFight.ts`
- `docs/RATING_SYSTEM_IMPLEMENTATION.md`

---

## 4. UI pages created

| Route | Status |
|-------|--------|
| `/` | Landing with CTAs |
| `/picks` | Primary pick UI (tabs, sport filter, fight cards) |
| `/rankings` | Global / Boxing / MMA leaderboards |
| `/events` | Upcoming + settled lists |
| `/events/[id]` | Event detail + fights |
| `/profile` | Demo user stats + recent picks |
| `/profile/[username]` | Public profile |
| `/admin` | Admin hub |
| `/admin/events` | Create event |
| `/admin/fights` | Add fight (scheduled_rounds required) |
| `/admin/results` | Settle + grade + summary |

---

## 5. Assumptions made

1. **Admin auth:** MVP uses open `/admin` in mock mode; production uses `ADMIN_EMAILS` (Option B) documented in README; schema includes `is_admin` (Option A).
2. **Mock user:** Logged-in picks use `MOCK_USER_ID` (`fightfan42`) when Supabase is not configured.
3. **Graded pick counters:** `boxing_picks` / `mma_picks` on profile treated as graded pick counts for eligibility (incremented on settle in mock path).
4. **Bottom nav:** Spec lists Picks, Rankings, Events, Profile (no Home tab); landing is `/` only.
5. **Pick page tabs:** Named Upcoming | Live | Settled (spec) vs mockup History → used spec labels.
6. **No fighter photos:** Text-only cards per requirements.
7. **Records on cards:** Omitted (not in DB schema); shows scheduled rounds + weight class instead.

---

## 6. Skipped features (per MVP scope)

- Real-money betting, credits, payments
- Notifications, chat, private leagues
- Fighter photo upload
- External fight data feeds / scraping
- Full Supabase client integration (stub falls back to mock)
- Auth UI (login/signup pages) — structure ready via schema
- Rising/Provisional leaderboard section (eligible-only list built)
- Automated lock cron (status inferred from `lock_time` in UI)

---

## 7. Errors / uncertain areas

1. **create-next-app** failed due to folder name capitalization — project scaffolded manually.
2. **Supabase live path:** `hasSupabaseConfig()` branches exist but still read mock data until full client wiring is added.
3. **In-memory admin mutations:** `mockEvents`, `mockFights`, etc. exported as `let` for server action updates; resets on cold start.
4. **ResultsForm client action:** Uses client-side `settleFight` call; works in dev; verify in production deployment.

---

## 8. Verification checklist

| Check | Status |
|-------|--------|
| Rating logic isolated from UI | Yes |
| `scheduledRounds` drives round UI | Yes |
| Draw wrong = -15 (V2) | Test #9 |
| Draw correct +20 (V2) | Test #8 |
| Provisional/Inactive ranks | `rankings.ts` |
| Pick page uncluttered | No leaderboard on `/picks` |
| Tests | `npm test` |
| Build | `npm run build` |

---

---

## Difficulty-Based Rating Migration (V2 — 2026-06-03)

### Files changed

- `src/lib/rating/calculateRatingChange.ts` — tier-based scoring
- `src/lib/rating/tierRatings.ts` — central table (new)
- `src/lib/rating/getEffectivePickTier.ts` (new)
- `src/lib/rating/validateFavouriteFields.ts` (new)
- `src/lib/rating/gradingDetails.ts` (new)
- `src/lib/rating/tierTypes.ts` (new)
- `src/lib/rating/constants.ts` — removed popularity constants; max loss -20
- `src/lib/rating/calculateRatingChange.test.ts` — V2 tests
- `src/lib/grading/gradeFight.ts` — pass favourite fields; popularity analytics
- `src/types/index.ts`, `src/types/grading.ts`
- `src/data/mock.ts` — favourite fields on all fights
- `supabase/schema.sql`, `supabase/migrations/20260603_favourite_rating_v2.sql`
- `src/app/actions/admin.ts`, `src/app/admin/fights/page.tsx`
- `src/components/admin/AdminFightFields.tsx` (new)
- `src/app/admin/results/ResultsForm.tsx` — show popularity in summary
- `docs/RATING_SYSTEM_IMPLEMENTATION.md` — rewritten for V2

### Database changes

- `fights.favourite_side` (`fighterA` | `fighterB` | `none`)
- `fights.favourite_level` (`heavy_favourite` | `favourite` | `even`)
- CHECK constraint `fights_favourite_consistency`

### Test changes

- Removed popularity-based gain tests
- Added 14+ V2 tier tests + tier mapping tests
- Run: `npm test`

### New formula (summary)

Effective tier from admin favourite fields + user pick → `TIER_RATINGS[tier]` base → sub-picks if main correct → clamp [-20, +75]. Popularity stored in `grading_details` only.

### Assumptions

- Admin correctly classifies fights
- No retroactive regrade of V1-graded predictions
- Draw tier: correct +20, wrong -15 (confirmed)

### Remaining limitations

- Popularity/sybil still possible for analytics distortion (not scoring)
- Mis-tagged favourite fields misprice entire fight
- Hybrid popularity modifier not built (documented only)

---

## Display rank ladder (profile UI)

- Added 12-step **display-only** progression in `src/lib/profile/ratingTiers.ts` (Novice → All-Time Great).
- Internal numeric ratings in `profiles` are **unchanged**; V2 scoring untouched.
- Profile/sport UI shows rank name + progress; raw rating is secondary text only.

---

*End of build log.*
