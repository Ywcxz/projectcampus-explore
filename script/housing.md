# Housing, a later module (`housing`)

*Extracted. A labeled mock-up only (D-098, D-102). Chapter 3.6.*

## Place and access

- **Place:** the edge of the map: the road off campus, toward boarding houses (proposed). University dormitories are not part of Housing (D-098).
- **Parent:** `campus`.
- **Opens:** a listing (a card); the way to campus (a card, linking `twin`); a "later module" card.

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-22 | Finding a boarding house or rental near campus runs on word of mouth and group posts; listings go stale, and students can't easily compare vacancy, price, house rules, or safety | A question | Survey: "Finding a place" (yes, once; yes, more than once), "Finding where you reside" |

Chapter 8's worked example uses made-up numbers for this problem; the site must not use them.

## Today / with CAMPUS

- **Today** [Unresolved]: word of mouth and group posts, with stale listings.
- **With CAMPUS, a later module** [Proposed]: listings that describe the property, never who lives there; vacancy confirmed by the landlord at a set interval, so old listings expire; reviews from verified members after their stay (Ch 3.6).

## Related work

Rental listing sites, and students' own boarding-house tools, by the author's account (Ch 3.6; Ch 10). The network links to a working tool rather than rebuilding it (D-064). Whether VSU or Baybay City accredits boarding houses is open (Q-50).

## Objects

| Object | Opens | Callback |
| --- | --- | --- |
| A house with a listing | card: what a listing shows | — |
| The road to campus | card: distance and the way there | `twin` |
| A "later" tag | card: later modules wait for evidence | `marketplace`, `hop-it` |

## Words

- **Title:** Housing, a later module.
- **Summary, draft:** "A later module, shown as a mock-up: boarding houses near campus, listed by property, never by who lives there, with vacancy the landlord confirms. Is it needed? Not yet known: the survey asks." (33 words)
- **Narration:** to write.

| Claim | Tag | Source |
| --- | --- | --- |
| Housing is a later module, for boarding houses and rentals near campus; university dormitories stay with VSU's own housing information. | Established | D-098 |
| VSU's 25 dormitories and cottages had 1,772 resident students in 2023. | Established | E-010 |
| How many VSU students live off campus is not known here. | Unresolved | Ch 3.6 |
| Is finding housing near campus hard? Not yet known. | Unresolved | P-22 |

## Animation beats

1. A row of houses off the campus edge; a listing card with a "later module" tag.
2. A listing's "vacant" mark fades when it isn't reconfirmed.

## Findings slot

The survey's share for "Finding a place", among all and among those asked (D-109), for which later module comes first (Q-48).

## Kit pieces

Reuse: `bldg`, `post`, `sampleTag`. `madeUp`: `later-module`.
