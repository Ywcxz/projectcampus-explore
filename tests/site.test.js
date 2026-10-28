// The documentary site's test: the rules every page follows (D-148), the
// story files' format (D-147), and the page itself, rendered in jsdom,
// with its depths, doors, paths, and presenter mode.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");
let passed = 0;
const failures = [];
function check(ok, label) {
  if (ok) passed++;
  else failures.push(label);
}
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// Every file the site serves or the repository holds, apart from tests and dependencies.
function files(dir = ROOT, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if ([".git", "node_modules", "tests"].includes(name)) continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) files(full, out);
    else out.push(path.relative(ROOT, full));
  }
  return out;
}
const ALL = files();
const TEXT = ALL.filter((f) => /\.(html|css|js|json|md|yml|svg|txt)$/.test(f) || f.endsWith("pre-commit"));
const PAGES = ALL.filter((f) => f.endsWith(".html"));

// The master doc's chapter pages, for sources that cite a chapter.
const MASTER_CHAPTERS = [
  "overview", "campus", "intranet", "emergencies", "campus-network", "ring-tests", "social-network",
  "use-cases", "network-design", "network-fit", "network-proposal", "marketplace", "housing", "hop-it",
  "digital-twin", "later-directions", "vsu-context", "evidence", "facebook-study", "governance",
  "related-work", "risks", "roadmap", "decisions",
];
const TAGS = ["Established", "Proposed", "Unresolved"];
const DEPTHS = ["glance", "explain", "evidence"];
const KINDS = ["example", "mockup", "card", "door"];
const MADE_UP = ["composite", "sample", "mockup", "later-module", "demo"];
const NOTICE = "Not affiliated with Visayas State University";

/* ---------- rules for every page and file ---------- */

