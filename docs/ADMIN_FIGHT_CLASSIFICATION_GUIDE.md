# PickChamp — Admin Fight Classification Guide

This guide explains how to set **Favourite Side** and **Favourite Level** when creating or editing fights in the admin dashboard.

These fields control how user predictions are scored. They describe **real-world fight difficulty**, not how many PickChamp users pick each fighter.

---

## Why this matters

The rating engine maps each user’s pick to an **effective tier** (favourite, underdog, even, draw, etc.) and applies fixed point values from that tier.

**Wrong classification distorts ratings for everyone on that fight.**

Example mistake:

| Admin sets | Reality |
|------------|---------|
| Fighter A, **Heavy Favourite** | Genuinely **even** fight |

If Fighter B wins:

- Users who picked B may receive **+40** (heavy underdog) instead of **+15** (even winner).
- Users who picked A and lost take **-15** instead of a balanced even-fight penalty.

The system is only as fair as the lines you assign. Take a moment to classify each fight before lock time.

---

## Fields overview

| Field | Purpose |
|-------|---------|
| **Favourite Side** | Who is favoured, or none for a true pick’em |
| **Favourite Level** | How strong that favouritism is (or even) |

### Valid combinations (enforced by the app)

| Favourite Side | Allowed Favourite Level |
|----------------|-------------------------|
| **None (Even Fight)** | Even only |
| **Fighter A** or **Fighter B** | Favourite or Heavy Favourite |

You cannot set “Even” level with a named favourite side, or “Favourite” / “Heavy Favourite” with side “None.”

---

## Classification bands

Use your best judgment of **expected win probability for the favoured fighter** (or either fighter for a true even matchup). These are guidelines, not exact science.

### Even

- **Rough expected win probability:** 40–60% for either fighter (genuine competitive balance)
- **Favourite Side:** `None`
- **Favourite Level:** `Even`

Both fighters are live; neither is a clear betting or narrative favourite. Upsets are possible but not “shock” territory.

**Rating impact (winner correct):** +15 base  
**Rating impact (wrong main pick):** -15

---

### Favourite

- **Rough expected win probability:** 60–79% for the favoured fighter
- **Favourite Side:** `Fighter A` or `Fighter B` (whoever is favoured)
- **Favourite Level:** `Favourite`

The favoured fighter should win more often than not, but the opponent has a real path to victory (styles, activity, recent form, size of stage).

**Rating impact — pick the favourite, favourite wins:** +10  
**Rating impact — pick the underdog, underdog wins:** +25  
**Wrong picks:** -12 (favourite tier) / -10 (underdog tier) depending on what the user picked

---

### Heavy Favourite

- **Rough expected win probability:** 80%+ for the favoured fighter
- **Favourite Side:** `Fighter A` or `Fighter B`
- **Favourite Level:** `Heavy Favourite`

The opponent is a large underdog on paper: mismatch in class, experience, rankings, or promotion narrative. A win would be a major upset.

**Rating impact — pick the favourite, favourite wins:** +5  
**Rating impact — pick the underdog, underdog wins:** +40  
**Wrong picks:** -15 (favourite tier) / -8 (underdog tier) depending on what the user picked

Do **not** use Heavy Favourite for every fight where one name is better known. Use it when an 80%+ expectation is defensible.

---

## Worked examples

### Example 1: Fury vs Usyk — **Even**

- Two elite heavyweights, competitive styles, no clear 80%+ side in a fair market.
- **Favourite Side:** None  
- **Favourite Level:** Even  

Regardless of whether British or American users heavily pick Fury on PickChamp, **do not** tag Fury as Heavy Favourite just because the crowd favours him. Crowd bias is visible in analytics; your job is real-world difficulty.

---

### Example 2: Champion vs overmatched opponent — **Heavy Favourite**

- Reigning champion vs late replacement, or ranked prospect vs journeyman with no comparable wins.
- Expected win probability for the champion is **80%+**.
- **Favourite Side:** Fighter A (champion) or Fighter B, whichever is the champion  
- **Favourite Level:** Heavy Favourite  

If the journeyman wins, underdog picks earn a large reward (+40 base); missing the favourite hurts (-15).

---

### Example 3: Modest favourite vs live underdog — **Favourite**

- #3 ranked vs #8 ranked, or champion vs solid mandatory challenger who can win rounds.
- Favoured fighter is **60–79%** likely to win, not a squash.
- **Favourite Side:** the modest favourite (A or B)  
- **Favourite Level:** Favourite  

A correct underdog pick pays +25; a correct favourite pick pays +10. This reflects real difficulty without treating the dog as a lottery ticket.

---

## Draw picks (user-facing, not admin fields)

Users may pick **Draw** on boxing fights. Draw scoring is fixed in the rating table:

- Correct draw: **+20**
- Wrong draw: **-15**

Admin classification does not include a separate “draw line.” Classify the **fighter vs fighter** matchup using the bands above. Draw is a third outcome users can select; it is not a substitute for tagging a fight as even.

---

## Quick decision checklist

Before saving a fight, ask:

1. **Is either fighter ~80%+ to win?**  
   - Yes → Heavy Favourite on that fighter  
   - No → continue  

2. **Is either fighter ~60–79% to win?**  
   - Yes → Favourite on that fighter  
   - No → continue  

3. **Is it genuinely ~40–60% either way?**  
   - Yes → None + Even  

4. **Am I copying PickChamp pick counts?**  
   - If yes, stop. Use fight knowledge, records, styles, and market context—not current app popularity.

---

## Popularity vs classification

After lock, grading stores **pick popularity** (percent on Fighter A, B, Draw) for analytics only. Popularity **does not** change rating points.

Use popularity reports to see:

- Crowd bias (e.g. 85% on one fighter in an even fight)
- Whether your line matched community sentiment

Do **not** use popularity to choose `favourite_side` or `favourite_level`.

---

## If you need to fix a mistake

If a fight is misclassified **before lock time:** edit the fight in admin and correct side/level.

If the fight is already **settled and graded:** changing fields does not retroactively regrade predictions unless a manual regrade process is run (not part of standard MVP). Get classifications right before settle.

---

## Summary table

| Level | Win prob (fav) | Side | Level field |
|-------|----------------|------|-------------|
| Even | ~40–60% either | None | Even |
| Favourite | ~60–79% fav | Fighter A or B | Favourite |
| Heavy Favourite | ~80%+ fav | Fighter A or B | Heavy Favourite |

**Remember:** Accurate classification keeps PickChamp fair. When in doubt between Favourite and Even, choose **Even** rather than inflating favourite strength.

---

*For technical scoring details, see `docs/RATING_SYSTEM_IMPLEMENTATION.md`.*
