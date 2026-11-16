# 4:30 a.m. (`morning`)

*Directed and drawn, 16 November 2026: the model scene (script step 2), awaiting the owner's yes on the style. campus-review was run on this sheet and its words on 16 November; the whole script's review is step 3. The pitch plan's N1, and its S6 in the second state. Step 1 of the offices path (Ch 2.4). Chapters 2, 2.2, 8, 8.1.*

One idea: one announcement goes out, and every share after that is a copy. Which copy is still true by noon?

## Place and access

- **Place:** the dormitories, before dawn, from a first-year student's room: her window, her phone, and the dormitory across the yard. Kinds of place only (D-153).
- **Parent:** `campus`, from the dormitories.
- **Told from the student's side** (Ch 2.4, step 1): she is drawn from behind, so the visitor stands where she stands.
- **Opens, drawn:** seven cards (see Objects).
- **Opens, waiting:** the storm outside → `typhoon`; her question → `who-to-ask`. The engine opens only a child scene, and neither is drawn, so neither has an object yet.

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-06 | Official notices and rumor look alike where campus conversation happens | A question | Survey: "Official or not", "Checking a post", "Heard first" for suspensions; Facebook study H1 |
| P-11 | Outdated information keeps circulating after rules or structures change, with nothing to mark it as out of date | A question | Survey: "How-to guides"; interviews |
| P-20 | In emergencies, people on campus lack official information, contact, and a way to tell fact from rumor | A question, on a card | Interviews alone (Ch 8) |

All three are [Unresolved]. P-20 has no survey problem question, so it can't clear the survey bar as Chapter 8 now reads (README, what the master doc needs). Its own scene is `typhoon`.

**What the scene must not say:** that notices do change as they travel at VSU. That is H1 of the Facebook study, and nothing is counted yet. The picture shows marks lost when a notice is copied, which Chapter 2 holds as [Proposed]; it shows no copy whose content was changed.

## Today / with CAMPUS

The same picture in two states, switched in place (D-172).

- **Today** [Unresolved], 4:30 a.m.: a typhoon signal is raised overnight. One announcement goes out. It reaches the dormitory window by window, as a share, a screenshot, a screenshot of a screenshot, a retelling. A share keeps its marks; each further copy loses one. Her phone holds three versions.
- **With CAMPUS** [Proposed], noon: the authorized office posts the suspension once, in the university's official place. Every window holds the same notice, with its label, source, and date, each tied back to one page. A card carries it into a group chat. The weather advisory is attached. Her phone shows the one notice, and that it reached her at 4:30.

The second state is noon because the plan's S6 returns here: "still checkable at noon".

## Related work

| Card | How CAMPUS differs | VSU need | Source |
| --- | --- | --- | --- |
| WAIS, VSU's own advisory system (`wais`) | The network would carry WAIS advisories in official places with the source shown, never issue its own | Advisories reaching the places people already open, if VSU's disaster risk management office agrees (Q-40) | E-026; Ch 2.3; D-064 |
| Messenger group chats (`share-cards`) | The network links into chats with share cards rather than replacing them; people share, no bot does | A notice passed on in a chat carries the way to check it | D-074; D-182 |

Moved to `typhoon`: national alerts from mobile carriers (Ch 4.1; Republic Act No. 10639).

## Objects

Each is drawn, has a label of six words or fewer, and opens one card. Label points are in `js/art.js`.

| Object | State | Label | Opens | Callback |
| --- | --- | --- | --- | --- |
| `notice`: the announcement | Today | One announcement, by 4:30 a.m. | card `suspension-rule` | — |
| `copies`: the copies and their paths | Today | Copies, and copies of copies | card `copies` | `elsewhere` |
| `phone-today`: her phone | Today | Which one is official? | card `which-official` | `told-us` |
| `page`: the notice's page | With CAMPUS | The notice's own page | card `labels` (built) | `screen`, `phone` |
| `wais`: the advisory clipped to it | With CAMPUS | The weather advisory, attached | card `wais` | `vsu-has` |
| `share-card`: the group chat | With CAMPUS | A card in the group chat | card `share-cards` | `batch` |
| `phone-network`: her phone | With CAMPUS | It would reach her at 4:30 | card `urgent` | — |

The three cards of today end the problem as D-146 asks: what is known (`suspension-rule`), what is thought (`copies`), and how it will be found out (`which-official`).

## Words

### Today

- **Title:** 4:30 a.m.
- **Summary, live:** "A typhoon signal goes up overnight. Under VSU's guidelines, suspensions are announced by 4:30 a.m. One announcement goes out. Every share after that is a copy. Which copy is still true by noon? We haven't measured it." (37 words)
- **Narration:** "A typhoon signal goes up overnight. Under VSU's guidelines, suspensions are announced by 4:30 a.m. One announcement goes out. Every share after that is a copy. Which copy is still true by noon?" (33 words)
- **Made-up label:** Composite: not a real post.

