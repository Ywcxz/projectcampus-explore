# Hop-It, a later module (`hop-it`)

*Extracted. A labeled mock-up only (D-098, D-102). Chapter 3.7; the Alpha PRD and Functional Specification control (D-027).*

## Place and access

- **Place:** the parking lot's motorcycles on the campus (proposed), or the edge with the later modules.
- **Parent:** `campus`.
- **Opens:** a scheduled window (a card); a pooled run (a card); the name (a card, D-164); a "later module" card.

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-14 | Individual food runs duplicate effort across scattered campus demand | A question | Survey: "Getting around", "When you can't go out"; Hop-It's Alpha metrics, when taken up |

## Today / with CAMPUS

- **Today** [Unresolved]: each order a separate trip. The upper and lower campus distances are the author's observations, not measurements (Ch 3.7).
- **With CAMPUS, a later module** [Proposed]: customers accept a scheduled window, so orders can be pooled into one rider's run (Ch 3.7).

## Related work

| Card | How CAMPUS differs | VSU need | Source |
| --- | --- | --- | --- |
| foodpanda and Grab's pabili | Scheduling and errands exist; pooling scheduled orders into shared runs is Hop-It's difference | Scattered demand on a large campus, if the survey and the Alpha show it | Ch 10 |
| Campus delivery robots | Starship's robots found about seven months of work a year; pooled demand may fall away in breaks too | When an Alpha runs (Q-19) | E-008 |

## Objects

| Object | Opens | Callback |
| --- | --- | --- |
| A clock with a window | card: scheduled windows | — |
| A rider's route with several stops | card: the hypothesis | — |
| A "later" tag | card: later modules wait for evidence | `marketplace`, `housing` |

## Words

- **Title:** Hop-It, a later module.
- **Summary, draft:** "A later module, shown as a mock-up: orders that wait for a delivery window, pooled into one rider's run. Would pooling cut effort without making deliveries worse? A test would measure it." (32 words)
- **Narration:** to write.

| Claim | Tag | Source |
| --- | --- | --- |
| Hop-It is a later module of the network; its specification is kept for when it is taken up. | Established | D-098; D-027 |
| Scheduled bundled delivery would reduce effort per order without breaking guardrails on lateness, cancellations, failures, or acceptability. | Proposed | Ch 3.7 |
| A disproved hypothesis is a valid Alpha result. | Established | Ch 3.7 (PRD §20) |
| Hop-It is not run as a business in its Alpha. | Established | D-097 |

## Animation beats

1. Orders pop up across the campus at random; separate riders zigzag.
2. A window clock appears; orders gather; one rider makes one loop with several stops.
3. A "later module" tag holds the frame.

## Findings slot

"When you can't go out" and "Getting around" for demand (P-14); the Alpha's own report, when taken up.

## Kit pieces

Reuse: `motoTrip`, `journey`, `world(false)`, `sampleTag`. `madeUp`: `later-module`.
