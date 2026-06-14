# Bootstrap Top 10 Rankings — Implementation Reference

**Status:** Implemented (review-approved)  
**Purpose:** Handoff document for agent/product review before git commit  
**Last updated:** June 2026  
**Related:** `docs/PICKFIST_CODE_BIBLE.md` §12 (Rankings), rankings page UI redesign

---

## 1. Executive summary

PickFist uses **14 static, app-layer seed profiles** to populate the `/rankings` Top 10 on the live site when few real users have qualified. These are **not** Supabase auth accounts, **not** in the `predictions` table, and **do not** participate in grading, prizes, or admin.

Seeds merge **only** into leaderboard ranking calculations (`getLeaderboard`, `getProfileRanks`). They fade out **automatically** as genuine **eligible** users fill Top 10 slots per tab — not when individual users surpass seed scores.

**Enable on production:** `PICKFIST_SEED_RANKINGS=true` on Vercel + redeploy. **Default everywhere else:** off (opt-in only).

---

## 2. Product intent

| Goal | How seeds support it |
|------|----------------------|
| Site feels active at launch | Top 10 populated on Global, Boxing, MMA |
| New users can catch up | Seed ratings capped at **1075**; leaders ~**1045–1068** |
| Temporary, not permanent | Progressive replacement; no DB pollution |
| Fair competition | Real users always win collisions; same sort rules for everyone |
| Credible UX | Seed rows link to minimal read-only profile pages; same card design as real users |

Seeds are **starter leaderboard entries only**. They do not make future picks, receive prizes, or count as active users for analytics.

---

## 3. What was NOT changed (invariants)

Reviewers must verify these remain untouched:

| Area | Files / behaviour |
|------|-------------------|
| Rating formula | `src/lib/rating/calculateRatingChange.ts`, `TIER_RATINGS` |
| Eligibility thresholds | `GLOBAL_RANK_ELIGIBILITY=10`, boxing/MMA `=5` in `constants.ts` |
| Leaderboard sort | `sortLeaderboard()` in `src/lib/rankings.ts` — rating → graded count → accuracy → username |
| Grading pipeline | `gradeFight.ts`, admin settle flow |
| Seed merge scope | Never in `getAllProfiles()`, admin, auth, predictions |
| Database schema | No `is_seed` column; no `auth.users` rows for seeds |

---

## 4. Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│  /rankings (RankingsClient)                                      │
│    loadLeaderboardAction(tab)                                    │
│    getRankingsUserContextAction(tab)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/lib/data/profiles.ts                                        │
│    getLeaderboard(tab)              ← ranking merge                  │
│    getProfileRanks(profile)         ← ranking merge                  │
│    getProfileByUsername(username)   ← seed profile resolution only   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              realProfiles = getAllProfiles()  ← Supabase OR mock.ts
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/lib/rankings/seedRankings.ts                                │
│    mergeProfilesForRankings(realProfiles, tab)                   │
│      if !seedRankingsEnabled() → return realProfiles only        │
│      seedsToShow = max(0, TARGET - realEligibleCount)            │
│      append top seedsToShow eligible seeds (by tab rating)         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/lib/rankings.ts (unchanged sort/eligibility)                │
│    sortLeaderboard(mergedProfiles, tab)                          │
│    assignOfficialRanks(sorted)                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key principle:** Seeds are appended to the real profile list **before** sort. Real and seed profiles compete in the **same** `sortLeaderboard()` pass. A real user with a higher rating ranks above seeds naturally.

---

## 5. File map

