# One feed for everything (`elsewhere`)

*Built, with two states (D-172). Step 3 of the offices path: "Where VSU's conversation lives" (Ch 3.4). Chapters 3, 3.2, 8.1. A step 2 candidate for the model scene.*

## Place and access

- **Place:** off the map: a group's feed, as a composite (D-148).
- **Parent:** `campus`. What opens it from the campus is not drawn: the live `campus` has no object for it, so a visitor reaches it only by path or address. Step 2 should give it one, such as a student's phone on a bench.
- **Opens:** in today's state, what a study will count (card `feed-study`); with CAMPUS, an office's notice (card `labels`), the scholarships place (card `scholarships`), and an organization's place (`a-place`).

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-03 | Students take institutional questions to unofficial Facebook groups, where peers answer and a wrong answer carries no consequence | A question | Survey: "Was it right?" (some were wrong; I couldn't tell), "A new office", "Asking first"; Facebook study H2; interviews |
| P-06 | Official notices and rumor look alike where campus conversation happens | A question | Survey: "Official or not" (not at first, so I checked; I couldn't tell), "Checking a post"; Facebook study H1 |

Chapter 3.4 makes this step "the Facebook study's counts by kind of channel, with no community group named" (D-044). Before the study, the card says what it will count.

## Today / with CAMPUS

- **Today** [Unresolved]: one feed holds a scholarship deadline, a lost ID, a dorm without water, and a question about GIS, with nothing to say which office a post concerns or whether it is still true. A composite (D-148).
- **With CAMPUS** [Proposed]: each post moves to a place that exists because what it is about exists at VSU (D-144), on the drawn campus.

## Related work

Cards to add in step 3, from Chapter 3's table:

| Card | How CAMPUS differs | VSU need | Source |
| --- | --- | --- | --- |
| Facebook groups and pages | Bounded to VSU and governed with it, with no ads or engagement feed | A VSU group VSU could neither verify nor govern, in 2025 | Ch 3; E-023 |
| Facebook Campus, closed 2022 | Offices take part, and VSU and its students govern it | Verification alone did not bring students; at VSU the incumbent is stronger | E-006; E-035; Ch 3 |
| A Philippine college's official Facebook groups, 2026 | The pilot compares the network with such a group, with the same office commitment | Whether verified membership, kept answers, and dated notices matter enough | Ch 3 (VMC, 2026); D-067 |

## Objects

As built (see Place and access). Callbacks: the office's notice → `morning`; the organization's place → `batch`; the dorm without water → `concerns`; the GIS question → `across-roles`.

## Words

- **Today title:** One feed for everything. **Summary, live:** "A scholarship deadline, a lost ID, a dorm without water, a question about GIS: all in one feed. The feed doesn't know which office a post concerns, who it's for, or whether it's still true." (35 words)
- **With CAMPUS title:** A place for every post. **Summary, live:** "On the network, each post would have a place, because what it's about exists at VSU: scholarships, a building, an organization, a dormitory. A place would outlive every student who joins it." (32 words)
- **Narration:** to write.

| State | Claim | Tag | Source |
| --- | --- | --- | --- |
| Today | Do students take institutional questions to unofficial groups, where peers answer and a wrong answer has no owner? Not yet known: the survey, the interviews, and the Facebook study will ask. | Unresolved | P-03 |
| Today | Do official notices and rumor look alike where campus talk happens? Not yet known: the survey and the Facebook study will ask. | Unresolved | P-06 |
| Today | A general platform knows nothing of VSU's roles, offices, or rules. | Proposed | Ch 3 |
| With CAMPUS | Every place is tied to something real at VSU, or an interest its members start. | Established | D-144 |
| With CAMPUS | Places sit side by side, never inside one another, and a place may say where it is. | Established | D-144 |
| With CAMPUS | Course sections are not places: their materials and grades stay in VSUEE. | Established | Ch 3.2 (D-064) |
| With CAMPUS | Nothing about the network has been approved, built, or tested. | Established | Ch 3 |

Check in step 3: Chapter 3 tags "It knows nothing of VSU's roles, offices, or rules" with no tag of its own; it sits after an [Established] sentence. Proposed is the safe reading.

## Animation beats

As built: the feed scrolls, then, with CAMPUS, its posts lift and fly to their places on the campus.

## Findings slot

The Facebook study's counts by kind of channel: H1's share of reappearing announcements altered or contradicted, and H2's share of questions with no answer by tally time, with their cut-offs (Ch 8.1). No group named. The survey's shares for "Was it right?" and "Official or not", by year.

## Kit pieces

`tile`, `post`, `icon`, `chip`, `world(false)` for the with-CAMPUS campus.
