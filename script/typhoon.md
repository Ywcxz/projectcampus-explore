# Typhoon day (`typhoon`)

*Extracted. The intranet's own scene (scenes brief, 29 October). Chapters 2, 2.1.*

## Place and access

- **Place:** the whole campus, in a storm, at the edge of the map.
- **Parent:** `campus`, from the sky (proposed); also from the window in `morning`, and from the fiber behind the switch in `building`.
- **Opens:** three storms (a card per storm: Haiyan, Odette, Agaton); the rings (card `rings`); a phone with saved notices (card `device`); with CAMPUS, a shelter building (a card on emergency mode); a charging point (a card).

This also answers the handoff's open item: the rings card and the typhoon scene get entry points.

## Problem

| P- | Hypothesis (Ch 8) | Shown as | How we'd find out |
| --- | --- | --- | --- |
| P-17 | Campus services stop or slow when the internet link fails | A question | VSU ICT's figures (Ch 8) |
| P-20 | In emergencies, people on campus lack official information, contact, and a way to tell fact from rumor | A question | Interviews alone, including students who lived through Agaton on campus (Ch 2.1; Q-31) |
| P-16 | Campus-made information travels through outside platforms and the internet link even between people on campus | A question | VSU ICT's figures |

None has a survey problem question (README, what the master doc needs, 2).

## Today / with CAMPUS

- **Today** [Established, for the three storms]: Haiyan destroyed VSU's internet leased line and about 90% of its fiber backbone in 2013 (E-009); five days after Odette in December 2021, power and internet were only partly restored (E-042); during Agaton in April 2022, students were trapped on campus and floodwater entered dormitories and academic buildings (E-015).
- **With CAMPUS** [Proposed]: the outer ring goes dark and the inner rings stay lit. Emergency mode: power first, a network open to everyone sheltering, services that live on campus and on phones, charging, and a way out (Ch 2.1; D-060).

**What cuts the other way:** after Odette, VSU restored partial power and internet within five days and opened free Wi-Fi and charging, with no campus-first system in place (E-042); VSU is already extending solar backup across its network (E-043). The case is to plan and power in advance what VSU's staff already do under pressure, not that VSU is unprepared (Ch 8). Say this on the scene.

## Related work

| Card | How CAMPUS differs | VSU need | Source |
| --- | --- | --- | --- |
| Japan's 00000JAPAN | An open network at shelters, switched on by VSU's Crisis Management Committee | Evacuees sheltering in academic buildings, as in Agaton | Ch 2.1; E-015 |
| National alerts from carriers | Campus-specific instructions | Where to go on campus, who is safe | Ch 2.1 |
| WAIS | A copy on campus keeps advisories flowing if the outside link fails, if WAIS is hosted off campus, which is not known | Advisories during an outage | Ch 2.1; E-026 |

## Objects

| Object | Opens | Callback |
| --- | --- | --- |
| Three storm clouds | a card per storm | — |
| The rings on the ground | card `rings` | `hall` |
| A phone with saved notices | card `device` | `phone` |
| With CAMPUS: a shelter building | card: emergency mode | — |
| A charging point | card: charging | — |

## Words

- **Title:** Typhoon day.
- **Summary, today, draft:** "Three times in thirteen years, weather has cut VSU's links: Haiyan in 2013, Odette in 2021, Agaton in 2022. What did people on campus lack in those days? Not yet known: interviews will ask." (34 words)
- **Summary, with CAMPUS, draft:** "In the campus-first design, the outer ring could go dark while the campus stays lit: advisories, where to go, who is safe, and official posts kept apart from rumor, on backup power." (32 words)
- **Narration:** to write.

| State | Claim | Tag | Source |
| --- | --- | --- | --- |
| Today | Haiyan destroyed VSU's internet leased line and about 90% of its fiber backbone in 2013; a new backbone was finished in 2017. | Established | E-009 |
| Today | Five days after Odette, power and internet at the Main Campus were only partly restored. | Established | E-042 |
| Today | During Agaton, students were trapped on campus, and floodwater entered dormitories and academic buildings. | Established | E-015 |
| Today | VSU's solar backup powers the data center and the administration building and can keep internet services running up to four hours. | Established | E-043 |
| With CAMPUS | The campus ring is designed to keep working as a local system in emergencies, as long as backup power keeps it running. | Established | D-060 |
| With CAMPUS | Each ring keeps working when every ring outside it fails. | Proposed | Ch 2 |
| With CAMPUS | Emergency mode would be the Crisis Management Committee's tool, switched on and off by it. | Proposed | Ch 2.1 |
| With CAMPUS | Nothing in emergency mode locates people from network data. | Established | D-089 |

Check: "three times in thirteen years" is Chapter 2.1's own phrase, 2013 to 2026. Keep it only if the scene is dated.

## Animation beats

1. The campus under dark cloud; rain sweeps across.
2. The internet ring at the edge flickers and goes dark (Haiyan).
3. Lights go out building by building; a few stay lit on backup power (Odette).
4. People walk into an academic building with bags (Agaton). Hold.
5. With CAMPUS: the campus ring glows inside the dark outer ring; phones in the shelter light with an advisory labeled official; a charging point lights.

## Findings slot

Interview incidents from students who were on campus in a storm (Q-31); the Crisis Management Committee's account, if VSU allows; which buildings serve as shelters, and which have backup power (Q-30).

## Kit pieces

Reuse: `world(false)`, `ring`, `bldg`, `isoChar`, `journey`, `accessPoint`. New: storm clouds and rain, a lights-out state per building.

## Questions

- The scene names no building: E-042 names two, and D-153 keeps scenes at kinds of place.