Two phrases differ from the pitch plan's line, both for the owner's yes:

- **"Under VSU's guidelines"** for "VSU's rule". The register has "VSU's guidelines call for" (E-025), and the source's own title calls them proposed guidelines, under a resolution of the Board of Regents. A claim stays no stronger than its source.
- **"One announcement goes out"** for "The office posts once". The guidelines send the announcement through radio, television, SMS, the website, and other social media (E-025). The source, opened again on 16 November 2026, also says who makes it: the local chief executive or the head of the institution, or their authorized representatives. That last detail is not in E-025's row yet, so the site does not say it (README, what the master doc needs).

| Claim | Tag | Source |
| --- | --- | --- |
| VSU's guidelines call for typhoon suspensions to be announced through radio, television, SMS, the website, and other social media, no later than 4:30 a.m. | Established | E-025 |
| Together, those channels mean a notice may reach many students as a share or a screenshot, with nothing to show whether it is still current. | Proposed | Ch 2 |
| Do official notices and rumor look alike where campus talk happens? Not yet known: the survey and the Facebook study will ask. | Unresolved | P-06 |
| Does outdated information keep circulating, with nothing to mark it as out of date? Not yet known: the survey and the interviews will ask. | Unresolved | P-11 |

### With CAMPUS

- **Title:** Still checkable at noon
- **Summary, live:** "With the network, the authorized office would post the suspension once, labeled official. Shared into a group chat, it would arrive as a card linking back to the one page that shows whether it's still current." (36 words)
- **Narration (the plan's S6):** "Back to that 4:30 notice. One page, one source, still checkable at noon. Would that be worth one office's commitment and one semester to find out?" (26 words)
- **Made-up label:** Illustration: not a real building or room.

| Claim | Tag | Source |
| --- | --- | --- |
| In the network's design, only office accounts in official spaces post as official, and each official notice has a permanent page that shows whether it is current. | Established | D-063 |
| The authorized office would post the suspension once, in the university's official place, as an urgent notification, the only kind that passes through quiet hours. | Proposed | Ch 2.2 |
| In the network's design, every notice can be shared into a chat as a card that links back to its current version. | Established | D-074 |
| A correction would update the same page with its history visible, instead of starting a new post that competes with the old one. | Proposed | Ch 2.2 |
| Office responsiveness comes before software: no network pilot starts without one office's commitment to answer students within an agreed time. | Established | D-068 |

A decision tagged [Established] is a settled decision about the design, not something built; those claims open with "In the network's design".

### Cards

Each card's text is 40 words or fewer. Its claims, with their tags and sources, are in `data/scenes.json`.

| Card | Title | Text | Rests on |
| --- | --- | --- | --- |
| `suspension-rule` | Announced by 4:30 a.m. | "VSU's guidelines call for typhoon suspensions to be announced no later than 4:30 a.m., through radio, television, SMS, the website, and other social media. So one announcement leaves by several channels at once." | E-025 and its source; Ch 2 |
| `copies` | A copy loses its marks | "A share keeps the notice whole. A screenshot can lose who posted it, and a retelling can lose the date too. We think this happens to VSU's notices, and a study will count how often. We haven't measured it." | Ch 2; D-053; D-044 |
| `which-official` | Which one is official? | "Three versions of one notice on one phone. Nothing on them says which is the original, or whether it still holds. Does this happen at VSU, and how often? Not yet known." | P-06; P-11; P-20; D-151 |
| `share-cards` | A card, not a screenshot | "Students would carry the notice into their group chats themselves, as a card that prints its short link. A copy passed around anywhere could still be checked against the notice's page. No bot posts for them." | D-074; Ch 2.2; D-182 |
| `urgent` | The only kind that passes quiet hours | "Quiet hours, overnight by default, would protect rest. A suspension would go out as an urgent notice, the only kind that passes through them. Each office would get a small, published allowance, so urgent keeps its meaning." | Ch 2.2; E-025 |
| `wais` | The weather advisory, attached | "VSU already issues campus weather advisories through its own system, WAIS. The network would carry them in official places with the source shown, and never issue its own. Whether it may is a question for VSU." | E-026; D-064; Q-40 |

The cards show no numbers but the 4:30 of E-025. H1's cut-offs (D-053) stay in the chapter.

## The picture

1600 by 1000, in four paper layers (D-167), front on. No words (D-171): the only characters are the times on her phone, 4:30 and 12:00.

- **Far:** an overcast sky, clouds, hills.
- **Middle:** the yard, a dormitory block across it (three floors, six windows a floor, a door), a second block farther off, a tree bending in the wind.
- **Near:** her room. Curtains at the edges, a sill along the bottom, a first-year student from behind, her phone raised in her right hand.
- **Lights and marks:** what glows before dawn, and what the network adds at noon.

**A notice's marks, without words.** An office in a circle is its source. A calendar is its date. A shield with a tick is its label, and only the network adds it (D-063). A dashed outline is a mark that was lost.

**Four kinds of copy.**

| Copy | Drawn as | Keeps | Loses |
| --- | --- | --- | --- |
| Share | The whole notice, with the sharer's dot | Source, date | — |
| Screenshot | The notice with its header torn off | Date | Source |
| Screenshot of a screenshot | Torn top and bottom, tilted | — | Source, date |
| Retelling | A chat bubble, lines only | — | Source, date |

Of ten windows, three hold shares, two screenshots, two second screenshots, three retellings. Five have lost their date.

**Before dawn** a dark veil covers everything that gives no light. Lit windows, the announcement, the copies, and her phone's screen are drawn over it. **At noon** the veil is gone, and the same people stand at the same windows.

## Animation beats

Today, in seconds from arriving:

1. **0.** Dark. Rain. Her phone shows 4:30. Every window is dark.
2. **0.4.** The announcement appears, upper left, with its source and date.
3. **1.3 to 5.4.** Windows light one by one, 0.45 apart, ten in all. Each lights with the copy that reached it and a dotted path from the copy it was made from. Three hold shares of the announcement itself; the rest hold copies of copies.
4. **1.75, 3.55, 4.0.** Three versions land on her phone as their windows light.
5. **3.55 and 5.35.** Questions rise over two copies and over her phone.
6. **Hold.** Rain, the paths' flow, the questions' bob.

With CAMPUS, on the switch:

7. The veil lifts and the copies fade (about half a second).
8. The announcement gains a green edge and its label: it is now the page.
9. The same notice appears at each window in the order the windows lit, 0.07 apart, each on a green path back to the page.
10. The advisory clips on (0.5), then the group chat's card (0.9).
11. Her phone shows 12:00, the one notice, and a bell marked 4:30.

Switching back to today plays beats 1 to 6 again.

**Less motion:** nothing animates, and the still picture is the finished one: every window lit, every copy in place.

## Findings slot

- The survey's share for "Official or not", by year, and how suspensions reach students first ("Heard first").
- The Facebook study's H1: the share of reappearing announcements that were altered or contradicted, with its cut-offs (D-053).
- An interview incident, paraphrased, if one clears consent.

The picture's mix of copies is made up: seven of ten windows hold a copy that lost a mark, and that is no finding. Once H1 is counted, the mix follows the count, or the `copies` card says the mix is only a drawing.

Findings go on the `copies` and `which-official` cards first. If P-06 clears the D-038 bars, today's tag changes with the master doc's.

## Kit pieces

- **Reused:** `backPerson`, `frontTree`, `icon` ("storm", "ask"), `piece`, `grp`, `objX`, the `CAST`, the `.ask`, `.flow`, `.cloud`, and `.glow-phone` motions.
- **New, for other scenes to reuse:** `mark` (source, date, label; kept or lost), `notice` (a notice with its marks), `copy` (share, screenshot, second screenshot, retelling, and the network's own), `bust` (someone at a window with a phone).
- **New, this scene's own:** the dormitory front, the veil, rain as a pattern kept off the room by a mask, `.wake` (lighting in turn), `.rain`, `.sway`.

`mark`, `notice`, and `copy` are the vocabulary for the plan's N5 (trust), N6 (memory), and C2.

## Questions for Leo

1. **The style.** This is the model. Yes, or what to change, before the other sheets follow it.
2. **Two phrases of the line:** "Under VSU's guidelines" for "VSU's rule", and "One announcement goes out" for "The office posts once" (see Words).
3. **S6 on the pitch path.** A path names each scene once, and a presenter's next steps through a scene's states before leaving it. As built, next on N1 would show noon before N2. Two ways out, for when the `pitch` path is written: let a path step name a state, so `morning` appears twice; or make S6 a scene of its own on the same drawing.
4. **The switch's labels.** Kept as built, "Today" and "With CAMPUS". The plan's C2 labels are longer than the test's three words; the second sample settles them for every scene.
5. **The second state's label.** "Illustration", since its picture has no words. A state can't carry mock-up text unless the scene's first state is a mock-up: the test reads the first state's label.
6. **Rain on a phone.** The rain is one animated pattern under a mask. It should be checked on a mid-range phone before the other storm scenes reuse it.

Answered here: the first-year's question is the hand-off to `who-to-ask`, not part of this scene (the plan's N1 has none).
