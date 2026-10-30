# The script

The script is the interactive site written before it is drawn: the scenes, how each one opens and connects, its words, and its animation (D-170, D-175). It is built from the master doc, [projectcampus-docs](https://github.com/Ywcxz/projectcampus-docs), which wins wherever the two differ (D-082). The site's words in `data/scenes.json` are built from the script, and a drawing in `js/art.js` follows its scene's sheet.

A claim enters the script only once the master doc has it. If writing a scene refines an idea, the change goes into the master doc first, as a [Proposed] row or a chapter edit by pull request, and the sheet then cites it.

**Status:** step 1, extraction, 30 October 2026. Every scene is drawn out of the master doc into one sheet. The sheets are raw: their words are drafts, and their beats are rough. Step 2 directs one scene in full as the model; step 3 scripts the rest and runs campus-review on the whole script; step 4 draws.

## The scene sheet

Each file is one scene, named by its scene ID in `data/scenes.json`.

- **Place and access:** where the scene sits on the map, its parent, what opens it, and what it opens.
- **Problem:** its P- hypotheses from Chapter 8, shown as questions with how we'd find out until each clears the D-038 bars (D-151).
- **Today / with CAMPUS:** the same picture in two states, switched in place (D-172). Today carries the problem's tag; with CAMPUS is [Proposed].
- **Related work:** Chapter 10 systems as cards, each saying how CAMPUS differs and the VSU need behind the difference.
- **Objects:** what each opens, a scene or a card, and any callback to another scene.
- **Words:** a title, a summary of 40 words or fewer, narration of 40 words or fewer (D-146, D-155), and claims with their tags and sources.
- **Animation beats:** in order.
- **Findings slot:** what field research fills in later.
- **Kit pieces:** reused from `js/art.js`, and new.
- **Questions:** anything the sheet can't settle, for Leo.

Sources are written as `scenes.json` writes them: a register ID such as (D-070) or (E-025), or a chapter such as (Ch 3.2). A claim keeps the tag the master doc gives it, and is no stronger than its source.

## Every scene

Built means drawn and in `scenes.json`; extracted means a sheet only.

| Scene | File | Place | Problems | Chapters | Status |
| --- | --- | --- | --- | --- | --- |
| Main Campus | `campus.md` | The start | — | 1, 2, 3 | Built |
| Inside an academic building | `building.md` | Academic building | — | 2, 2.2 | Built |
| A computer lab | `lab.md` | Academic building | — | 3 | Built |
| The network, on a computer | `screen.md` | Academic building | — | 3.2 | Built |
| Between classes | `outside.md` | The walk | — | 2 | Built |
| The same network, on a phone | `phone.md` | The walk | — | 3.2, 2 | Built |
| One feed for everything | `elsewhere.md` | Off the map | P-03, P-06 | 3, 3.2, 8.1 | Built |
| Stewards, not owners | `a-place.md` | Off the map | — | 3.2 | Built |
| A morning at VSU | `morning.md` | Dormitories | P-06, P-11, P-20 | 3, 3.2, 2.1 | Extracted |
| What students told us | `told-us.md` | Edge | All 23, as a board | 8, 3.1 | Extracted |
| Every batch starts over | `batch.md` | Organizations (see questions) | P-08, P-10 | 3, 3.2, 8.1 | Extracted |
| Who do I ask? | `who-to-ask.md` | Services offices | P-01, P-02, P-07, P-09 | 3, 3.1, 3.2, 4 | Extracted |
| Where concerns go | `concerns.md` | Services offices | P-23 | 3.2, 3.1, 8 | Extracted |
| Talking across roles | `across-roles.md` | Faculty offices | P-04, P-05 | 3, 3.1, 3.2 | Extracted |
| A lecture hall at class time | `hall.md` | Academic building | P-15, P-16, P-18, P-19 | 2, 2.2, 8 | Extracted |
| What VSU already has | `vsu-has.md` | Edge | — | 3.3, 7, 10 | Extracted |
| Three jobs, kept by memory | `three-jobs.md` | The campus, above it | — | 3, 3.2 | Extracted |
| How it would be governed | `governed.md` | Edge | P-12 | 3, 3.2, 9 | Extracted |
| Typhoon day | `typhoon.md` | Edge, over the whole campus | P-16, P-17, P-20 | 2, 2.1 | Extracted |
| The test | `test.md` | Edge | — | 3, 3.4, 11 | Extracted |
| How we'd know we're wrong | `wrong.md` | Edge | — | 8, 11, 3 | Extracted |
| The ask | `the-ask.md` | Edge | — | 3.4, 12 | Extracted |
| Who is behind it | `behind.md` | Edge | — | 0, 3.4, 12 | Extracted |
| Places and the office guide | `twin.md` | Edge | P-13 | 4, 10 | Extracted |
| Marketplace, a later module | `marketplace.md` | Edge: later | P-21 | 3.5 | Extracted |
| Housing, a later module | `housing.md` | Edge: later | P-22 | 3.6 | Extracted |
| Hop-It, a later module | `hop-it.md` | Edge: later | P-14 | 3.7 | Extracted |

Every P- row in Chapter 8 has a scene: P-01, P-02, P-07, and P-09 at the services offices; P-03 and P-06 in the feed; P-04 and P-05 at the faculty offices; P-06, P-11, and P-20 at the dormitories at dawn; P-08 and P-10 with the organizations; P-12 in governance; P-13 in the twin; P-14, P-21, and P-22 in the later modules; P-15, P-16, P-18, and P-19 in the lecture hall; P-16, P-17, and P-20 on typhoon day; P-23 at the services offices.

## The tree

```text
Main Campus (campus)
├── Dormitories ──────────── A morning at VSU (morning)
│                              └── the storm outside ─► Typhoon day (typhoon)
├── Academic building ────── Inside an academic building (building)
│                              ├── A computer lab (lab) ── The network, on a computer (screen)
│                              └── A lecture hall at class time (hall)
├── A student between classes ─ Between classes (outside) ── The same network, on a phone (phone)
├── Services offices ─────── Who do I ask? (who-to-ask)
│                              └── Where concerns go (concerns)
├── Faculty offices ──────── Talking across roles (across-roles)
├── The unopened building ── Every batch starts over (batch), if it becomes organizations
├── A question finds its answer ─ Three jobs, kept by memory (three-jobs)
│
├── One feed for everything (elsewhere), today and with CAMPUS
│     └── Stewards, not owners (a-place)
│
└── The edge: What students told us (told-us), What VSU already has (vsu-has),
    How it would be governed (governed), The test (test), How we'd know
    we're wrong (wrong), The ask (the-ask), Who is behind it (behind),
    Places and the office guide (twin), and the later modules
    (marketplace, housing, hop-it)
```

How a visitor reaches an edge scene with no navigation bar is open (questions, below).

## The offices path

Chapter 3.4's sequence, which the site's paths follow (D-175). The path starts at Main Campus, the home.

| Step | Chapter 3.4 | Scene |
| --- | --- | --- |
| — | The home | `campus` |
| 1 | A morning at VSU | `morning` |
| 2 | What students told us | `told-us` |
| 3 | Where VSU's conversation lives | `elsewhere`, both states |
| 4 | Every batch starts over | `batch`, both states |
| 5 | Where concerns go | `concerns`, both states |
| 6 | What VSU already has | `vsu-has` |
| 7 | The network in three jobs, kept by memory | `three-jobs` |
| 8 | How it would be governed | `governed`, then `a-place` |
| 9 | The test | `test` |
| 10 | The ask | `the-ask` |
| 11 | Who is behind it | `behind` |

The other paths named in D-152 (VSU ICT, faculty and staff, students after the survey, and free reading) are not drafted yet. A first thought, for Leo: VSU ICT might run `campus`, `building`, `hall`, `typhoon`, `vsu-has`, `governed`, `behind`; faculty and staff `campus`, `across-roles`, `who-to-ask`, `batch`, `governed`, `test`.

## Questions for Leo

1. **No organizations place.** The campus draws dormitories, services offices, faculty offices, the academic building, and one building nothing opens yet. "Every batch starts over" needs a place. Should the unopened building become organizations (D-153 names organizations among the kinds of place), or should the scene sit at the dormitories, where batch group chats live?
2. **Two scenes at the services offices.** `who-to-ask` and `concerns` both sit there. The sheets make `who-to-ask` the services offices scene and `concerns` its child. The alternative is a services offices scene with both as children, which adds a level.
3. **Edge scenes with no bar.** D-174 makes the scenes the navigation, entered by clicking their places. Edge scenes have no place. The sheets propose objects on Main Campus for each: a board by the main walk (`told-us`), the sky (`typhoon`), the gate (`the-ask`, `behind`), and so on. Or the start could carry an edge ring of small signs.
4. **"Who do I ask?" on the path.** It is not one of Chapter 3.4's eleven steps. The sheets reach it from step 2's board and from step 7. Should it be on the offices path?
5. **"How we'd know we're wrong"** sits beside "The test". Keep both, or fold the bars into `told-us` and the stop conditions into `test`?

## What the master doc needs

Found while extracting. None is fixed here; each needs a chapter edit or a row in projectcampus-docs first.

1. **A source mismatch for P-23.** Chapter 3.2's "Concerns" section opens "The owner's reading of student interviews is that concerns do get raised and acknowledged…" Chapter 8 says P-23 comes from the owner's reading of two vox pops (E-055, E-056), and that no interviews have been gathered. Chapter 3.2 should say vox pops; if it was written from something else, the source should be named. A C- row if it is an error.
2. **Problems with no survey item can't clear the bars.** Chapter 8 shows a problem as Established only if it clears both the survey's bar and the interviews' (D-038, D-132). P-08, P-09, P-12, and P-20 rest on the interviews alone, P-16 and P-17 on VSU ICT's figures, and P-13 waits for the map's rework. As written, those scenes stay questions after field research. A Q- row could ask how such a problem is judged.
3. **The spatial interface.** The site's own campus is a way of browsing by place, which D-093 keeps as research only for the network. The handoff's open item stands: revise D-093, or say on `twin` that browsing the site by place is not the network's interface.
4. **The script-first rule** has no row yet (handoff, still open).

## Smaller notes

- The campus-review skill already names `Ywcxz/projectcampus-docs`, so that open item in the 30 October handoff looks done.
- In `scenes.json`, the services offices object has the ID `orgs`. Rename it when `who-to-ask` is drawn, so the ID says what it is.
- This repository's README still lists the I and S keys and a navigation bar, which D-174 dropped.
