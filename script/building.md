# Inside an academic building (`building`)

*Built. Chapters 2, 2.2.*

## Place and access

- **Place:** an academic building, a kind of place (D-153).
- **Parent:** `campus`, from the academic building.
- **Opens:** a computer lab (`lab`), a Wi-Fi access point (card `access-points`), the building's switch (card `closet`).
- **Proposed:** a lecture hall → `hall`. The switch could also open the intranet's rings (card `rings`, now unused), one of the entry points the handoff asks for.

## Problem

None of its own; `hall` carries the intranet's problems.

## Today / with CAMPUS

No states. The access points and switch are drawn as "in the campus-first design", so the scene is already the proposal, labeled `illustration`.

## Related work

None yet. A card on VSU's own physical layer (fiber, Wi-Fi, data center) belongs in `vsu-has` or here: VSU has already built most of it (Ch 2).

## Objects

| Object | Opens | Callback |
| --- | --- | --- |
| A computer lab | `lab` | — |
| A Wi-Fi access point | card `access-points` | `outside`, `lab` |
| The building's switch | card `closet` | `typhoon` (the fiber that broke in 2013) |
| A lecture hall (proposed) | `hall` | — |

## Words

- **Title:** Inside an academic building.
- **Summary, live:** "Rooms and a hall. In the campus-first design, each has Wi-Fi access points on the building's switch, joined by fiber to the campus core." (24 words)

| Claim | Tag | Source |
| --- | --- | --- |
| VSU finished a new fiber backbone in 2017, after Typhoon Haiyan destroyed most of the old one in 2013. | Established | E-009 |
| Access points on each building's switches, joined by fiber to the campus core. | Proposed | Ch 2 |

## Animation beats

As built. Step 3 may add: a pulse along the fiber from the switch toward the campus core, to set up `typhoon`.

## Findings slot

VSU ICT's figures, if shared as totals: clients per access point at peak (Ch 2.2). Nothing else.

## Kit pieces

`Iso`, `box`, `bldg`, `accessPoint`, the rack. New: a hall's doorway for `hall`.
