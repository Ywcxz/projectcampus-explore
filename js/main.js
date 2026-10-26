/* Project CAMPUS: the documentary site's engine.

   Renders a story file (data/story.json, or data/demo.json with ?demo).
   Chapters hold topics, topics hold parts, and every topic reads at three
   depths (D-147). Every claim shows its tag and source, and made-up
   content carries its label wherever it appears (D-148).

   The site collects nothing: no storage, cookies, forms, or requests
   beyond its own files. The tests check that this file never names a
   web address; the master doc's address lives in the story file. */
(function () {
  "use strict";

  const TAGS = ["Established", "Proposed", "Unresolved"];
  const DEPTHS = ["glance", "explain", "evidence"];
  const DEPTH_NAMES = { glance: "Glance", explain: "Explain", evidence: "Evidence" };
  const PART_KINDS = { example: "Example", mockup: "Mock-up", card: "Card", door: "Go deeper" };

  // Labels for made-up content, shown on the part itself (D-108, D-148, D-102).
  const MADE_UP = {
    composite: "Composite: not a real post",
    sample: "Sample: not an official VSU notice",
    mockup: "Mock-up on made-up data",
    "later-module": "Mock-up of a later module, not part of the network's first version",
    demo: "Demo: shows how the site works, not part of the story",
  };

  const PLACEHOLDER = {
    chapter: "This chapter is not scripted yet.",
    line: "Line to come.",
    narration: "Narration to come.",
    visual: "Picture to come",
    status: "Not yet written.",
    result: "Not yet collected.",
  };

  /* ---------- small helpers ---------- */

  function el(doc, tag, attrs, ...children) {
    const node = doc.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value === null || value === undefined || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      node.append(typeof child === "string" ? doc.createTextNode(child) : child);
    }
    return node;
  }

  function sourceHref(source, site) {
    if (!source) return null;
    if (source.href) return source.href;
    if (source.ref) {
      const page = /^[EP]-/.test(source.ref) ? "evidence.html" : "decisions.html";
      return `${site.masterDoc}${page}#${source.ref.toLowerCase()}`;
    }
    if (source.chapter) {
      return `${site.masterDoc}${source.chapter}.html${source.section ? "#" + source.section : ""}`;
    }
    return null;
  }

  function sourceLink(doc, source, site) {
    const href = sourceHref(source, site);
    if (!href) return el(doc, "span", { class: "source source-missing", text: "Source to be added" });
    return el(doc, "a", { class: "source", href, text: source.label || source.ref || "Source" });
  }

  /* ---------- claims and pictures ---------- */

  function renderClaim(doc, claim, site) {
    const tag = TAGS.includes(claim.tag) ? claim.tag : "Unresolved";
    return el(doc, "p", { class: "claim" },
      claim.text ? claim.text + " " : el(doc, "span", { class: "placeholder-inline", text: PLACEHOLDER.status + " " }),
      el(doc, "span", { class: `tag tag-${tag.toLowerCase()}`, text: tag }),
      " ",
      sourceLink(doc, claim.source, site));
  }

  function renderVisual(doc, visual) {
    const alt = (visual && visual.alt) || "";
    if (visual && visual.src) {
      return el(doc, "figure", { class: "visual" },
        el(doc, "img", { src: visual.src, alt, loading: "lazy", decoding: "async" }));
    }
    return el(doc, "figure", { class: "visual visual-placeholder" },
      el(doc, "figcaption", {}, el(doc, "strong", { text: PLACEHOLDER.visual }), alt ? `: ${alt}` : ""));
  }

  function madeUpLabel(doc, madeUp) {
    return madeUp && MADE_UP[madeUp] ? el(doc, "p", { class: "made-up", text: MADE_UP[madeUp] }) : null;
  }

  /* ---------- parts, topics, chapters ---------- */

  function renderPart(doc, part, topic, site) {
    const kind = PART_KINDS[part.kind] ? part.kind : "example";
    const item = el(doc, "li", { class: `part part-${kind} reveal`, id: `p-${part.id}`, "data-part": part.id });

    if (kind === "door") {
      item.append(el(doc, "button", {
        type: "button", class: "door", id: `door-${part.id}`,
        "aria-expanded": "false", "aria-controls": `t-${part.to}`, "data-door": part.to,
      }, el(doc, "span", { class: "part-kind", text: PART_KINDS.door }), part.title || "A deeper topic"));
      return item;
    }

    const bodyId = `pb-${part.id}`;
    const body = el(doc, "div", { class: "part-body", id: bodyId, hidden: true },
      madeUpLabel(doc, part.madeUp),
      el(doc, "p", { class: part.narration ? "narration" : "narration placeholder-inline", text: part.narration || PLACEHOLDER.narration }),
      kind === "card" ? null : renderVisual(doc, part.visual),
      kind === "card" && part.source ? el(doc, "p", { class: "card-link" }, sourceLink(doc, part.source, site)) : null,
      (part.claims || []).map((c) => renderClaim(doc, c, site)));

    item.append(
      el(doc, "button", { type: "button", class: "part-toggle", "aria-expanded": "false", "aria-controls": bodyId },
        el(doc, "span", { class: "part-kind", text: PART_KINDS[kind] }), part.title || "Untitled part"),
      body);
    return item;
  }

  function topicClaims(topic) {
    return [...(topic.claims || []), ...(topic.parts || []).flatMap((p) => p.claims || [])];
  }

  function renderTopic(doc, topic, site, depth, deeper) {
    const article = el(doc, "article", {
      class: deeper ? "topic topic-deeper" : "topic",
      id: `t-${topic.id}`, "data-topic": topic.id, "data-depth": depth,
      hidden: deeper ? true : null, "aria-labelledby": `th-${topic.id}`,
    });

    const switcher = el(doc, "div", { class: "depth", role: "group", "aria-label": "How deep to read" },
      DEPTHS.map((d) => el(doc, "button", {
        type: "button", class: "depth-btn", "data-depth": d, "aria-pressed": String(d === depth), text: DEPTH_NAMES[d],
      })));

    const glance = topic.glance || {};
    const claims = topicClaims(topic);

    article.append(
      el(doc, "header", { class: "topic-head" },
        el(doc, "h3", { id: `th-${topic.id}`, text: topic.title || "Untitled topic" }), switcher),
      el(doc, "div", { class: "glance reveal" },
        madeUpLabel(doc, topic.madeUp),
        el(doc, "p", { class: glance.line ? "glance-line" : "glance-line placeholder-inline", text: glance.line || PLACEHOLDER.line }),
        renderVisual(doc, glance.visual)),
      el(doc, "ol", { class: "parts" }, (topic.parts || []).map((p) => renderPart(doc, p, topic, site))),
      el(doc, "section", { class: "evidence", "aria-label": "Evidence" },
        el(doc, "h4", { text: "Evidence" }),
        claims.length ? claims.map((c) => renderClaim(doc, c, site)) : el(doc, "p", { class: "placeholder", text: PLACEHOLDER.status }),
        (topic.sources || []).length
          ? el(doc, "p", { class: "sources" }, "In the master doc: ", joinLinks(doc, topic.sources, site))
          : null));

    if (deeper) {
      article.append(el(doc, "button", { type: "button", class: "btn back-to-path", "data-back": topic.id, text: "Back to the story" }));
    }
    return article;
  }

  function joinLinks(doc, sources, site) {
    const out = [];
    sources.forEach((s, i) => {
      if (i) out.push(", ");
      out.push(sourceLink(doc, s, site));
    });
    return out;
  }

  function renderStatus(doc, status, site) {
    const column = (cls, heading, items, render) => el(doc, "div", { class: `status-col ${cls}` },
      el(doc, "h4", { text: heading }),
      items && items.length ? items.map(render) : el(doc, "p", { class: "placeholder", text: PLACEHOLDER.status }));

    return el(doc, "aside", { class: "status-strip reveal", "aria-label": "Where this stands" },
      column("status-know", "What we know", status.know, (c) => renderClaim(doc, c, site)),
      column("status-think", "What we think", status.think, (c) => renderClaim(doc, c, site)),
      column("status-find", "How we'll find out", status.findOut, (f) => el(doc, "div", { class: "find-out" },
        el(doc, "p", { text: f.text || PLACEHOLDER.status }),
        f.method ? el(doc, "p", { class: "find-meta" }, el(doc, "strong", { text: "Test: " }), f.method) : null,
        f.bar ? el(doc, "p", { class: "find-meta" }, el(doc, "strong", { text: "Bar: " }), f.bar) : null,
        el(doc, "p", { class: f.result ? "find-result" : "find-result placeholder-inline" },
          el(doc, "strong", { text: "Result: " }), f.result || PLACEHOLDER.result))));
  }

  function renderChapter(doc, chapter, site, path, onPath) {
    const depth = DEPTHS.includes(path.depth) ? path.depth : "explain";
    const section = el(doc, "section", {
      class: onPath ? "chapter" : "chapter off-path",
      id: `ch-${chapter.id}`, "data-chapter": chapter.id, "data-number": String(chapter.number),
      "aria-labelledby": `ch-h-${chapter.id}`,
    });

    section.append(el(doc, "header", { class: "chapter-head reveal" },
      el(doc, "p", { class: "chapter-num", text: `Chapter ${chapter.number}` }),
      el(doc, "h2", { id: `ch-h-${chapter.id}`, text: chapter.title })));

    const topics = chapter.topics || [];
    if (!topics.length) section.append(el(doc, "p", { class: "placeholder chapter-placeholder", text: PLACEHOLDER.chapter }));
    topics.forEach((t) => section.append(renderTopic(doc, t, site, depth, false)));

    const deeper = chapter.deeper || [];
    if (deeper.length) {
      section.append(el(doc, "div", { class: "doors" }, deeper.map((t) => renderTopic(doc, t, site, depth, true))));
    }
    if (chapter.status) section.append(renderStatus(doc, chapter.status, site));
    if ((chapter.sources || []).length) {
      section.append(el(doc, "p", { class: "sources chapter-sources" }, "In the master doc: ", joinLinks(doc, chapter.sources, site)));
    }
    return section;
  }

  /* ---------- the whole story ---------- */

  function pickPath(data, id) {
    const paths = data.paths || [];
    return paths.find((p) => p.id === id) || paths.find((p) => p.id === data.defaultPath) || paths[0] ||
      { id: "all", label: "Every chapter", chapters: (data.chapters || []).map((c) => c.id) };
  }

  function render(data, doc, opts) {
    const options = opts || {};
    const site = data.site || {};
    const path = pickPath(data, options.path);
    const byId = new Map((data.chapters || []).map((c) => [c.id, c]));
    const onPath = path.chapters.filter((id) => byId.has(id));
    const offPath = (data.chapters || []).filter((c) => !onPath.includes(c.id));

    const story = doc.getElementById("story");
    story.replaceChildren();
    story.setAttribute("data-path", path.id);
    onPath.forEach((id) => story.append(renderChapter(doc, byId.get(id), site, path, true)));
    if (offPath.length) {
      story.append(el(doc, "h2", { class: "off-path-heading", text: "Other chapters" }));
      offPath.forEach((c) => story.append(renderChapter(doc, c, site, path, false)));
    }

    // Doors this path opens by default.
    for (const id of path.openDoors || []) setDoor(doc, id, true);

    const menuChapters = doc.getElementById("menu-chapters");
    if (menuChapters) {
      menuChapters.replaceChildren(...(data.chapters || []).map((c) => el(doc, "li", { class: onPath.includes(c.id) ? "on-path" : "off-path" },
        el(doc, "a", { href: `#ch-${c.id}`, "data-chapter": c.id }, el(doc, "span", { class: "menu-num", text: String(c.number) }), c.title))));
    }
    const menuPaths = doc.getElementById("menu-paths");
    if (menuPaths) {
      menuPaths.replaceChildren(...(data.paths || []).map((p) => el(doc, "li", {},
        el(doc, "a", { href: `?path=${encodeURIComponent(p.id)}${options.demo ? "&demo" : ""}`, "aria-current": p.id === path.id ? "true" : null, text: p.label }))));
    }
    const masterLink = doc.getElementById("master-doc-link");
    if (masterLink && site.masterDoc) masterLink.href = site.masterDoc;
    if (site.title) doc.title = path.id === data.defaultPath ? site.title : `${site.title}: ${path.label}`;
    return path;
  }

  /* ---------- opening parts and doors ---------- */

  function setPart(doc, partId, open) {
    const item = doc.getElementById(`p-${partId}`);
    const toggle = item && item.querySelector(".part-toggle");
    const body = item && item.querySelector(".part-body");
    if (!toggle || !body) return false;
    toggle.setAttribute("aria-expanded", String(open));
    body.hidden = !open;
    item.classList.toggle("is-open", open);
    return true;
  }

  function setDoor(doc, topicId, open) {
    const topic = doc.getElementById(`t-${topicId}`);
    if (!topic) return null;
    topic.hidden = !open;
    doc.querySelectorAll(`[data-door="${topicId}"]`).forEach((b) => b.setAttribute("aria-expanded", String(open)));
    return topic;
  }

  function setDepth(topic, depth) {
    if (!topic || !DEPTHS.includes(depth)) return;
    topic.setAttribute("data-depth", depth);
    topic.querySelectorAll(":scope > .topic-head .depth-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.depth === depth)));
  }

  function show(win, node) {
    if (!node || typeof node.scrollIntoView !== "function") return;
    const reduced = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
  }

  /* ---------- presenter mode ----------
     Steps through the path one chapter, topic, and part at a time. A door
     or an off-path chapter is entered as a side trip; leaving it returns
     to the same place on the main path. */

  function Presenter(doc, win) {
    const state = { on: false, steps: [], i: 0, trips: [], opened: new Set() };
    const bar = doc.getElementById("presenter-bar");
    const blank = doc.getElementById("blank-screen");
    const toggle = doc.getElementById("present-toggle");

    function stepsFor(nodes) {
      const steps = [];
      for (const node of nodes) {
        if (node.matches(".chapter")) {
          steps.push({ type: "chapter", node, chapter: node });
          node.querySelectorAll(":scope > .topic").forEach((t) => steps.push(...topicSteps(t, node)));
        } else if (node.matches(".topic")) {
          steps.push(...topicSteps(node, node.closest(".chapter")));
        }
      }
      return steps;
    }

    function topicSteps(topic, chapter) {
      const steps = [{ type: "topic", node: topic, chapter }];
      topic.querySelectorAll(":scope > .parts > .part").forEach((p) => steps.push({
        type: p.classList.contains("part-door") ? "door" : "part", node: p, chapter, topic,
      }));
      return steps;
    }

    function mainSteps() {
      return stepsFor([...doc.querySelectorAll("#story > .chapter:not(.off-path)")]);
    }

    function current() { return state.steps[state.i]; }

    function apply() {
      const step = current();
      if (!step) return;
      doc.querySelectorAll(".step-current").forEach((n) => n.classList.remove("step-current"));
      doc.querySelectorAll(".chapter.is-current").forEach((n) => n.classList.remove("is-current"));
      step.chapter && step.chapter.classList.add("is-current");
      step.node.classList.add("step-current", "in-view");
      if (step.topic) step.topic.classList.add("in-view");
      if (step.type === "topic" && step.node.getAttribute("data-depth") === "glance") setDepth(step.node, "explain");
      if (step.type === "part" && !step.node.classList.contains("is-open")) {
        setPart(doc, step.node.dataset.part, true);
        state.opened.add(step.node);
      }
      show(win, step.node);
      if (win.history && win.history.replaceState && step.chapter) {
        win.history.replaceState(null, "", `${win.location.search}#${step.chapter.id}`);
      }
      updateBar();
    }

    function updateBar() {
      if (!bar) return;
      const step = current();
      const title = step && step.chapter ? step.chapter.querySelector(".chapter-head h2").textContent : "";
      const trip = state.trips.length ? " · Side trip (Backspace returns)" : "";
      const door = step && step.type === "door" ? " · Enter opens this door" : "";
      bar.textContent = `${title} · ${state.i + 1} of ${state.steps.length}${trip}${door}`;
    }

    function go(i) {
      if (i < 0) return;
      if (i >= state.steps.length) {
        if (state.trips.length) return back(true);
        return;
      }
      // Stepping back past a part that stepping opened closes it again.
      if (i < state.i) {
        for (let k = state.i; k > i; k--) {
          const s = state.steps[k];
          if (s.type === "part" && state.opened.has(s.node)) {
            setPart(doc, s.node.dataset.part, false);
            state.opened.delete(s.node);
          }
        }
      }
      state.i = i;
      apply();
    }

    function enter(nodes) {
      const steps = stepsFor(nodes);
      if (!steps.length) return;
      state.trips.push({ steps: state.steps, i: state.i });
      state.steps = steps;
      state.i = 0;
      apply();
    }

    function back(advance) {
      const trip = state.trips.pop();
      if (!trip) return;
      state.steps = trip.steps;
      state.i = trip.i;
      if (advance && state.i < state.steps.length - 1) state.i += 1;
      apply();
    }

    function openDoor() {
      const step = current();
      if (!step || step.type !== "door") return;
      const button = step.node.querySelector(".door");
      const topic = setDoor(doc, button.dataset.door, true);
      if (topic) enter([topic]);
    }

    // ] goes to the next chapter's start; [ goes to this chapter's start,
    // or to the previous chapter's if already there.
    function jumpChapter(dir) {
      const starts = state.steps.map((s, k) => (s.type === "chapter" ? k : -1)).filter((k) => k >= 0);
      if (dir > 0) {
        const next = starts.find((k) => k > state.i);
        if (next !== undefined) go(next);
        else if (state.trips.length) back(true);
        return;
      }
      const before = starts.filter((k) => k < state.i);
      if (before.length) go(before[before.length - 1]);
      else if (state.trips.length) back(false);
    }

    function goToChapter(id) {
      const k = state.steps.findIndex((s) => s.type === "chapter" && s.node.id === `ch-${id}`);
      if (k >= 0) return go(k);
      const section = doc.getElementById(`ch-${id}`);
      if (section) enter([section]);
    }

    function setBlank(on) {
      if (!blank) return;
      blank.hidden = !on;
    }

    function start() {
      if (state.on) return;
      state.on = true;
      state.steps = mainSteps();
      state.trips = [];
      state.opened.clear();
      const hash = (win.location.hash || "").slice(1);
      const k = hash ? state.steps.findIndex((s) => s.node.id === hash) : -1;
      state.i = k >= 0 ? k : 0;
      doc.body.classList.add("presenting");
      if (bar) bar.hidden = false;
      if (toggle) toggle.setAttribute("aria-pressed", "true");
      apply();
    }

    function stop() {
      if (!state.on) return;
      const step = current();
      state.on = false;
      setBlank(false);
      doc.body.classList.remove("presenting");
      doc.querySelectorAll(".step-current").forEach((n) => n.classList.remove("step-current"));
      doc.querySelectorAll(".chapter.is-current").forEach((n) => n.classList.remove("is-current"));
      if (bar) bar.hidden = true;
      if (toggle) toggle.setAttribute("aria-pressed", "false");
      if (step) show(win, step.node);
    }

    function onKey(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key;
      if (!state.on) {
        if (key === "p" || key === "P") { event.preventDefault(); start(); }
        return;
      }
      const blanked = blank && !blank.hidden;
      const handled = {
        ArrowRight: () => go(state.i + 1), ArrowDown: () => go(state.i + 1), PageDown: () => go(state.i + 1), " ": () => go(state.i + 1),
        ArrowLeft: () => go(state.i - 1), ArrowUp: () => go(state.i - 1), PageUp: () => go(state.i - 1),
        Enter: openDoor,
        Backspace: () => back(false),
        "]": () => jumpChapter(1),
        "[": () => jumpChapter(-1),
        Home: () => go(0),
        End: () => go(state.steps.length - 1),
        b: () => setBlank(!blanked), B: () => setBlank(!blanked), ".": () => setBlank(!blanked),
        Escape: stop, p: stop, P: stop,
      }[key];
      if (handled) {
        event.preventDefault();
        // While the screen is blank, any key but the blank keys brings it back first.
        if (blanked && !["b", "B", "."].includes(key)) { setBlank(false); return; }
        handled();
        return;
      }
      if (/^[0-9]$/.test(key)) {
        const chapter = doc.querySelector(`#story > .chapter[data-number="${key}"]`);
        if (chapter) { event.preventDefault(); goToChapter(chapter.dataset.chapter); }
      }
    }

    return { start, stop, onKey, goToChapter, get state() { return state; } };
  }

  /* ---------- wiring ---------- */

  function wire(doc, win, presenter) {
    doc.addEventListener("click", (event) => {
      const target = event.target.closest("button, a");
      if (!target) return;

      if (target.matches(".part-toggle")) {
        const item = target.closest(".part");
        setPart(doc, item.dataset.part, target.getAttribute("aria-expanded") !== "true");
      } else if (target.matches(".door")) {
        const open = target.getAttribute("aria-expanded") !== "true";
        const topic = setDoor(doc, target.dataset.door, open);
        if (open && topic) {
          topic.classList.add("in-view");
          show(win, topic);
          const heading = topic.querySelector("h3");
          if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
        }
      } else if (target.matches(".back-to-path")) {
        const door = doc.querySelector(`[data-door="${target.dataset.back}"]`);
        if (door) { show(win, door); door.focus({ preventScroll: true }); }
      } else if (target.matches(".depth-btn")) {
        setDepth(target.closest(".topic"), target.dataset.depth);
      } else if (target.id === "menu-toggle") {
        const menu = doc.getElementById("menu");
        const open = target.getAttribute("aria-expanded") !== "true";
        target.setAttribute("aria-expanded", String(open));
        menu.hidden = !open;
        // The menu sits just under the masthead, whose height changes as the notice wraps.
        const masthead = doc.querySelector(".masthead");
        if (open && masthead) menu.style.top = `${masthead.getBoundingClientRect().bottom}px`;
      } else if (target.id === "present-toggle") {
        presenter.state.on ? presenter.stop() : presenter.start();
      } else if (target.matches("#menu-chapters a")) {
        const menuToggle = doc.getElementById("menu-toggle");
        menuToggle.setAttribute("aria-expanded", "false");
        doc.getElementById("menu").hidden = true;
        if (presenter.state.on) {
          event.preventDefault();
          presenter.goToChapter(target.dataset.chapter);
        }
      }
    });

    doc.addEventListener("keydown", presenter.onKey);
  }

  // Pictures and parts ease in as they scroll into view; without
  // IntersectionObserver, or with reduced motion, they are simply shown.
  function reveal(doc, win) {
    const nodes = doc.querySelectorAll(".reveal");
    const reduced = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in win) || reduced) {
      nodes.forEach((n) => n.classList.add("in-view"));
      return;
    }
    doc.documentElement.classList.add("can-reveal");
    const observer = new win.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    nodes.forEach((n) => observer.observe(n));
  }

  function start(data, options) {
    const opts = options || {};
    const doc = opts.doc || document;
    const win = opts.win || window;
    render(data, doc, opts);
    const presenter = Presenter(doc, win);
    wire(doc, win, presenter);
    reveal(doc, win);
    const hash = (win.location.hash || "").slice(1);
    if (hash) show(win, doc.getElementById(hash));
    return { presenter };
  }

  function boot() {
    const params = new URLSearchParams(window.location.search);
    const demo = params.has("demo");
    fetch(demo ? "data/demo.json" : "data/story.json")
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((data) => start(data, { path: params.get("path"), demo }))
      .catch(() => {
        const story = document.getElementById("story");
        const link = document.getElementById("master-doc-link");
        story.replaceChildren(el(document, "p", { class: "placeholder" },
          "The story could not load. Everything it draws on is in the ",
          el(document, "a", { href: link ? link.href : "./", text: "master doc" }), "."));
      });
  }

  window.CampusStory = { render, start, setPart, setDoor, setDepth, MADE_UP, TAGS, PART_KINDS, DEPTHS };
  if (!window.CAMPUS_NO_BOOT) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})();
