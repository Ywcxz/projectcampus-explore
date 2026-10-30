// The interactive site's test: the rules every page follows (D-148), the
// scene file's format (D-152, D-170), the drawings (D-171), and the page
// itself, rendered in jsdom: zooms, cards, words, paths, and keys.
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
const MADE_UP = ["layout", "illustration", "mockup", "sample", "composite", "later-module"];
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

// The engine and the drawings store nothing, send nothing, and name no web address.
const js = read("js/main.js");
const artJs = read("js/art.js");
for (const [name, src] of [["js/main.js", js], ["js/art.js", artJs]]) {
  for (const word of ["localStorage", "sessionStorage", "indexedDB", "document.cookie", "sendBeacon", "XMLHttpRequest", "WebSocket", "innerHTML", "<image"]) {
    check(!src.includes(word), `${name}: does not use ${word} (D-148)`);
  }
}
check(!/https?:\/\//.test(js), "js/main.js: names no web address");
check(!/https?:\/\/(?!www\.w3\.org\/2000\/svg)/.test(artJs), "js/art.js: names no web address but the SVG namespace");
check(/fetch\("data\/scenes\.json"\)/.test(js) && (js.match(/fetch\(/g) || []).length === 1, "js/main.js: fetches only its own scene file");

/* ---------- the scene file ---------- */

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
function checkChapter(ch, where) {
  check(!!ch && MASTER_CHAPTERS.includes(ch.chapter) && !!ch.label, `${where}: links a master doc chapter with a label`);
}

const data = JSON.parse(read("data/scenes.json"));
check(!!data.site && /^https:\/\/.+\/$/.test(data.site.masterDoc || ""), "scenes: names the master doc's address, ending in /");
const scenes = new Map(data.scenes.map((s) => [s.id, s]));
const cards = new Map((data.cards || []).map((c) => [c.id, c]));
check(scenes.size === data.scenes.length, "scenes: ids are unique");
check(cards.size === (data.cards || []).length, "cards: ids are unique");
check(scenes.has(data.start) && scenes.get(data.start).parent === null, "scenes: the start scene exists and has no parent");

// The drawings, loaded once, outside the page.
const artWin = new JSDOM("<!DOCTYPE html><body></body>", { runScripts: "outside-only" }).window;
artWin.eval(artJs);
const ART = artWin.CampusArt || {};
function drawingOf(scene) {
  const make = ART[scene.art];
  if (typeof make !== "function") return null;
  const doc = new artWin.DOMParser().parseFromString(make(), "image/svg+xml");
  return doc.querySelector("parsererror") ? null : doc.documentElement;
}

const reached = new Set([data.start]);
for (const s of data.scenes) {
  const at = `scene ${s.id}`;
  check(/^[a-z0-9-]+$/.test(s.id || ""), `${at}: has a lowercase id`);
  check(!!s.title && !!s.summary, `${at}: has a title and a summary`);
  check(words(s.summary) <= 40, `${at}: summary is 40 words or fewer (D-146)`);
  check(s.madeUp === null || MADE_UP.includes(s.madeUp), `${at}: madeUp is null or a known label`);
  check(s.parent === null || scenes.has(s.parent), `${at}: its parent exists`);
  (s.claims || []).forEach((c) => checkClaim(c, at));
  check((s.chapters || []).length > 0, `${at}: ends with a link to its chapter (D-152)`);

  // Its states, if it has them: today and with CAMPUS, switched in place (D-172).
  const stateIds = (s.states || []).map((x) => x.id);
  if (s.states) {
    check(s.states.length >= 2 && new Set(stateIds).size === stateIds.length && stateIds.every((id) => /^[a-z0-9-]+$/.test(id)), `${at}: has two or more states with unique lowercase ids`);
    s.states.forEach((x, n) => {
      const sat = `${at} state ${x.id}`;
      check(!!x.label && words(x.label) <= 3, `${sat}: has a short label`);
      if (n === 0) check(!x.title && !x.summary && !x.claims && x.madeUp === undefined, `${sat}: the first state uses the scene's own words`);
      if (x.summary !== undefined) check(words(x.summary) <= 40, `${sat}: summary is 40 words or fewer (D-146)`);
      if (x.madeUp !== undefined) check(x.madeUp === null || MADE_UP.includes(x.madeUp), `${sat}: madeUp is null or a known label`);
      (x.claims || []).forEach((c) => checkClaim(c, sat));
    });
  }
  (s.chapters || []).forEach((ch) => checkChapter(ch, at));

  // Its drawing: well formed, kinds of place, and no words of its own outside a mock-up (D-171).
  const svg = drawingOf(s);
  check(!!svg && svg.nodeName === "svg", `${at}: its drawing ${s.art} exists and is well formed`);
  if (!svg) continue;
  check(svg.getAttribute("viewBox") === "0 0 1600 1000", `${at}: its drawing is 1600 by 1000`);
  check(!!svg.getAttribute("aria-label"), `${at}: its drawing is described for screen readers`);
  check(svg.querySelectorAll(".lay").length >= 2, `${at}: its drawing is in paper layers (D-167)`);
  const lettered = [...svg.querySelectorAll("text")].filter((t) => /[A-Za-z]/.test(t.textContent));
  if (s.madeUp !== "mockup") check(lettered.length === 0, `${at}: its drawing carries no words outside a mock-up (D-171)`);
  else check(lettered.some((t) => /Mock-up/.test(t.textContent)), `${at}: its mock-up says so inside the picture (D-108)`);
  // Pieces that change with the state name only states the scene has.
  const named = [...svg.querySelectorAll("[data-show], [data-dim]")].flatMap((e) => `${e.getAttribute("data-show") || ""} ${e.getAttribute("data-dim") || ""}`.trim().split(/\s+/));
  const moved = [...svg.querySelectorAll(".mover")].flatMap((e) => [...e.attributes].filter((a) => a.name.startsWith("data-at-")).map((a) => a.name.slice(8)));
  check(named.concat(moved).every((id) => stateIds.includes(id)), `${at}: its drawing's states are the scene's states`);
  check([...svg.querySelectorAll(".mover")].every((e) => [...e.attributes].some((a) => a.name.startsWith("data-at-") && /^-?[\d.]+ -?[\d.]+ [\d.]+$/.test(a.value))), `${at}: every moving piece says where it moves`);
  if (lettered.some((t) => /notice/i.test(t.textContent) && /Official/.test(t.textContent)) || svg.textContent.includes("Official")) {
    check(svg.textContent.includes("Sample: not an official VSU notice"), `${at}: a notice in a mock-up is marked as a sample (D-108)`);
  }

  const ids = new Set();
  for (const o of s.objects || []) {
    const oat = `${at} object ${o.id}`;
    check(/^[a-z0-9-]+$/.test(o.id || "") && !ids.has(o.id), `${oat}: has a unique lowercase id`);
    ids.add(o.id);
    check(!!o.label && words(o.label) <= 6, `${oat}: has a short label`);
    if (o.state !== undefined) check(stateIds.includes(o.state), `${oat}: belongs to one of the scene's states`);
    const g = svg.querySelector(`[data-object="${o.id}"]`);
    check(!!g, `${oat}: is drawn`);
    if (g) {
      const lx = Number(g.getAttribute("data-lx")), ly = Number(g.getAttribute("data-ly"));
      check(lx >= 0 && lx <= 1600 && ly >= 0 && ly <= 1000, `${oat}: its label point is inside the drawing`);
    }
    const to = o.opens || {};
    check(!!to.scene !== !!to.card, `${oat}: opens one scene or one card`);
    if (to.scene) {
      check(scenes.has(to.scene) && scenes.get(to.scene).parent === s.id, `${oat}: opens a scene whose parent is this one`);
      reached.add(to.scene);
    }
    if (to.card) check(cards.has(to.card), `${oat}: opens a card that exists`);
  }
}
for (const s of data.scenes) check(reached.has(s.id), `scene ${s.id}: can be reached from the start`);
for (const c of data.cards || []) {
  const at = `card ${c.id}`;
  check(!!c.title && !!c.text, `${at}: has a title and text`);
  check(words(c.text) <= 40, `${at}: text is 40 words or fewer`);
  check((c.claims || []).length > 0, `${at}: shows at least one claim`);
  (c.claims || []).forEach((cl) => checkClaim(cl, at));
  checkChapter(c.chapter, at);
}
for (const p of data.paths || []) {
  check(!!p.label && p.scenes.length > 0 && p.scenes.every((id) => scenes.has(id)) && new Set(p.scenes).size === p.scenes.length, `path ${p.id}: names each of its scenes once, and only scenes that exist`);
}

/* ---------- the page, rendered ---------- */

const html = read("index.html");
function page(url) {
  const dom = new JSDOM(html, { url, runScripts: "outside-only", pretendToBeVisual: true });
  dom.window.CAMPUS_NO_BOOT = true;
  dom.window.eval(artJs);
  dom.window.eval(js);
  return dom.window;
}
function section(label, fn) {
  try { fn(); } catch (e) { check(false, `${label}: threw ${e.message}`); }
}
function key(win, k) {
  win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
}
const MASTER = data.site.masterDoc;

// Every scene, opened by its address.
for (const s of data.scenes) section(`page ?scene=${s.id}`, () => {
  const win = page(`https://explore.projectcampus.org/?scene=${s.id}`);
  const doc = win.document;
  const app = win.CampusScenes.start(data, { doc, win });
  check(app.state.scene.id === s.id, `?scene=${s.id}: opens that scene`);
  check(doc.getElementById("scene-title").textContent === s.title, `?scene=${s.id}: shows its title`);
  check(doc.body.textContent.includes(NOTICE), `?scene=${s.id}: the rendered page carries the notice`);
  const made = doc.getElementById("made-up");
  check(s.madeUp ? !made.hidden && made.textContent === win.CampusScenes.MADE_UP[s.madeUp] : made.hidden, `?scene=${s.id}: says what is made up, and only then`);
  const first = s.states ? s.states[0].id : null;
  for (const o of s.objects || []) {
    const on = !o.state || o.state === first;
    const g = doc.querySelector(`#frame [data-object="${o.id}"]`);
    check(!!g && g.getAttribute("role") === "button" && g.getAttribute("tabindex") === (on ? "0" : "-1") && g.getAttribute("aria-label") === o.label, `?scene=${s.id} ${o.id}: is a button for keyboard and screen readers, focusable only in its state`);
    const lb = doc.querySelector(`#labels .label[data-object="${o.id}"]`);
    check(!!lb && lb.hidden === !on, `?scene=${s.id} ${o.id}: has its label, shown only in its state`);
  }
  check(doc.getElementById("states").hidden === !s.states, `?scene=${s.id}: shows the switch only on a scene with states`);
  const claims = [...doc.querySelectorAll("#scene-claims .claim")];
  check(claims.length === (s.claims || []).length && claims.every((c) => c.querySelector(".tag") && c.querySelector("a.source[href^='https://']")), `?scene=${s.id}: every claim shows its tag and links its source`);
  check(doc.querySelectorAll("#scene-chapters a.chapter-link").length === (s.chapters || []).length, `?scene=${s.id}: links its chapters`);
  const trail = [...doc.querySelectorAll("#trail a, #trail .here")].map((e) => e.textContent);
  // A scene opened from one state of its parent shows that state's title in the trail.
  let chain = [], at = s;
  while (at) {
    const child = chain.length ? chain[0].scene : null;
    const o = child && (at.objects || []).find((x) => x.opens && x.opens.scene === child.id);
    const st = o && o.state && (at.states || []).find((x) => x.id === o.state);
    chain.unshift({ scene: at, title: (st && st.title) || at.title });
    at = at.parent ? scenes.get(at.parent) : null;
  }
  chain = chain.map((c) => c.title);
  check(JSON.stringify(trail) === JSON.stringify(chain), `?scene=${s.id}: the trail shows where you are`);
});

section("zoom, cards, words, keys", () => {
  const win = page("https://explore.projectcampus.org/");
  const doc = win.document;
  const app = win.CampusScenes.start(data, { doc, win });
  check(app.state.scene.id === data.start, "start: opens the start scene");
  check(doc.getElementById("master-doc-link").href === MASTER, "the footer links to the master doc");

  // Into a building, a room, a screen; out with Escape.
  doc.querySelector('#frame [data-object="building"]').dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
  check(app.state.scene.id === "building" && /scene=building/.test(win.location.search), "zoom: an object opens its scene and the address follows");
  const lab = doc.querySelector('#frame [data-object="lab"]');
  lab.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  check(app.state.scene.id === "lab", "zoom: Enter on a focused object opens it");
  key(win, "Escape");
  check(app.state.scene.id === "building", "back: Escape goes up one scene");
  doc.querySelector("#trail a").dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
  check(app.state.scene.id === data.start, "trail: a step in the trail goes back there");

  // A card unfolds in place, with its claims and sources.
  doc.querySelector('#labels .label[data-object="rings"]').click();
  const card = doc.getElementById("card");
  check(!card.hidden && card.dataset.card === "rings", "card: a label opens its object's card");
  const cl = [...card.querySelectorAll(".claim")];
  check(cl.length === cards.get("rings").claims.length && cl.every((c) => c.querySelector(".tag") && c.querySelector("a.source[href^='https://']")), "card: shows each claim's tag and source");
  check(card.querySelector("a.chapter-link").href === `${MASTER}intranet.html`, "card: links its chapter");
  key(win, "Escape");
  check(card.hidden && app.state.scene.id === data.start, "card: Escape closes the card before leaving the scene");

  // Sources point at the master doc's rows.
  check(win.CampusScenes.sourceLink({ ref: "D-170" }, MASTER).href === `${MASTER}decisions.html#d-170`, "source: a decision links its register row");
  check(win.CampusScenes.sourceLink({ ref: "E-009" }, MASTER).href === `${MASTER}evidence.html#e-009`, "source: evidence links the evidence register");

  // Words: one key, one button, the same everywhere (D-171).
  const btn = doc.getElementById("words-btn");
  check(!doc.body.classList.contains("no-words") && btn.getAttribute("aria-pressed") === "true", "words: on by default");
  key(win, "w");
  check(doc.body.classList.contains("no-words") && btn.getAttribute("aria-pressed") === "false" && /words=off/.test(win.location.search), "words: W turns them off and the address says so");
  btn.click();
  check(!doc.body.classList.contains("no-words"), "words: the button turns them back on");

  // A path, stepped with a clicker.
  const path = data.paths[0].scenes;
  key(win, "ArrowRight");
  check(app.state.scene.id === path[1], "path: next goes to the path's next scene");
  key(win, "PageUp");
  check(app.state.scene.id === path[0], "path: a clicker's back goes to the previous scene");

  key(win, "b");
  check(!doc.getElementById("blank").hidden, "presenter: B blanks the screen");
  key(win, "ArrowRight");
  check(doc.getElementById("blank").hidden && app.state.scene.id === path[0], "presenter: any key brings the screen back without moving");
});

section("states: today and with CAMPUS", () => {
  const win = page("https://explore.projectcampus.org/?scene=elsewhere&path=places");
  const doc = win.document;
  const app = win.CampusScenes.start(data, { doc, win });
  const sc = scenes.get("elsewhere"), later = sc.states[1];
  const title = () => doc.getElementById("scene-title").textContent;
  const label = (id) => doc.querySelector(`#labels .label[data-object="${id}"]`);
  check(app.state.view === "today" && title() === sc.title && doc.getElementById("frame").dataset.state === "today", "states: a scene opens in its first state");
  check(doc.getElementById("made-up").textContent === win.CampusScenes.MADE_UP.composite, "states: today says it is a composite (D-148)");
  const btns = [...doc.querySelectorAll("#states .state-btn")];
  check(btns.length === 2 && btns[0].getAttribute("aria-pressed") === "true", "states: the switch shows both states, the first pressed");
  key(win, "s");
  check(app.state.view === "campus" && title() === later.title && /state=campus/.test(win.location.search), "states: S switches to with CAMPUS and the address says so");
  check(doc.getElementById("made-up").textContent === win.CampusScenes.MADE_UP.layout, "states: each state says what is made up in it");
  check(doc.querySelectorAll("#scene-claims .claim").length === later.claims.length, "states: each state shows its own claims");
  check(label("feed").hidden && !label("org-place").hidden, "states: objects show only in their own state");
  const post = doc.querySelector("#frame .post");
  check(!!post && /translate\(/.test(post.style.transform), "states: a post moves to its place");
  check(doc.querySelector('#frame [data-show="today"]').classList.contains("state-off"), "states: what belongs to today is hidden with CAMPUS");
  btns[0].click();
  check(app.state.view === "today" && !/state=/.test(win.location.search) && post.style.transform === "", "states: the switch goes back to today");

  // A presenter's next steps through the states before the next scene.
  key(win, "ArrowRight");
  check(app.state.scene.id === "elsewhere" && app.state.view === "campus", "path: next first switches a scene's state");
  label("org-place").click();
  check(app.state.scene.id === "a-place", "states: an object of a state opens its scene");
  const trail = [...doc.querySelectorAll("#trail a")].map((a) => a.textContent);
  check(trail[1] === later.title && /state=campus/.test(doc.querySelectorAll("#trail a")[1].getAttribute("href")), "trail: a scene opened from a state shows that state");
  key(win, "Escape");
  check(app.state.scene.id === "elsewhere" && app.state.view === "campus", "back: going up returns to the state it was opened from");
  key(win, "ArrowLeft");
  check(app.state.view === "today", "path: back steps through the states too");
  key(win, "ArrowLeft");
  check(app.state.scene.id === "campus", "path: back from a scene's first state goes to the previous scene");
  key(win, "ArrowRight");
  check(app.state.scene.id === "elsewhere" && app.state.view === "today", "path: next arrives in a scene's first state");
});

section("about this scene, as a pop-up", () => {
  const win = page("https://explore.projectcampus.org/?scene=building");
  const doc = win.document;
  const app = win.CampusScenes.start(data, { doc, win });
  const about = doc.getElementById("caption"), btn = doc.getElementById("about-btn");
  check(about.hidden && btn.getAttribute("aria-expanded") === "false", "about: the scene shows alone at first");
  const arr = doc.getElementById("arrival");
  check(!arr.hidden && doc.getElementById("arrival-title").textContent === scenes.get("building").title, "arrival: the title shows briefly on arrival");
  btn.click();
  check(!about.hidden && doc.getElementById("scene-title").textContent === scenes.get("building").title, "about: the button opens the title, summary, and sources");
  doc.querySelector('#labels .label[data-object="ap"]').click();
  check(about.hidden && !doc.getElementById("card").hidden, "about: a card replaces it, so one pop-up shows at a time");
  key(win, "Escape");
  key(win, "i");
  check(!about.hidden, "about: I opens it");
  key(win, "Escape");
  check(about.hidden && app.state.scene.id === "building", "about: Escape closes it before leaving the scene");
});

section("navigation, out of the way", () => {
  const win = page("https://explore.projectcampus.org/?scene=lab");
  const doc = win.document;
  win.CampusScenes.start(data, { doc, win });
  const zone = doc.getElementById("navzone"), btn = doc.getElementById("menu-btn");
  check(!!zone && zone.contains(doc.getElementById("trail")) && !zone.classList.contains("open"), "nav: the bar waits at the top, closed");
  btn.click();
  check(zone.classList.contains("open") && btn.getAttribute("aria-expanded") === "true", "nav: the small button shows it on a phone");
  btn.click();
  check(!zone.classList.contains("open"), "nav: and hides it again");
  key(win, "w");
  check(!zone.classList.contains("open") && doc.body.classList.contains("no-words"), "nav: W hides the words and the navigation");
  key(win, "w");
  check(zone.classList.contains("open") && !doc.body.classList.contains("no-words"), "nav: W again shows both");
});

section("?state=", () => {
  const win = page("https://explore.projectcampus.org/?scene=elsewhere&state=campus");
  const doc = win.document;
  const app = win.CampusScenes.start(data, { doc, win });
  check(app.state.view === "campus" && doc.getElementById("scene-title").textContent === scenes.get("elsewhere").states[1].title, "?state=: a visit can start in a state");
  const win2 = page("https://explore.projectcampus.org/?scene=elsewhere&state=nowhere");
  const app2 = win2.CampusScenes.start(data, { doc: win2.document, win: win2 });
  check(app2.state.view === "today", "?state=: an unknown state falls back to the first");
});

section("?words=off", () => {
  const win = page("https://explore.projectcampus.org/?scene=screen&words=off");
  const doc = win.document;
  win.CampusScenes.start(data, { doc, win });
  check(doc.body.classList.contains("no-words"), "?words=off: starts with the words hidden");
  check(doc.getElementById("arrival").hidden, "?words=off: no title on arrival, for presenting");
  check(!doc.getElementById("made-up").hidden, "?words=off: the made-up label still shows (D-171)");
  check(doc.body.textContent.includes(NOTICE), "?words=off: the notice still shows");
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
