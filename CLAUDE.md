# projectcampus-explore: notes for Claude

This repository is the documentary site of Project CAMPUS (D-084, D-149, D-150). It is built from the master doc, `Ywcxz/projectcampus-docs`, which is the reference layer (D-082). The master doc's `CLAUDE.md` and `content/README.md` apply here too; this file adds what is particular to the site.

## Before you edit

- Read the live file you are changing. Read the master doc chapters a scene draws on at main, live, before you script it. Never build a scene from memory or from a brief alone.
- A new idea goes into the master doc before it goes on the site. If a scene needs a claim, a feature, or a decision the master doc doesn't have, propose it there first, as a row or a chapter edit by pull request.
- The site's own decisions are D-146 to D-155 in the master doc's register. A decision about the site counts only once it is a row there.

## Rules every scene follows (D-148)

- Every claim in `data/story.json` has a tag (Established, Proposed, or Unresolved) and a source: a register ID, a master doc chapter, or an official page. A claim is no stronger than its source. Numbers come only from the evidence register, re-checked against the source when the script is written.
- No Facebook screenshots, quotes, post links, or group names. Examples drawn from Facebook are paraphrased composites, with `"madeUp": "composite"`.
- Made-up content says so: `"madeUp"` on every part but a door, and always on a mock-up. Later modules appear only as labeled mock-ups (D-102).
- No VSU seal or logo. The not-affiliated notice stays in the HTML of every page, not only in what the script renders.
- The site collects nothing: no forms, inputs, accounts, cookies, storage, analytics, or requests beyond its own files. Discussion prompts are spoken in the room, not typed into the site.
- Photos are the owner's own, of campus locations and buildings, with no identifiable person unless they agreed.
- Narration is 40 words or fewer per part, in plain English (D-146). Art and characters are original; nothing imitates an explainer channel's characters, palette, or branding.
- Nothing about DIGITS beyond what the Third SOUA states (D-017).

## Never

- Name stakeholders or describe private conversations (D-030).
- Name or link a community-run Facebook page or group, or link an article whose address names one (D-044).
- Open, fetch, or automate Facebook or any other Meta site (D-041).
- Use the retired expansion of the name (D-040).
- Commit survey responses, contact details, or interview notes (D-086).

## Before you push

```bash
node --check js/main.js
cd tests && npm install && npm test
```

- Changed anything in `css/` or `js/`? Bump the `?v=` key on every page. The test fails if pages disagree.
- The engine names no web address; the master doc's address lives in `data/*.json` (`site.masterDoc`) and in the HTML's fallback links.
- The owner checks visuals himself. Verify with the site test, not screenshots.
- If the "Name guard" check fails, a line you added names someone on the owner's private list. Remove the line it points to; the check never shows the name.
- Work on a branch named `claude/` plus a short topic and open a pull request; the owner merges.
