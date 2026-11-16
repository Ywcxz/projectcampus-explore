# Every batch starts over (`batch`)

*Directed and drawn, 16 November 2026, in the lean form (`three-jobs.md`). The pitch plan's N6, "Memory". Step 4 of the offices path (Ch 2.4; D-175). Chapters 2, 2.2, 8.*

One idea: today each batch's chat starts empty; with the network one confirmed answer would stay at a place, and conversation would fade.

## Place and access

- **Place:** the campus from above, the kit's own, a little faded. The shelf stands over one kind of place; no organizations place is drawn (README, question 1, still open).
- **Parent:** `three-jobs`, from "Kept for the next batch" (`memory`), which now opens this scene instead of the card `kept`. See Questions.
- **Opens, drawn:** six cards (see Objects). Four are cards the site already had.
- **Opens, waiting:** `a-place` already has its parent, `elsewhere`; the card `steward` stands in for it.

## Problem

| P- | Shown as | How we'd find out |
| --- | --- | --- |
| P-10 | Three chats, a year apart, the same question sunk in each | Survey: "Finding an old answer", "Asking first"; interviews |
| P-08 | A figure in a graduation cap walking off, a folder fading | Interviews (D-123); Facebook study H3 |

Both are [Unresolved] and worded as questions (D-175). P-08 has no survey question, so it can't clear the survey's bar as Chapter 8 reads (README, "What the master doc needs", 2).

## Today / with CAMPUS

- **Today** [Unresolved]: one group chat a batch, each with the same question at the bottom; an officer leaves and the records go too.
- **With CAMPUS** [Proposed]: one chat is left, its messages fading; one answer stays, dated, on a lit shelf at a place; a later student with the same question finds it before she posts; a card carries it into the chat; the place's key hangs on the shelf, for the next officers.

## Objects

| Object | State | Label | Opens |
| --- | --- | --- | --- |
| `chats` | Today | The same question, each batch? | card `buried` |
| `leaving` | Today | Do records leave with officers? | card `handover-lost` (new) |
| `shelf` | With CAMPUS | One answer stays, dated | card `kept` |
| `later` | With CAMPUS | A later student finds it | card `shown-first` (new) |
| `card-out` | With CAMPUS | A card back into the chat | card `share-cards` |
| `key` | With CAMPUS | The place is handed on | card `steward` |

## Words

The words are in `data/scenes.json`, which is their one copy: the scene `batch`, its second state, and the cards `handover-lost` and `shown-first`. The second summary is the plan's N6 line, put in "would".

| Claim | Tag | Source |
| --- | --- | --- |
| The two problems above, each as a question with how it will be found out | Unresolved | P-08, P-10 |
| Organizations lose their records when officers graduate, by the author's observation | Unresolved | Ch 2 |
| The network keeps knowledge and lets conversation fade | Established | D-070 |
| Existing answers are shown before a new question posts | Established | D-071 |
| Stack Overflow links accidental duplicates to the original | Established | E-039 |
| Answers travel into chats as cards, shared by hand, with source and date | Established | D-074, D-182 |
| Stewards look after a place for a term, then hand it on | Established | D-144 |

E-027's count of organizations is left out: it was not opened again for this sheet, and the site shows only numbers re-checked when the script is written.

## The picture

No words. Layers 1 to 3 are the kit's. Layer 4:

- **Today:** three chat panels in a row along the top, the oldest palest, a calendar between each, a faded question at the bottom of every one; lower right, a large figure in a graduation cap, a dotted line running off the edge, and a folder in dashed outline.
- **With CAMPUS:** the newest chat alone, its lines fading; a lit shelf over one place with one answer carrying its label, source, and date; a key at the shelf's end; below, a student with a small question, tied to the shelf by a gold dotted line; a dotted green arc from the shelf to the chat, where the same answer sits as a card.

## Animation beats

Today, on entering: the chats in turn, oldest first (1.3 s, 1.75 s, 2.2 s), then the officer (2.65 s). With CAMPUS, on switching: the shelf at once, the later student at 0.5 s, the card into the chat at 0.9 s, the key at 1.3 s. Nothing loops.

**Less motion:** the finished picture of each state, at once.

## Findings slot

The survey's share for "Finding an old answer", by year; interview incidents of asking again and of lost records; the Facebook study's H3 share of community groups that replace an earlier group.

## Kit pieces

Reused: `backdrop`, `chatPanel`, `chatLine`, `askMark`, `copy`, `badge`, `icon`, `personAt`, `isoPerson`, `.wake`. New, inside `batch()`: the cap and the folder. No new CSS.

## Questions for Leo

1. **Its parent.** README's question 1 (an organizations place, or the dormitories) is yours and still open, so this scene hangs from `three-jobs` for now, where "memory" is one of the three jobs. Moving it is one line in `data/scenes.json` once the place is settled.
2. The senior who stops answering is not drawn; the card `chose-topic` carries the helper's weekly limit. Say if it should be.
