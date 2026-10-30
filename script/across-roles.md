# Talking across roles (`across-roles`)

*Extracted. The third of the network's three jobs, reached from `three-jobs`. Chapters 3, 3.1, 3.2, 10.*

## Place and access

- **Place:** the faculty offices: a corridor of doors, a faculty member at a desk.
- **Parent:** `campus`, from the faculty offices (object `offices`, now the card `to-come`).
- **Opens:** a closed door (card: what students have outside a course); with CAMPUS, a consultation request (card: consultations), the GIS question (card: who knows about this?), the staff-only chat (card on Output Messenger).

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-04 | There is no easy place for students, faculty, and staff to interact across roles | A question | Survey: "What made it hard" (no reply or a late one; not knowing how to contact them; not finding them in their office; reaching them only through someone else), "Reaching a teacher or staff", "Who should be there"; faculty and staff interviews |
| P-05 | It is hard to find the person, group, place, or opportunity behind a need | A question | Survey: "Heard too late", "Advice from seniors" (no, I couldn't find one) |

## Today / with CAMPUS

- **Today** [Unresolved]: outside a course, a student who wants to reach a faculty member she doesn't have, an adviser, or an office may have nothing but visits, email, the helpdesk, and Facebook (Ch 3). Staff have a chat of their own, listed for employees only [Established] (Ch 3; Ch 10).
- **With CAMPUS** [Proposed]: a second-year student with a thesis idea that needs GIS asks in the GIS interest place; it reaches four members who chose GIS, two seniors and two faculty, each told why (Ch 3.2, scene 4). For a faculty member in another department, she sends a consultation request, answered within consultation hours; nothing arrives at midnight (Ch 3.2, scene 7).

## Related work

| Card | How CAMPUS differs | VSU need | Source |
| --- | --- | --- | --- |
| Output Messenger, VSU's staff chat | Students' campus life is the focus, not staff | VSU has a staff chat and nothing equivalent for students | Ch 3; Ch 10 |
| VSU's graduate faculty pages | Faculty who choose to could bring their topics into routing, with no separate expertise directory | Students who want to learn GIS still have to know where to look | E-040; Ch 3.2 |
| Viva Engage at the University of Manchester | A university's enterprise social tool can leave students out | Talking across roles includes students | Ch 10 |
| VSUEE's course messages | The network covers everything outside courses | Reaching faculty one doesn't have | Ch 3.3; D-064 |

## Objects

| Object | Opens | Callback |
| --- | --- | --- |
| A closed door | card: outside a course | — |
| The staff's chat on a monitor | card: Output Messenger | `vsu-has` |
| With CAMPUS: a consultation request | card: consultations | — |
| With CAMPUS: the GIS question | card: routed to people who chose the topic | `elsewhere` (its GIS post) |

## Words

- **Title:** Talking across roles.
- **Summary, today, draft:** "A student wants advice from a faculty member she doesn't have. Outside a course, she has visits, email, the helpdesk, and Facebook. Is that hard at VSU? Not yet known: the survey will ask." (34 words)
- **Summary, with CAMPUS, draft:** "On the network, her question about GIS would reach two seniors and two faculty who chose the topic. A consultation request would be answered within office hours, never at midnight." (30 words)
- **Narration:** to write.

| State | Claim | Tag | Source |
| --- | --- | --- | --- |
| Today | Is there no easy place for students, faculty, and staff to interact across roles? Not yet known. | Unresolved | P-04 |
| Today | VSU staff have an office chat, Output Messenger, listed for employees only. | Established | Ch 3; Ch 10 |
| Today | VSU lists its graduate faculty by department, with each one's specialization and research interest. | Established | E-040 |
| With CAMPUS | Routing uses only the topics members declare and the places they join, never inferred profiles. | Established | D-071 |
| With CAMPUS | A student writing to a faculty member outside their classes sends a consultation request; no one is expected to answer outside working hours. | Proposed | Ch 3.2 |
| With CAMPUS | Faculty receive questions only in the topics they opened and within their consultation norms. | Proposed | Ch 3.2 |

## Animation beats

1. A corridor; the student walks past doors, one open, one closed, one with no one in.
2. Through a window, staff chatting on a monitor; the student outside it.
3. With CAMPUS: her question rises from her phone and splits to four figures, each with a small "why" spark.
4. A faculty member offers a time; a clock shows office hours.

## Findings slot

The survey's share for "What made it hard", by year; why students needed to reach staff; who students think should be on the network. Faculty and staff interviews, if run (Ch 3).

## Kit pieces

Reuse: `isoChar`, `standPerson`, `sitChar`, the route. New: a corridor with doors.

## Questions

- Faculty workload is the first thing the Vice President for Academic Affairs will ask about (Ch 3.4). Does this scene need a card on consultation norms and caps (Ch 3.2, fair load)?