for (const page of PAGES) {
  const html = read(page);
  check(html.includes(NOTICE), `${page}: carries the not-affiliated notice (D-148)`);
  check(!/<(form|input|textarea|select)\b/i.test(html), `${page}: has no form or input, since the site collects nothing (D-148)`);
  const refs = [...html.matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)="([^"]+)"/gi)].map((m) => m[1]);
  check(refs.every((r) => !/^(https?:)?\/\//i.test(r)), `${page}: loads nothing from another site`);
  check(!/<script>(?!\s*<\/script>)/i.test(html), `${page}: has no inline script, which the security policy would block`);
  check(!/\sstyle="/i.test(html), `${page}: has no inline style, which the security policy would block`);
}

// One cache key for every page's CSS and JavaScript, bumped together.
const keys = new Set(PAGES.flatMap((p) => [...read(p).matchAll(/\.(?:css|js)\?v=([\w.]+)/g)].map((m) => m[1])));
check(keys.size === 1, `every page uses the same ?v= key (found ${[...keys].join(", ") || "none"})`);

// No seal or logo of VSU's (D-148).
check(!ALL.some((f) => /seal|logo/i.test(path.basename(f))), "no file is named as a seal or logo");

// No address on Facebook or another Meta site (D-041, D-044).
const META = new RegExp(["facebook", "fb", "fbcdn", "messenger", "instagram", "threads", "whatsapp", "meta"].map((d) => d + "\\.(com|me|net|watch)\\b").join("|"), "i");
for (const f of TEXT) check(!META.test(read(f)), `${f}: names no Facebook or Meta address (D-041, D-044)`);

// The retired expansion of the name (D-040).
const RETIRED = new RegExp(["Connected", "Academic", "Matrix"].join("\\s+"), "i");
for (const f of TEXT) check(!RETIRED.test(read(f)), `${f}: does not use the retired name (D-040)`);

// The engine stores nothing, sends nothing, and names no web address.
const js = read("js/main.js");
for (const word of ["localStorage", "sessionStorage", "indexedDB", "document.cookie", "sendBeacon", "XMLHttpRequest", "WebSocket"]) {
  check(!js.includes(word), `js/main.js: does not use ${word} (D-148)`);
}
check(!/https?:\/\//.test(js), "js/main.js: names no web address");
check(!/innerHTML/.test(js), "js/main.js: builds the page without innerHTML");

/* ---------- the story files ---------- */

function words(s) { return String(s).trim().split(/\s+/).filter(Boolean).length; }

function checkSource(src, where) {
  if (!src) return check(false, `${where}: has a source`);
  if (src.ref) return check(/^[DQCEP]-\d+$/.test(src.ref), `${where}: source ${src.ref} is a register ID`);
  if (src.chapter) return check(MASTER_CHAPTERS.includes(src.chapter), `${where}: source chapter ${src.chapter} is a master doc chapter`);
  if (src.href) return check(/^https:\/\//.test(src.href) && !!src.label, `${where}: source link is https and labeled`);
  check(false, `${where}: source has a ref, chapter, or href`);
}

function checkClaim(claim, where) {
  check(typeof claim.text === "string" && claim.text.trim() !== "", `${where}: claim has text`);
  check(TAGS.includes(claim.tag), `${where}: claim tag ${claim.tag} is Established, Proposed, or Unresolved`);
  checkSource(claim.source, where);
}

function checkTopic(t, where, ids, deeperIds) {
  const at = `${where} topic ${t.id}`;
  check(/^[a-z0-9-]+$/.test(t.id || ""), `${at}: has a lowercase id`);
  check(!ids.has(t.id), `${at}: id is unique`);
  ids.add(t.id);
  check(!!t.title, `${at}: has a title`);
  check(t.madeUp === undefined || t.madeUp === null || MADE_UP.includes(t.madeUp), `${at}: madeUp is a known label`);
  if (t.glance && t.glance.line) check(words(t.glance.line) <= 40, `${at}: glance line is 40 words or fewer`);
  (t.claims || []).forEach((c) => checkClaim(c, at));
  (t.sources || []).forEach((s) => checkSource(s, at));
  for (const p of t.parts || []) {
    const pat = `${at} part ${p.id}`;
    check(/^[a-z0-9-]+$/.test(p.id || ""), `${pat}: has a lowercase id`);
    check(!ids.has(p.id), `${pat}: id is unique`);
    ids.add(p.id);
    check(KINDS.includes(p.kind), `${pat}: kind ${p.kind} is example, mockup, card, or door`);
    if (p.kind === "door") {
      check(deeperIds.has(p.to), `${pat}: opens a deeper topic of its chapter`);
      continue;
    }
    // Pictures and mock-ups say whether they are made up; a mock-up always is (D-148).
    check("madeUp" in p, `${pat}: says whether it is made up (madeUp)`);
    check(p.madeUp === null || MADE_UP.includes(p.madeUp), `${pat}: madeUp is null or a known label`);
    if (p.kind === "mockup") check(!!p.madeUp, `${pat}: a mock-up is labeled as made up`);
    if (p.kind === "card") checkSource(p.source, pat);
    if (p.narration) check(words(p.narration) <= 40, `${pat}: narration is 40 words or fewer (D-146)`);
    (p.claims || []).forEach((c) => checkClaim(c, pat));
  }
}

function checkStory(file) {
  const data = JSON.parse(read(file));
  check(!!data.site && /^https:\/\/.+\/$/.test(data.site.masterDoc || ""), `${file}: names the master doc's address, ending in /`);
  const chapters = data.chapters || [];
  const chapterIds = new Set(chapters.map((c) => c.id));
  check(chapterIds.size === chapters.length, `${file}: chapter ids are unique`);
  check(new Set(chapters.map((c) => c.number)).size === chapters.length, `${file}: chapter numbers are unique`);

  const ids = new Set();
  const allDeeper = new Set();
  for (const c of chapters) {
    const where = `${file} chapter ${c.id}`;
    check(Number.isInteger(c.number) && !!c.title, `${where}: has a whole number and a title`);
    (c.sources || []).forEach((s) => checkSource(s, where));
    const deeperIds = new Set((c.deeper || []).map((t) => t.id));
    deeperIds.forEach((id) => allDeeper.add(id));
    (c.topics || []).forEach((t) => checkTopic(t, where, ids, deeperIds));
    (c.deeper || []).forEach((t) => checkTopic(t, where, ids, deeperIds));
    if (c.status) {
      [...(c.status.know || []), ...(c.status.think || [])].forEach((cl) => checkClaim(cl, `${where} status`));
      // How we'll find out names the test and the bar it must clear, and links to where the bar is fixed.
      for (const f of c.status.findOut || []) {
        check(!!f.text && !!f.method && !!f.bar, `${where} status: each "how we'll find out" has text, a method, and a bar`);
        checkSource(f.source, `${where} status: "${f.text}"`);
      }
    }
  }

  check(chapterIds.has((data.paths || []).find((p) => p.id === data.defaultPath) ? data.paths.find((p) => p.id === data.defaultPath).chapters[0] : null), `${file}: the default path exists and starts on a chapter`);
  for (const p of data.paths || []) {
    const where = `${file} path ${p.id}`;
    check(!!p.label, `${where}: has a label`);
    check(DEPTHS.includes(p.depth), `${where}: depth is glance, explain, or evidence`);
    check(p.chapters.length > 0 && p.chapters.every((id) => chapterIds.has(id)), `${where}: names only chapters that exist`);
    check(new Set(p.chapters).size === p.chapters.length, `${where}: names each chapter once`);
    check((p.openDoors || []).every((id) => allDeeper.has(id)), `${where}: opens only doors that exist`);
  }
  return data;
}

const story = checkStory("data/story.json");
const demo = checkStory("data/demo.json");

/* ---------- the page, rendered ---------- */

const html = read("index.html");

function page(url) {
  const dom = new JSDOM(html, { url, runScripts: "outside-only", pretendToBeVisual: true });
  dom.window.CAMPUS_NO_BOOT = true;
  dom.window.eval(js);
  return dom.window;
}

// A section that throws is reported as a failure, not a crash, so the
// summary still names what broke.
function section(label, fn) {
  try { fn(); } catch (e) { check(false, `${label}: threw ${e.message}`); }
}

function key(win, k) {
  win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
}

// The story, on every path.
for (const p of story.paths) section(`path ${p.id}`, () => {
  const win = page(`https://projectcampus.org/?path=${p.id}`);
  const doc = win.document;
  win.CampusStory.start(story, { path: p.id, doc, win });
  const main = [...doc.querySelectorAll("#story > .chapter:not(.off-path)")].map((s) => s.dataset.chapter);
  check(JSON.stringify(main) === JSON.stringify(p.chapters), `path ${p.id}: shows its chapters in its order`);
  check(doc.querySelectorAll("#story > .chapter").length === story.chapters.length, `path ${p.id}: every chapter stays reachable`);
  check(doc.querySelectorAll("#menu-chapters a").length === story.chapters.length, `path ${p.id}: the menu lists every chapter`);
  check(doc.querySelector('#menu-paths a[aria-current="true"]').textContent === p.label, `path ${p.id}: the menu marks it as the current path`);
  check(doc.body.textContent.includes(NOTICE), `path ${p.id}: the rendered page carries the notice`);
});

section("story placeholders", () => {
  const win = page("https://projectcampus.org/");
  const doc = win.document;
  win.CampusStory.start(story, { doc, win });
  for (const c of story.chapters.filter((ch) => !(ch.topics || []).length)) {
    check(!!doc.querySelector(`#ch-${c.id} .chapter-placeholder`), `chapter ${c.id}: shows a placeholder until it is scripted`);
  }
  check(doc.getElementById("master-doc-link").href === story.site.masterDoc, "the footer links to the master doc");

  // Every claim on the page shows its tag and a working source link (D-148).
  const claims = [...doc.querySelectorAll("#story .claim")];
  check(claims.every((c) => c.querySelector(".tag") && c.querySelector("a.source[href^='https://']")), "every rendered claim shows a tag and links to its source");
  check(!doc.querySelector("#story .source-missing"), "no rendered source is missing");

  // A scripted chapter's made-up parts carry their labels where they render.
  const madeUp = story.chapters.flatMap((c) => [...(c.topics || []), ...(c.deeper || [])]).flatMap((t) => t.parts || []).filter((p) => p.madeUp);
  check(madeUp.every((p) => doc.querySelector(`#pb-${p.id} .made-up`)), "every made-up part in the story shows its label");
});

// The demo exercises every feature.
section("demo", () => {
  const win = page("https://projectcampus.org/?demo");
  const doc = win.document;
  const { presenter } = win.CampusStory.start(demo, { doc, win, demo: true });

  const topic = doc.getElementById("t-parts-demo");
  check(topic.dataset.depth === "explain", "demo: a topic opens at its path's depth");
  doc.querySelector('#t-parts-demo .depth-btn[data-depth="evidence"]').click();
  check(topic.dataset.depth === "evidence", "depth: Evidence switches the topic to evidence");
  check(doc.querySelector('#t-parts-demo .depth-btn[data-depth="evidence"]').getAttribute("aria-pressed") === "true", "depth: the pressed button shows it");

  const toggle = doc.querySelector("#p-demo-mockup .part-toggle");
  const body = doc.getElementById("pb-demo-mockup");
  check(body.hidden, "part: starts closed");
  toggle.click();
  check(!body.hidden && toggle.getAttribute("aria-expanded") === "true", "part: a tap opens it");
  toggle.click();
  check(body.hidden, "part: a second tap closes it");

  check(body.querySelector(".made-up").textContent === "Sample: not an official VSU notice", "made up: a sample carries its label (D-108)");
  const madeUpParts = demo.chapters.flatMap((c) => [...(c.topics || []), ...(c.deeper || [])]).flatMap((t) => t.parts || []).filter((p) => p.madeUp);
  check(madeUpParts.every((p) => doc.querySelector(`#pb-${p.id} .made-up`)), "made up: every made-up part shows a label");

  const claim = doc.querySelector("#t-parts-demo .evidence .claim");
  check(!!claim.querySelector(".tag.tag-established"), "claim: shows its tag as a badge");
  check(claim.querySelector("a.source").href === `${demo.site.masterDoc}decisions.html#d-147`, "claim: links to its register row in the master doc");
  check(doc.querySelector("#pb-demo-card a.source").href === `${demo.site.masterDoc}decisions.html`, "card: links to its master doc chapter");
  check(doc.querySelector("#pb-demo-unscripted .narration").textContent === "Narration to come.", "placeholder: an empty narration says so");
  check(doc.querySelector("#ch-how-it-works .find-result").textContent.includes("Not yet collected."), "status strip: a missing result says so");

  const door = doc.getElementById("door-demo-door");
  const deeper = doc.getElementById("t-deeper-demo");
  check(deeper.hidden, "door: the deeper topic starts closed");
  door.click();
  check(!deeper.hidden && door.getAttribute("aria-expanded") === "true", "door: a tap opens the deeper topic");
  deeper.querySelector(".back-to-path").click();
  check(doc.activeElement === door, "door: Back to the story returns to the door");
  door.click();
  check(deeper.hidden, "door: a second tap closes it");

  // Presenter mode, with a keyboard or clicker.
  key(win, "p");
  check(doc.body.classList.contains("presenting") && !doc.getElementById("presenter-bar").hidden, "presenter: P starts it");
  const st = presenter.state;
  check(st.steps[st.i].type === "chapter", "presenter: starts on the chapter");
  key(win, "ArrowRight");
  check(st.steps[st.i].node.id === "t-parts-demo", "presenter: next goes to the topic");
  key(win, "PageDown");
  check(!doc.getElementById("pb-demo-example").hidden, "presenter: a clicker's next opens the part");
  key(win, "PageUp");
  check(doc.getElementById("pb-demo-example").hidden, "presenter: going back closes the part it opened");
  while (st.steps[st.i].type !== "door") key(win, "ArrowRight");
  key(win, "Enter");
  check(!deeper.hidden && st.trips.length === 1 && st.steps[st.i].node === deeper, "presenter: Enter opens the door as a side trip");
  key(win, "Backspace");
  check(st.trips.length === 0 && st.steps[st.i].type === "door", "presenter: Backspace returns to the main path where it left");
  key(win, "ArrowRight");
  check(st.steps[st.i].node.id === "p-demo-unscripted", "presenter: next after a door skips it");
  key(win, "]");
  check(st.steps[st.i].node.id === "ch-a-path-skips-this", "presenter: ] jumps to the next chapter");
  check(doc.getElementById("ch-a-path-skips-this").classList.contains("is-current") &&
    !doc.getElementById("ch-how-it-works").classList.contains("is-current"), "presenter: shows only the current chapter");
  key(win, "[");
  check(st.steps[st.i].node.id === "ch-how-it-works", "presenter: [ jumps back a chapter");
  key(win, "1");
  check(st.steps[st.i].node.id === "ch-a-path-skips-this", "presenter: a number key jumps to that chapter");
  key(win, "b");
  check(!doc.getElementById("blank-screen").hidden, "presenter: B blanks the screen");
  key(win, "ArrowRight");
  check(doc.getElementById("blank-screen").hidden && st.steps[st.i].node.id === "ch-a-path-skips-this", "presenter: any key brings the screen back without moving");
  key(win, "Escape");
  check(!doc.body.classList.contains("presenting") && doc.getElementById("presenter-bar").hidden, "presenter: Escape leaves it");
});

// A path that reads at a glance and opens a door by default.
section("demo-glance path", () => {
  const win = page("https://projectcampus.org/?path=demo-glance&demo");
  const doc = win.document;
  const { presenter } = win.CampusStory.start(demo, { path: "demo-glance", doc, win, demo: true });
  check(doc.getElementById("t-parts-demo").dataset.depth === "glance", "path depth: a glance path opens topics at a glance");
  check(!doc.getElementById("t-deeper-demo").hidden, "path doors: a path can open a door by default");
  check(doc.getElementById("ch-a-path-skips-this").classList.contains("off-path"), "off path: a chapter outside the path is set apart");

  presenter.start();
  presenter.goToChapter("a-path-skips-this");
  check(presenter.state.trips.length === 1 && presenter.state.steps[presenter.state.i].node.id === "ch-a-path-skips-this", "presenter: an off-path chapter is a side trip");
  key(win, "Backspace");
  check(presenter.state.trips.length === 0, "presenter: Backspace returns from an off-path chapter");
  presenter.stop();
});

/* ---------- register IDs in the repository's notes ---------- */

// Every decision or evidence ID in the README and licence notes links to its
// row in the master doc, so a reader on GitHub can open it.
for (const f of ["README.md", "LICENSE-CONTENT.md"]) {
  const plain = read(f)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\[[DQCEP]-\d{2,3}\]\(https:\/\/docs\.projectcampus\.org\/(decisions|evidence)\.html#[dqcep]-\d{2,3}\)/g, "")
    .match(/\b[DQCEP]-\d{2,3}\b/g);
  check(!plain, `${f}: register IDs link to the master doc${plain ? ` (unlinked: ${plain.join(", ")})` : ""}`);
}

/* ---------- report ---------- */

for (const f of failures) console.error(`FAIL ${f}`);
console.log(`${passed}/${passed + failures.length} checks passed`);
process.exit(failures.length ? 1 : 0);
