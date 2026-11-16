# Who do I ask? (`who-to-ask`)

*Directed and drawn, 16 November 2026, in the lean form (`three-jobs.md`). The pitch plan's N4, "Routed, not broadcast". Not on Chapter 2.4's eleven steps. Chapters 2, 2.2, 2.3, 8.*

One idea: today a question goes to everyone and to no one in particular; with the network it would go to a few people who chose its topic, then to the office responsible.

## Place and access

- **Place:** the campus from above, the kit's own (`world(false)`), a little faded. Kinds of place only (D-153).
- **Parent:** `campus`, from the services offices. That object's ID is now `services` (it was `orgs`), and it opens this scene instead of the card `to-come`.
- **Opens, drawn:** five cards (see Objects). Two are cards the site already had.
- **Opens, waiting:** `concerns` and `twin`. Neither is drawn yet.

## Problem

| P- | Shown as | How we'd find out |
| --- | --- | --- |
| P-03 | A question that spreads to everyone at once | Survey: "Asking first" |
| P-02 | Three buildings, each with a question mark | Survey: "Tries it took", "A new office", "Which office" |
| P-01, P-09 | Claims only, not drawn | Survey; Facebook study H1; interviews, by family at VSU |

All are [Unresolved], and each is worded as a question. The picture must not say that VSU's offices are hard to deal with (D-016; Ch 8). P-07 is left for a later pass: nothing in this picture shows it.

## Today / with CAMPUS

- **Today** [Unresolved]: one question leaves a dormitory and spreads to everyone; two people who happen to be online look up; which office handles it is not shown anywhere.
- **With CAMPUS** [Proposed]: the same question takes three routes to three people who chose its topic. Unanswered after a set time, it moves on to the office responsible. From there the student is handed into one of VSU's own systems (D-064).

Existing answers shown first is `batch`'s part and the front desk's; this scene starts where nothing has answered her, as the plan's line does.

## Objects

| Object | State | Label | Opens |
| --- | --- | --- | --- |
| `everyone` | Today | To everyone, or to no one? | card `broadcast` (new) |
| `which-office` | Today | Which office handles this? | card `several-visits` |
| `helpers` | With CAMPUS | Three who chose the topic | card `chose-topic` (new) |
| `office` | With CAMPUS | Unanswered? On to the office | card `route` |
| `hand-off` | With CAMPUS | Then into VSU's own systems | card `hand-off` (new) |

## Words

The words are in `data/scenes.json`, which is their one copy: the scene `who-to-ask`, its second state, and the cards `broadcast`, `chose-topic`, and `hand-off`. The second summary is the plan's N4 line, put in "would".

| Claim | Tag | Source |
| --- | --- | --- |
| The problems above, each as a question with how it will be found out | Unresolved | P-01, P-02, P-03, P-09 |
| Of 2,604 first-year students at the Main Campus in 2026, 1,248 (47.9%) are first-generation college students | Established | E-020 |
| Most social platforms broadcast a question to everyone in a group | Proposed | Ch 2.2 |
| Questions are routed, not broadcast; a few members who opted in, each told why; a weekly limit for each helper | Established | D-071 |
| Unanswered questions move to the office responsible | Established | D-071 |
| Routing uses only declared topics and joined communities, never inferred profiles | Established | D-071 |
| The network hands off rather than duplicates | Established | D-064 |
| VSU runs a document request tracker and a helpdesk | Established | E-004 |

E-020's source was opened again on 16 November 2026 and says what the row says. Check: 1,248 ÷ 2,604 = 47.9%.

## The picture

No words. Layers 1 to 3 are the kit's hills, ground, and places, with the kit's own people on the grounds. Layer 4:

- **Both states:** the question, a dark bubble above a dormitory.
- **Today:** three dotted rings spreading from the question; two people ringed in blue, phones lit; a gold dashed ring with a question mark on three buildings.
- **With CAMPUS:** three green routes to three people standing on gold; a dotted green leg from one of them, past a small clock, to one office ringed in gold; a dotted blue line from that office to a tile holding a pinned slip, one of VSU's own systems.

## Animation beats

Today, on entering: the question (0.4 s), the rings one by one (1.3 s, 1.75 s, 2.2 s), the question marks (2.65 s). With CAMPUS, on switching: the routes at once, the three people at 0.5 s, the leg to the office at 0.9 s, the hand-off at 1.3 s. Nothing loops but the routes' moving dashes.

**Less motion:** the finished picture of each state, at once.

## Findings slot

"Tries it took" by year; which kinds of office ("Which office"); where students asked first; P-09's interview incidents, split by first in the family at VSU.

## Kit pieces

Reused: `world`, `hills`, `isoPerson`, `icon`, `.wake`, `.flow`. New in the kit, shared from here on: `backdrop`, `arcTo`, `dots`, `askMark`, `chatPanel`, `chatLine` (lifted out of `threeJobs`), and `clock`. No new CSS.

## Questions for Leo

1. Chapter 2.2's sentence "Most social platforms broadcast…" has no tag. The card `broadcast` shows it as [Proposed]. If it should carry another tag, the chapter is the place to say so.
2. The related-work cards in the first extraction (the Citizen's Charter, EVSU's portal, 311 apps) are not drawn. They fit `vsu-has` better; say if one belongs here.