| File | Role |
|------|------|
| `src/data/seedRankingsProfiles.ts` | 14 static `Profile` objects; UUID prefix `…-b000-…` |
| `src/lib/rankings/seedRankings.ts` | Merge logic, collision filter, `isSeedRankingsProfile()` |
| `src/lib/config.ts` | `seedRankingsEnabled()`, `getSeedRankingsTarget()` |
| `src/lib/data/profiles.ts` | Ranking merge + seed public-profile resolution |
| `src/app/actions/rankings.ts` | Server actions; uses `getLeaderboard` / user context |
| `src/components/profile/ProfilePageContent.tsx` | Minimal seed profile UI (no fake pick history) |
| `src/lib/rankings/seedRankings.test.ts` | Unit tests for merge, fade-out, collisions |
| `.env.example` | Documents env vars |
| `docs/PICKFIST_CODE_BIBLE.md` | §12 bootstrap subsection |

**Rankings UI** (same design for seeds and real users):  
`RankingsLeaderboard`, `RankingPodiumCard`, `RankingStandardCard`, `RankingsUserPositionCard`, etc.

---

## 6. Seed profile data (`seedRankingsProfiles.ts`)

### Identity

- **Count:** 14 profiles (pool size > 10 so each tab can fill 10 slots).
- **ID prefix:** `00000000-0000-4000-b000-00000000000N` — detectable via `isSeedRankingsProfileId()`.
- **No auth:** IDs are not in `auth.users` or Supabase `profiles`.

### Usernames

```
kierancole, amirpicks, nicosantos, samhollis, jayv, owencastillo,
frankied, the_clinch, rafavega, masonq, leonmercer, coryvale,
darrenc, elenaruiz
```

### Rating design (“catchable” band)

| Constraint | Value |
|------------|-------|
| Hard max (any rating field) | **1075** |
| Typical leader (global) | **1065–1068** (`Kieran Cole`) |
| Lower seeds | **1008–1055** |
| Default baseline | 1000 (same as real users) |

### Tab eligibility (graded pick counters on profile)

| Tab | Threshold | Seeds eligible in pool |
|-----|-----------|------------------------|
| Global | ≥10 graded picks (`boxing_picks + mma_picks`) | 14 |
| Boxing | ≥5 `boxing_picks` | 10 |
| MMA | ≥5 `mma_picks` | 10 |

Counters represent **graded** picks (same as real profiles after `gradeFight`), not raw prediction rows.

### Overlap strategy

- Boxing-heavy, MMA-heavy, and mixed profiles so **each tab can show 10 seeds** when `realEligible = 0`.
- Not every tab shows the same 10 names (by design).

---

## 7. Progressive fade-out algorithm

Implemented in `mergeProfilesForRankings()` (`seedRankings.ts`).

### Step-by-step

1. **Gate:** If `seedRankingsEnabled()` is false → return `realProfiles` unchanged (zero seeds).
2. **Count real eligible:** Profiles in `realProfiles` passing `isEligibleForOfficialRank(profile, tab)`.
3. **Compute slot budget:**
   ```
   seedsToShow = max(0, TARGET - realEligible)
   ```
   - `TARGET` = `PICKFIST_SEED_RANKINGS_TARGET` (default **10**).
4. **Filter available seeds:** Remove any seed whose `id` or **normalized username** matches a real profile (real always wins).
5. **Select seeds:** Among remaining seeds eligible for this tab, sort by **tab-specific rating** descending; take top `seedsToShow`.
6. **Return:** `[...realProfiles, ...selectedSeeds]` — then existing `sortLeaderboard()` runs.

### Interpretation

- Seeds fill **empty slots** up to TARGET as genuine **eligible** users qualify — not when real users individually exceed seed scores.
- When `realEligible >= TARGET`, `seedsToShow = 0` → **all seeds hidden** for that tab (even if some seeds still have higher ratings than some reals).
- When `0 < realEligible < TARGET`, only the top `seedsToShow` seeds by rating are selected; lowest-rated seeds in the pool drop first.
- Once real users exceed TARGET, the leaderboard shows **all** genuine eligible users with no cap.

### Example (Global tab, TARGET=10)

| Genuine eligible users | Seeds selected | Rows after sort (eligible only) |
|------------------------|----------------|----------------------------------|
| 0 | 10 | 10 seeds |
| 3 | 7 | 3 real + 7 seeds → 10 |
| 7 | 3 | 7 real + 3 seeds → 10 |
| 10 | 0 | 10 real |
| 15 | 0 | 15 real (all genuine; no cap) |

