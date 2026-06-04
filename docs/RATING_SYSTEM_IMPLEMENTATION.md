# PickFist Rating System — Implementation Reference (V2)

This document describes the **difficulty-based** rating system (V2). Popularity no longer affects `ratingChange`.

---

## 1. Why popularity scoring was replaced

**V1 (removed):** Base gain used pick popularity at grade time:

```text
baseGain = clamp(10 × ((1 - p) / p), +3, +60)
```

**Problem:** This measured how many PickFist users agreed with you, not real-world fight difficulty. Example: Fury vs Usyk (genuinely even) with 85% Fury picks → Usyk winner got maximum rarity reward.

**V2:** Admin sets `favourite_side` + `favourite_level`. Each user pick maps to an **effective tier**. Base score comes from a fixed table. Popularity is stored for analytics only.

---

## 2. File locations

| Purpose | Path |
|---------|------|
| Main rating calculation | `src/lib/rating/calculateRatingChange.ts` |
| Tier table | `src/lib/rating/tierRatings.ts` |
| Effective tier mapping | `src/lib/rating/getEffectivePickTier.ts` |
| Admin field validation | `src/lib/rating/validateFavouriteFields.ts` |
| Grading audit shape | `src/lib/rating/gradingDetails.ts` |
| Sub-pick constants & clamps | `src/lib/rating/constants.ts` |
| Helpers (clamp, near round) | `src/lib/rating/helpers.ts` |
| Tests | `src/lib/rating/calculateRatingChange.test.ts`, `getEffectivePickTier.test.ts` |
| Batch grading | `src/lib/grading/gradeFight.ts` |

---

## 3. Database fields

On `fights`:

| Column | Values |
|--------|--------|
| `favourite_side` | `fighterA`, `fighterB`, `none` |
| `favourite_level` | `heavy_favourite`, `favourite`, `even` |

**Constraints:**

1. `favourite_side = none` → `favourite_level = even`
2. `favourite_level = even` → `favourite_side = none`
3. `favourite_side` in (`fighterA`,`fighterB`) → `favourite_level` in (`favourite`,`heavy_favourite`)

Migration: `supabase/migrations/20260603_favourite_rating_v2.sql`

---

## 4. Effective tier mapping (`getEffectivePickTier`)

| Condition | User pick | Effective tier |
|-----------|-----------|----------------|
| Any | `draw` | `draw` |
| `none` + `even` | A or B | `even` |
| `fighterA` + `heavy_favourite` | A | `heavy_favourite` |
| `fighterA` + `heavy_favourite` | B | `heavy_underdog` |
| `fighterB` + `heavy_favourite` | B | `heavy_favourite` |
| `fighterB` + `heavy_favourite` | A | `heavy_underdog` |
| `fighterA` + `favourite` | A | `favourite` |
| `fighterA` + `favourite` | B | `underdog` |
| `fighterB` + `favourite` | B | `favourite` |
| `fighterB` + `favourite` | A | `underdog` |

---

## 5. Base rating table (`TIER_RATINGS`)

| Tier | Correct | Wrong |
|------|---------|-------|
| heavy_favourite | +5 | -15 |
| favourite | +10 | -12 |
| even | +15 | -15 |
| underdog | +25 | -10 |
| heavy_underdog | +40 | -8 |
| draw | +20 | -15 |

**Draw rationale:** Correct draw (+20) beats even-winner (+15) but is not double even reward (old +30 concern). Wrong draw -15 discourages spam.

---

## 6. Formula

```text
IF voided (cancelled | no_contest): ratingChange = 0

tier = getEffectivePickTier(predictedOutcome, favourite_side, favourite_level)

IF main wrong:
  ratingChange = TIER_RATINGS[tier].wrong
  (ignore method, round, perfect)

IF main correct:
  raw = TIER_RATINGS[tier].correct
      + method (+4 / -2 / 0)
      + round (+8 / +3 / -3 / 0)
      + perfect (+5 if main + method + exact round)

ratingChange = clamp(raw, -20, +75)
```

Popularity **does not** enter this formula.

---

## 7. Sub-predictions (unchanged from V1)

Only apply when main pick is correct.

| Sub | Correct | Wrong | Not selected |
|-----|---------|-------|--------------|
| Method | +4 | -2 | 0 |
| Round exact | +8 | — | — |
| Round near (±1) | +3 | — | — |
| Round wrong | -3 | — | — |
| Perfect | +5 | — | requires main + method + exact round |

---

## 8. Popularity (analytics only)

At grade time, `gradeFight.ts` computes pick counts and `buildPopularityPercentages()` → whole-fight % (0–100 per outcome).

Stored in:

- `grading_details.popularity` per prediction
- `GradingSummary.popularity` on admin settle

**Does not affect `ratingChange`.**

---

## 9. `grading_details` audit JSON

Each graded prediction stores:

```json
{
  "effectiveTier": "heavy_underdog",
  "favouriteSide": "fighterA",
  "favouriteLevel": "heavy_favourite",
  "baseTierScore": 40,
  "methodAdjustment": 4,
  "roundAdjustment": 8,
  "perfectBonus": 5,
  "popularity": { "fighterA": 82, "fighterB": 15, "draw": 3 },
  "finalRatingChange": 57,
  "explanation": "..."
}
```

On wrong main: `methodAdjustment`, `roundAdjustment`, `perfectBonus` are 0; `baseTierScore` is the tier wrong value (negative).

---

## 10. Future hybrid (NOT implemented)

Documented possibility only:

- Base from difficulty tier (current V2)
- Small popularity modifier (e.g. 0–+10 on even fights)

Do not implement without explicit product approval.

---

## 11. Historical data

Predictions graded under V1 popularity formula are **not** retroactively regraded. New settles use V2 only.

---

## 12. Test cases (`npm test`)

1. Even fight winner +15  
2. Favourite correct +10  
3. Underdog correct +25  
4. Heavy fav correct +5  
5. Heavy fav underdog correct +40  
6. Heavy fav wrong -15  
7. Heavy underdog wrong -8  
8. Draw correct +20  
9. Draw wrong -15  
10. Wrong main ignores subs  
11. Correct main + method + round  
12. Perfect bonus  
13. No contest 0  
14. Cancelled 0  
+ popularity does not change rating  
+ grading_details fields populated  

---

## 13. Example: Fury vs Usyk

Admin: `favourite_side = none`, `favourite_level = even`.

User picks Usyk, Usyk wins → tier `even` → **+15** (not +60 from old 15% popularity).

---

*End of V2 rating implementation reference.*
