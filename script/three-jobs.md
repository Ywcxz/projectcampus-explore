# Where a question goes (`three-jobs`)

*Directed and drawn, 16 November 2026: the second sample, in the lean form (see "The lean form"). The pitch plan's C2. Step 7 of the offices path (Ch 2.4). Chapters 2, 2.2, 8. campus-review is not yet run on this sheet; it runs before the pull request is merged.*

One idea: today a question splits three ways; with the network it takes one route, and the answer stays.

## Place and access

- **Place:** the campus from above, the kit's own (`world(false)`), a little faded. Kinds of place only (D-153).
- **Parent:** `campus`, from "A question finds its answer", which now opens this scene instead of the card `route`.
- **Opens, drawn:** seven cards (see Objects). Four are cards the site already had.
- **Opens, waiting:** `who-to-ask`, `across-roles`, `batch`. None is drawn yet.

## Problem

| P- | Shown as | How we'd find out |
| --- | --- | --- |
| P-10 | The question sinks in a group chat | Survey: "Finding an old answer" |
| P-03, P-06 | Three answers that look alike | Survey: "Was it right?"; Facebook study H1, H2 |
| P-02 | A walk past two wrong doors | Survey: "Tries it took", "A new office" |
| P-01 | A claim only, not drawn | Survey; Facebook study H1 |

All are [Unresolved], and each is worded as a question. The picture must not say any of them happens at VSU.

## Today / with CAMPUS

- **Today** [Unresolved]: one question leaves a dormitory and splits three ways.
- **With CAMPUS** [Proposed]: the same question takes one route by way of the front desk to one office (routing). An answer comes back with its label, source, and date (trust). It stays on a shelf at that place, where a later student finds it (memory). A card carries it into the group chat, which is still there.

Switch labels: "Today" and "With CAMPUS", as in `morning` and `elsewhere`. The plan's longer labels do not fit the site test's three words; "as we ask it" and "proposed" are carried by the tags and the summaries.

## Objects

| Object | State | Label | Opens |
| --- | --- | --- | --- |
| `chat` | Today | Buried under newer messages? | card `buried` (new) |
| `group` | Today | Three answers that look alike | card `look-alike` (new) |
| `walk` | Today | Two doors before the right one | card `several-visits` (new) |
| `routing` | With CAMPUS | One route, by the front desk | card `route` |
| `trust` | With CAMPUS | Label, source, and date | card `labels` |
| `memory` | With CAMPUS | Kept for the next batch | card `kept` |
| `chat-card` | With CAMPUS | A card into the group chat | card `share-cards` |

## Words

The words are in `data/scenes.json`, which is their one copy: the scene `three-jobs`, its second state, and the cards `buried`, `look-alike`, and `several-visits`. The two summaries are the plan's C2 lines, unchanged.

| Claim | Tag | Source |
| --- | --- | --- |
| The four problems above, each as a question with how it will be found out | Unresolved | P-01, P-02, P-03, P-06, P-10 |
| The network is built for three jobs: routing, memory, and trust | Proposed | Ch 2 |
| Questions are routed, not broadcast | Established | D-071 |
| Answers would stay findable, dated, and marked when out of date | Proposed | Ch 2 |
| Office replies marked official; others carry a name and a role | Proposed | Ch 2 |
| The network complements group chats; answers travel as cards | Established | D-074 |
| The front door writes no answers | Established | D-181 |

## The picture

No words. Layers 1 to 3 are the kit's hills, ground, and places. Layer 4 holds everything else:

- **Both states:** the question, a dark bubble above a dormitory; a group chat panel, top left.
- **Today:** two dotted arcs, to the chat and to a community group's panel, top right; in the chat the question sits faded under three newer messages; in the group, three look-alike replies, each with its source and date marks lost; on the ground, a dotted walk to two doors marked with a red cross, then to an office ringed in gold.
- **With CAMPUS:** one green route from the question to the office, with a small desk and bell midway; a labeled answer beside the question, tied back to the office; the same answer on a lit shelf by the office, and a student below it; the answer as a card in the chat.

## Animation beats

Today, on entering: the question (0.4 s), the chat and its arc (1.3 s), the group and its arc (1.75 s), the walk (2.2 s). With CAMPUS, on switching: today's pieces fade; the route at once, the answer at 0.5 s, the shelf at 0.9 s, the card in the chat at 1.3 s. Nothing loops but the route's moving dashes.

**Less motion:** the finished picture of each state, at once.

## Findings slot

Each object's card takes its number once the survey and the study have one: old answers not found (P-10), answers that were wrong or unclear (P-03), tries a task took (P-02).

## Kit pieces

Reused: `world`, `hills`, `copy` (now takes an icon), `mark`, `isoPerson`, `.wake`, `.flow`. New, inside `threeJobs()`: the question bubble, a chat panel, a dotted arc. No new CSS.

## The lean form

From this scene on, a sheet is directed in this shorter form, to keep the cost of each scene down: the words live only in `data/scenes.json`; the picture is the kit's backdrop plus a few marks; cards are reused where one already says it; and a scene gets one look per state in a headless browser.

## Questions for Leo

1. **The lean form:** is this enough detail for the remaining scenes?
2. **The made-up label** is "Illustration" in both states, since the picture has no words. The plan asked for "Mock-up on made-up content" in the second state.
3. **"What it will never have"** (the plan's N7) is left out of this scene; it gets its own.
4. **Talking across roles** has no object here. D-201 makes it part of routing; `across-roles` carries it.