Each tab (**global**, **boxing**, **mma**) runs this **independently** per request.

### Worked example with ratings

Launch: 0 real users → Global shows top 10 seeds by `global_rating` (e.g. `Kieran Cole` #1 at 1065).

After 3 real users qualify with ratings 1040, 1035, 1020:
- `seedsToShow = 7`
- Merge includes all 3 real + 7 highest seeds
- `sortLeaderboard` orders by rating → reals and seeds interleave fairly
- Lowest seeds (e.g. `Mason Quinn` at 1008) fall out of the selected 7 first

When the 10th real user qualifies:
- `seedsToShow = 0` → leaderboard is 100% genuine (for that tab).

---

## 8. Environment variables

| Variable | Default | Effect |
|----------|---------|--------|
| `PICKFIST_SEED_RANKINGS` | **off** (must be `"true"` to enable) | Opt-in master switch |
| `PICKFIST_SEED_RANKINGS_TARGET` | `10` | Target visible rows per tab during bootstrap |

**Production:** set `PICKFIST_SEED_RANKINGS=true` on Vercel and redeploy.

**Important:** On Vercel, changing env vars requires a **redeploy** before the running app picks up new values.

### Disable bootstrap

Omit the variable or set `PICKFIST_SEED_RANKINGS=false` (default in `.env.example`).

---

## 9. Integration points (strict scope)

### Ranking merge

| Function | File | Why |
|----------|------|-----|
| `getLeaderboard(tab)` | `profiles.ts` | `/rankings` Top 10 list |
| `getProfileRanks(profile)` | `profiles.ts` | User’s official rank on profile matches leaderboard |

Both call `mergeProfilesForRankings()` then `sortLeaderboard()`.

### Seed profile resolution (not ranking merge)

| Function | File | Why |
|----------|------|-----|
| `getProfileByUsername()` | `profiles.ts` | Returns static seed profile for `/profile/[username]` when no real user matches |

### Where seeds are NOT used

| Function / area | Reason |
|-----------------|--------|
| `getAllProfiles()` | Admin, raw user lists |
| `fetchAllProfiles()` in admin actions | Admin dashboard |
| Auth / signup | No seed accounts |
| `predictions` table | No seed picks |
| Analytics | Not real users |
| Future prizes / Fight Picker of the Night | Must filter with `isSeedRankingsProfile()` |

Export for future features:

```ts
import { isSeedRankingsProfile } from "@/lib/rankings/seedRankings";
```

---

## 10. Collision handling

Real users **always** take precedence over seeds.

A seed is excluded from merge when:

1. A real profile shares the same `id`, or  
2. A real profile shares the same **normalized username** (`normalizeUsername()` from `src/lib/auth/username.ts`).

**Public profile resolution order:**

1. Fetch real profile (Supabase or mock).
2. If found → return real (never block a real user who claimed a seed username).
3. Else if bootstrap on → return seed profile from static list.
4. Else → `null` (404).

---

## 11. UI behaviour

### Rankings page

- Seeds and real users use **identical** card components (`RankingPodiumCard` / `RankingStandardCard`).
- Cards link to `/profile/[username]`.
- “Your Position” strip and TOP 10 section are separate UI layers; neither affects merge logic.

### Seed profile pages

Minimal read-only view via `ProfilePageContent` when `isSeedRankingsProfile(profile)`:

- Shows stats from static profile counters (rating, tier, W–L, ranks).
- **Current picks:** “No current picks available.”
- **Recent results:** “No recent public picks available.”
- No fabricated prediction history.

---

## 12. Local development vs production

| Mode | Real profile source | Seeds (default) |
|------|---------------------|-----------------|
| Local mock (default) | `src/data/mock.ts` | **Off** — demo users only unless `PICKFIST_SEED_RANKINGS=true` |
| Local + flag `true` | mock or Supabase | Full bootstrap Top 10 preview |
| Production (Vercel `true`) | Supabase `profiles` | Bootstrap Top 10 |

Automated tests set `PICKFIST_SEED_RANKINGS=true` explicitly in `seedRankings.test.ts`.

---

## 13. Testing

Run:

```bash
npm test -- src/lib/rankings/seedRankings.test.ts
```

Coverage includes:

- Opt-in only (`PICKFIST_SEED_RANKINGS=true`); off when absent or `false`
- 10 global/boxing/MMA seeds when no real users
- Progressive removal when reals qualify
- All seeds gone when `realEligible >= TARGET`
- More than TARGET real users (no cap on reals)
- Username and ID collision exclusion
- Rating cap ≤ 1075
- Mock demo users + seeds = 10 rows

Full suite: `npm test` (369+ tests).

---

## 14. Removal playbook (post-launch)

### Automatic (preferred)

No action needed. As eligible real users reach 10 per tab, seeds stop appearing for that tab.

### Manual kill switch

1. Set `PICKFIST_SEED_RANKINGS=false` on Vercel.  
2. Redeploy.

### Code cleanup (when product confirms seeds obsolete)

1. Delete `src/data/seedRankingsProfiles.ts`  
2. Delete `src/lib/rankings/seedRankings.ts` + test file  
3. Remove merge calls from `profiles.ts`  
4. Remove seed branches from `ProfilePageContent` / `getProfileByUsername`  
5. Remove env vars from `.env.example` and Code Bible §12  
6. Remove `seedRankingsEnabled` from `config.ts`

No Supabase migration or data cleanup required (seeds were never in the DB).

---

## 15. Reviewer approval checklist

Before commit, confirm:

- [ ] **Scope:** Seeds only in `getLeaderboard`, `getProfileRanks`, `getProfileByUsername` — not `getAllProfiles` or admin.
- [ ] **Fade-out:** `seedsToShow = max(0, TARGET - realEligible)` per tab; verified by tests.
- [ ] **Fairness:** Sort/eligibility/grading unchanged; seeds use same rules once merged.
- [ ] **Catchable:** No seed rating > 1075; leader band ~1045–1068.
- [ ] **Collisions:** Real username/id always beats seed.
- [ ] **No fake picks:** Seed profiles show neutral empty states, not fabricated history.
- [ ] **Kill switch:** Documented; requires redeploy on Vercel.
- [ ] **Future prizes:** `isSeedRankingsProfile()` exported for exclusion when those features ship.
- [ ] **UI:** Rankings redesign treats seeds and reals identically on the leaderboard.
- [ ] **Tests pass:** `npm test` and `npm run build`.

---

## 16. Known limitations (by design)

1. **Seed ranks on profile hero** for real users include seeds in the comparison pool — intentional so “#7 World” matches `/rankings`.
2. **Graded pick count** for provisional users in “Your Position” uses profile counters, not raw prediction count.
3. **Gap to Top 10** uses rating delta vs displayed `#10` row, not rank position alone.
4. **Seeds do not age or gain rating** — static until removed from merge.
5. **No historical rank tracking** — no “↑2 places” indicators (none for real users either).

---

## 17. Quick reference — core merge function

```ts
// src/lib/rankings/seedRankings.ts (conceptual)
export function mergeProfilesForRankings(realProfiles, tab) {
  if (!seedRankingsEnabled()) return realProfiles;

  const realEligible = countRealEligible(realProfiles, tab);
  const seedsToShow = Math.max(0, getSeedRankingsTarget() - realEligible);
  const availableSeeds = getAvailableSeedProfiles(realProfiles);
  const selectedSeeds = selectSeedsForTab(availableSeeds, tab, seedsToShow);

  return [...realProfiles, ...selectedSeeds];
}
```

---

*End of bootstrap rankings implementation reference. Intended for pre-commit review by a second agent or product owner.*
