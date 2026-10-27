# projectcampus-explore

Project CAMPUS, told as an interactive documentary. The concept note's QR code leads to the landing page at projectcampus.org, which shows this site's status (D-154). An independent proposal by one alumnus, not affiliated with Visayas State University.

**Status:** a skeleton. The engine, paths, and presenter mode work; the chapters are not scripted yet, and each shows a placeholder until it is. Planned address: explore.projectcampus.org (D-154, revising D-150).

## Where it comes from

Everything on this site is built from the [master doc](https://github.com/Ywcxz/projectcampus-docs), Project CAMPUS's reference layer (D-082). The master doc wins wherever the two differ, and a claim goes on this site only once it is there. The site's own decisions are rows D-146 to D-155 of the master doc's [decision register](https://github.com/Ywcxz/projectcampus-docs/blob/main/content/13-decisions.md).

- **D-146:** the explainer-video style, with original art and invented characters.
- **D-147:** chapters hold topics, topics hold parts; three depths; audience paths; presenter mode.
- **D-148:** the rules every scene follows.
- **D-149:** this repository and Vercel project, apart from the master doc's.
- **D-150:** the name, Project CAMPUS. Its address, projectcampus.org, was revised by D-154: the site moves to explore.projectcampus.org and the root becomes the landing page.

## Layout

```
projectcampus-explore/
├── index.html            the one page: masthead, notice, menu, story, footer
├── data/story.json       the story: chapters, topics, parts, claims, and paths
├── data/demo.json        a short demo of every feature, opened with ?demo
├── js/main.js            the engine: renders a story file, runs paths, depths, doors, and presenter mode
├── css/site.css          the master doc's palette, light and dark, phone first
├── img/                  the project's icon
├── tests/                the site test (rules, story files, and the page in jsdom)
├── scripts/hooks/        the name guard as a local pre-commit hook
├── .github/workflows/    the site test and the name guard on every pull request
├── CLAUDE.md             working rules for Claude sessions in this repository
└── vercel.json           security policy, no indexing, and cache headers
```

## The story file

`data/story.json` holds the whole story, so the script changes without touching the engine.

- **Chapters** have an `id`, a whole `number`, a `title`, their master doc `sources`, a list of `topics`, a list of `deeper` topics that doors open, and a `status` strip or `null`.
- **Topics** have a `glance` (one `line` and one `visual`), a list of `parts`, their `claims`, and their `sources`.
- **Parts** have a `kind`: `example`, `mockup`, `card`, or `door` (with `to`, a deeper topic's id). Every part but a door says whether it is made up in `madeUp`: `null`, or `composite`, `sample`, `mockup`, or `later-module`. The engine prints the matching label, such as "Composite: not a real post", so the label can't be left off.
- **Claims** have `text`, a `tag` (Established, Proposed, or Unresolved), and a `source`: a register ID (`{ "ref": "E-023" }`), a master doc chapter (`{ "chapter": "social-network", "label": "Ch 3" }`), or an official page (`{ "href": "https://…", "label": "…" }`).
- **Paths** list chapters in order, the `depth` topics open at, and the doors open by default. Every chapter stays reachable from the menu.

Anything left `null` shows a placeholder: "Narration to come", "Picture to come", "Not yet collected".

## Presenter mode

Press **P** or the Present button. A keyboard or clicker steps through the current path:

| Key | Does |
| --- | --- |
| → ↓ Space PageDown | next step (opens the next part) |
| ← ↑ PageUp | previous step (closes a part it opened) |
| Enter | open the door at this step, as a side trip |
| Backspace | leave a side trip, back to the main path |
| ] and [ | next or previous chapter |
| 0 to 9 | jump to that chapter |
| B or . | blank the screen |
| Esc or P | leave presenter mode |

## Run and test locally

The page fetches `data/story.json`, which browsers block over `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000/          the story
# http://localhost:8000/?demo     the demo
# http://localhost:8000/?path=ict a path
```

Before pushing:

```bash
node --check js/main.js
cd tests && npm install && npm test
```

## Deploy

On Vercel, import this repository with the framework preset "Other", no build command, and the repository's root as the output directory. `vercel.json` sets the headers.

## Name guard

On GitHub, open Settings > Secrets and variables > Actions, add a repository secret named `PRIVATE_NAMES`, and enter the names, one per line: the same list as the master doc's. Every pull request then fails the "Name guard" check if a line it adds contains one. To run the same check before each commit on your own computer: `git config core.hooksPath scripts/hooks`, with the names in `~/.config/project-campus/private-names.txt`.

## Licence

Code is under the [MIT License](LICENSE). Writing and pictures are under [CC BY 4.0](LICENSE-CONTENT.md), which says which files are which. Copyright © 2026 Leo M. Subingsubing (D-159).
