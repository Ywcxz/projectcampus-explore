# Places and the office guide (`twin`)

*Extracted. The digital twin's first step. Chapters 4, 10, 3.1.*

## Place and access

- **Place:** the edge of the map: the campus seen as a map of places.
- **Parent:** `campus`; also from the place guide in `who-to-ask`.
- **Opens:** a place (a card on step 1); a question that ends at an office (a card on step 2); the full twin (a card, research only); the spatial interface (a card, research only, D-093).

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-13 | Places and their services aren't connected to information about them | A question | Waits for the campus map's rework (D-123); "Which office" bears on where a guide would help most |

## Today / with CAMPUS

- **Today** [Unresolved]: new students, parents, and visitors can't easily find buildings and offices, or know which office handles a request (Ch 4).
- **With CAMPUS** [Proposed]: a person starts from a question, such as replacing a lost ID, and gets the office, its room and the way there, its hours, what to bring, and the official system to use, each citing the Citizen's Charter or the office, dated (Ch 4).

## Related work

| Card | How CAMPUS differs | VSU need | Source |
| --- | --- | --- | --- |
| A student-led campus map for VSU | Proposed only once systems discovery shows it would not duplicate one; its makers could be collaborators | Not yet known: whether the map works was not checked | E-052; Ch 10; Q-54 |
| Campus twins at Glasgow and Manchester | Estates and energy first elsewhere; for students, a guide to places | Finding places and offices | Ch 10 |
| VSU's GIS and utility inventory | The twin would start from VSU's own data, if VSU shares it | — | Ch 10; Q-49 |

## Objects

| Object | Opens | Callback |
| --- | --- | --- |
| A pin on a building | card: places and the way there | `campus` |
| A question with a path to a door | card: where to go for what | `who-to-ask` |
| A faint 3D model | card: the full twin, research only | — |
| The map with posts on it | card: the spatial interface, research only | — |

## Words

- **Title:** Places and the office guide.
- **Summary, draft:** "The digital twin's first step would be small: find a place, and from a question, the office that handles it, with its hours and what to bring. Everything bigger stays research." (31 words)
- **Narration:** to write.

| Claim | Tag | Source |
| --- | --- | --- |
| The twin's first step is finding places and knowing which office handles what. | Proposed | Ch 4 (D-079) |
| A full twin is outside any first build. | Established | Ch 4 (v0.1 D-008) |
| The spatial interface stays research only, behind the first step. | Established | D-093 |
| The twin maps places and offices, not people. | Proposed | Ch 4 |
| Whether VSU runs or plans a map or directions service of its own has not been confirmed. | Unresolved | Q-54 |

## Animation beats

1. The campus flattens into a map of places.
2. A question appears; a path draws to one door; the door shows hours and what to bring, as icons.
3. A faint 3D model rises behind and is labeled research only.

## Findings slot

P-13 waits for the map's rework (D-123). "Which office", for where a guide would help most.

## Kit pieces

Reuse: `world(false)`, `icon`. New: a flat map style, a pin.

## Questions

- The site is itself a way to browse by place, which D-093 keeps as research only for the network (README, what the master doc needs, 3).
