# projectcampus-explore

Project CAMPUS as scenes you can walk around in: the interactive site at explore.projectcampus.org ([D-154](https://docs.projectcampus.org/decisions.html#d-154)). It is drawn as one campus, with the intranet's rings on the ground and the social/academic network's routes above them, and a visit zooms from the campus into a building, a room, and a screen ([D-170](https://docs.projectcampus.org/decisions.html#d-170)). An independent proposal by one alumnus, not affiliated with Visayas State University.

**Status:** a first slice and the first problem scene. Eight scenes: the campus, an academic building, a computer lab, the network on a monitor, a student outside, the network on a phone, one feed for everything (today) that becomes a place for every post (with CAMPUS), and stewards, not owners. [D-170](https://docs.projectcampus.org/decisions.html#d-170), [D-171](https://docs.projectcampus.org/decisions.html#d-171), and [D-172](https://docs.projectcampus.org/decisions.html#d-172) await the owner's confirmation in the master doc.

## Where it comes from

Everything here is built from the [master doc](https://github.com/Ywcxz/projectcampus-docs), Project CAMPUS's reference layer ([D-082](https://docs.projectcampus.org/decisions.html#d-082)). The master doc wins wherever the two differ, and a claim goes on this site only once it is there.

- **[D-146](https://docs.projectcampus.org/decisions.html#d-146):** the explainer-video techniques, with original art and invented characters.
- **[D-148](https://docs.projectcampus.org/decisions.html#d-148):** the rules every scene follows: tags, sources, made-up labels, no seal, collects nothing.
- **[D-149](https://docs.projectcampus.org/decisions.html#d-149):** this repository and Vercel project, apart from the master doc's.
- **[D-151](https://docs.projectcampus.org/decisions.html#d-151):** the site is the pitch; no slides.
- **[D-152](https://docs.projectcampus.org/decisions.html#d-152)** and **[D-153](https://docs.projectcampus.org/decisions.html#d-153):** scenes, objects that open deeper scenes or cards, a map by kind of place, paths, and addresses.
- **[D-155](https://docs.projectcampus.org/decisions.html#d-155):** narration, English only, off by default (not built yet).
- **[D-170](https://docs.projectcampus.org/decisions.html#d-170):** one drawn world in 2.5D paper layers, and the zoom from campus to screen.
- **[D-171](https://docs.projectcampus.org/decisions.html#d-171):** words as a layer, shown or hidden together.
- **[D-172](https://docs.projectcampus.org/decisions.html#d-172):** a scene's states, today and with CAMPUS, switched in place.

## Layout

```
projectcampus-explore/
├── index.html            the one page: bar, notice, stage, caption, card, footer
├── data/scenes.json      the scenes, their objects, the cards they open, and paths
├── js/art.js             the drawings: one SVG per scene, in paper layers
├── js/main.js            the engine: zooms, cards, words, paths, keys, addresses
├── css/site.css          the landing page's palette, light, phone first
├── img/                  the project's icon
├── tests/                the site test (rules, scene file, drawings, and the page in jsdom)
├── scripts/hooks/        the name guard as a local pre-commit hook
├── .github/workflows/    the site test and the name guard on every pull request
├── CLAUDE.md             working rules for Claude sessions in this repository
└── vercel.json           security policy, no indexing, and cache headers
```

## The scene file

`data/scenes.json` holds the words, so the script changes without touching the drawings or the engine.

- **Scenes** have an `id`, the `art` that draws them, a `parent` (the scene they zoom out to, or `null` for the start), a `title`, a `summary` of 40 words or fewer, `madeUp` (`null`, `layout`, `illustration`, `mockup`, `sample`, `composite`, or `later-module`), their `claims`, the `chapters` they summarize, and their `objects`.
- **Objects** have an `id` matching a `data-object` group in the drawing, a short `label`, and `opens`: a child `scene`, or a `card`.
- **Cards** have a `title`, a short `text`, `claims`, and a `chapter`.
- **Claims** have `text`, a `tag` (Established, Proposed, or Unresolved), and a `source`: a register ID (`{ "ref": "E-009" }`), a master doc chapter (`{ "chapter": "intranet", "label": "Ch 2" }`), or an official page (`{ "href": "https://…", "label": "…" }`).
- **States**, on a scene that has them, show the same picture as it is today and as it would be with CAMPUS ([D-172](https://docs.projectcampus.org/decisions.html#d-172)). The first state uses the scene's own words; a later one has its own `title`, `summary`, `madeUp`, and `claims`. An object with a `state` belongs to that state only.
- **Paths** list scenes in order, for a presenter's clicker, which steps through a scene's states before moving on.

## The drawings

`js/art.js` draws each scene as one SVG, 1600 by 1000, in up to four paper layers (`.lay.l1` farthest to `.lay.l4` nearest) as VSUrvey's scenes are, and arrives with a short fade. Its middle, 1600 by 1000, always shows whole; its backgrounds run on to the sides, and the engine widens or deepens the view to the screen's shape, so the scene fills the screen without trimming or blurring ([D-167](https://docs.projectcampus.org/decisions.html#d-167)). The campus and the building are isometric; rooms and screens are front on. An object is a group with `data-object`, and `data-lx` and `data-ly` mark where its label sits. In a scene with states, `data-show="campus"` shows a piece only in that state, `data-dim="today"` dims it, a `.mover` with `data-at-campus="x y scale"` moves there, and `data-delay` staggers the way in. Drawings carry no words, except inside a labeled mock-up; places are kinds of place, never a named building, college, or department ([D-153](https://docs.projectcampus.org/decisions.html#d-153)).

## Words and keys

The scene fills the screen. Navigation (the trail, Back, Words) waits above the top edge and slides down when the cursor comes near; W shows or hides it with the words; on a phone, a small button in the corner shows it. Everything else is a pop-up on the scene: a card for each object, and "About this scene" for its title, summary, and sources (under the drawing on a phone). The footer, with the notice, is a scroll away. Words (titles, summaries, sources, labels) show or hide together with the **Words** button or **W**. With words off, a gold dot still marks everything that opens, and made-up labels and the notice stay.

| Key | Does |
| --- | --- |
| Tab, then Enter | open the focused object |
| Esc or Backspace | close a card, or go back up one scene |
| → Space PageDown | next state, then next scene on the path |
| ← PageUp | previous state, then previous scene on the path |
| Home | back to the campus |
| W | words on or off |
| I | about this scene: its title, summary, and sources |
| S | switch a scene between today and with CAMPUS |
| P | presenting: hide the bar |
| B or . | blank the screen; any key brings it back |

Addresses: `?scene=lab`, `?scene=elsewhere&state=campus`, `?path=places`, `?words=off`. A parameter only chooses how a visit starts; nothing is collected.

## Run and test locally

The page fetches `data/scenes.json`, which browsers block over `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000/                       the campus
# http://localhost:8000/?scene=lab             a scene
# http://localhost:8000/?scene=screen&words=off
```

Before pushing:

```bash
node --check js/main.js && node --check js/art.js
cd tests && npm install && npm test
```

## Deploy

On Vercel, import this repository with the framework preset "Other", no build command, and the repository's root as the output directory. `vercel.json` sets the headers.

## Name guard

On GitHub, open Settings > Secrets and variables > Actions, add a repository secret named `PRIVATE_NAMES`, and enter the names, one per line: the same list as the master doc's. Every pull request then fails the "Name guard" check if a line it adds contains one. To run the same check before each commit on your own computer: `git config core.hooksPath scripts/hooks`, with the names in `~/.config/project-campus/private-names.txt`.

## Licence

Code is under the [MIT License](LICENSE). Writing and pictures are under [CC BY 4.0](LICENSE-CONTENT.md), which says which files are which. Copyright © 2026 Leo M. Subingsubing ([D-159](https://docs.projectcampus.org/decisions.html#d-159)).
