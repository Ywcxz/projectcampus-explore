/* ============================================================
   Project CAMPUS Scenes — the engine (D-152, D-170, D-171)
   Renders data/scenes.json with the drawings in js/art.js: one
   scene at a time, objects that open a deeper scene (with a zoom)
   or a card, a words layer shown or hidden as one, paths a
   presenter steps through, and addresses like ?scene=lab.
   It stores nothing and sends nothing (D-148).
   ============================================================ */
(function (root) {
  "use strict";

  var MADE_UP = {
    layout: "Drawn layout: not the campus to scale",
    illustration: "Illustration: not a real building or room",
    mockup: "Mock-up: made-up content, not a real app",
    sample: "Sample: not an official VSU notice",
    composite: "Composite: not a real post",
    "later-module": "Later module: not part of the network's first version"
  };
  var ZOOM_MS = 620;

  function make(doc, tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* Where a source points in the master doc: a register row, a chapter, or an official page. */
  function sourceLink(src, base) {
    if (!src) return null;
    if (src.ref) {
      var page = /^[EP]-/.test(src.ref) ? "evidence.html" : "decisions.html";
      return { href: base + page + "#" + src.ref.toLowerCase(), label: src.ref };
    }
    if (src.chapter) return { href: base + src.chapter + ".html", label: src.label || src.chapter };
    if (src.href) return { href: src.href, label: src.label };
    return null;
  }

  function start(data, opts) {
    var doc = opts.doc, win = opts.win, art = opts.art || win.CampusArt || {};
    var base = data.site.masterDoc;
    var scenes = {}, cards = {};
    data.scenes.forEach(function (s) { scenes[s.id] = s; });
    (data.cards || []).forEach(function (c) { cards[c.id] = c; });

    var params = new win.URLSearchParams(win.location.search);
    var path = (data.paths || []).filter(function (p) { return p.id === params.get("path"); })[0] || (data.paths || [])[0] || null;
    var state = { scene: null, words: params.get("words") !== "off", busy: false, card: null, path: path };

    var $ = function (id) { return doc.getElementById(id); };
    var frame = $("frame"), labels = $("labels"), madeUp = $("made-up"), trail = $("trail");
    var title = $("scene-title"), summary = $("scene-summary"), claimList = $("scene-claims"), chapters = $("scene-chapters");
    var card = $("card"), wordsBtn = $("words-btn"), backBtn = $("back-btn"), blank = $("blank");
    var masterLink = $("master-doc-link");
    if (masterLink) masterLink.href = base;

    function reduced() {
      return !!(win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }

    /* ---------- claims and chapter links, on a scene or a card ---------- */
    function claimItem(c) {
      var li = make(doc, "li", "claim");
      li.appendChild(make(doc, "span", "tag tag-" + String(c.tag).toLowerCase(), c.tag));
      li.appendChild(doc.createTextNode(" " + c.text + " "));
      var s = sourceLink(c.source, base);
      if (s) {
        var a = make(doc, "a", "source", s.label);
        a.href = s.href;
        li.appendChild(a);
      } else {
        li.appendChild(make(doc, "span", "source-missing", "Source to come"));
      }
      return li;
    }
    function chapterLink(ch) {
      var a = make(doc, "a", "chapter-link", "Read " + ch.label + " →");
      a.href = base + ch.chapter + ".html";
      return a;
    }

    /* ---------- the words layer (D-171) ---------- */
    function setWords(on) {
      state.words = !!on;
      doc.body.classList.toggle("no-words", !state.words);
      if (wordsBtn) {
        wordsBtn.setAttribute("aria-pressed", String(state.words));
        wordsBtn.textContent = state.words ? "Words on" : "Words off";
      }
      writeAddress(false);
    }

    /* ---------- the address: ?scene=, ?path=, ?words=off ---------- */
    function writeAddress(push) {
      if (!win.history || !state.scene) return;
      var q = new win.URLSearchParams();
      if (state.scene.id !== data.start) q.set("scene", state.scene.id);
      if (state.path && params.get("path")) q.set("path", state.path.id);
      if (!state.words) q.set("words", "off");
      var url = win.location.pathname + (q.toString() ? "?" + q.toString() : "");
      try {
        if (push) win.history.pushState({ scene: state.scene.id }, "", url);
        else win.history.replaceState({ scene: state.scene.id }, "", url);
      } catch (e) { /* a file:// page may refuse; the visit goes on */ }
    }

    /* ---------- a card unfolds in place ---------- */
    function openCard(id, from) {
      var c = cards[id];
      if (!c) return;
      state.card = { id: id, from: from };
      clear(card);
      var close = make(doc, "button", "card-close", "Close");
      close.type = "button";
      close.setAttribute("aria-label", "Close this card");
      close.addEventListener("click", function () { closeCard(); });
      card.appendChild(close);
      card.appendChild(make(doc, "h2", "card-title", c.title));
      card.appendChild(make(doc, "p", "card-text", c.text));
      var ul = make(doc, "ul", "claims");
      (c.claims || []).forEach(function (cl) { ul.appendChild(claimItem(cl)); });
      card.appendChild(ul);
      if (c.chapter) card.appendChild(chapterLink(c.chapter));
      card.hidden = false;
      card.dataset.card = id;
      close.focus();
    }
    function closeCard() {
      if (!state.card) return;
      var from = state.card.from;
      state.card = null;
      card.hidden = true;
      if (from && from.focus) from.focus();
    }

    /* ---------- one scene ---------- */
    function ancestors(s) {
      var out = [];
      while (s) { out.unshift(s); s = s.parent ? scenes[s.parent] : null; }
      return out;
    }
    function objectOpening(scene, childId) {
      return (scene.objects || []).filter(function (o) { return o.opens && o.opens.scene === childId; })[0];
    }

    function drawing(scene) {
      var make_ = art[scene.art];
      if (typeof make_ !== "function") return null;
      var parsed = new win.DOMParser().parseFromString(make_(), "image/svg+xml").documentElement;
      if (!parsed || parsed.nodeName !== "svg") return null;
      return doc.importNode(parsed, true);
    }

    function render(scene) {
      state.scene = scene;
      clear(frame);
      clear(labels);
      closeCard();
      var svg = drawing(scene);
      if (svg) frame.appendChild(svg);
      else frame.appendChild(make(doc, "p", "placeholder", "Picture to come."));
      frame.dataset.scene = scene.id;

      (scene.objects || []).forEach(function (o) {
        var g = svg && svg.querySelector('[data-object="' + o.id + '"]');
        if (!g) return;
        var open = function () { openObject(o, g); };
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", o.label);
        g.addEventListener("click", open);
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); open(); }
        });
        // Its label, on the words layer, and a dot that stays when words are off.
        var b = make(doc, "button", "label" + (o.opens && o.opens.scene ? " goes-deeper" : ""));
        b.type = "button";
        b.tabIndex = -1;
        b.setAttribute("aria-hidden", "true");
        b.dataset.object = o.id;
        b.appendChild(make(doc, "span", "dot"));
        b.appendChild(make(doc, "span", "text", o.label));
        b.style.left = (Number(g.getAttribute("data-lx")) / 16) + "%";
        b.style.top = (Number(g.getAttribute("data-ly")) / 10) + "%";
        b.addEventListener("click", open);
        labels.appendChild(b);
      });

      // The words: title, summary, sources, chapters.
      title.textContent = scene.title;
      summary.textContent = scene.summary;
      clear(claimList);
      (scene.claims || []).forEach(function (c) { claimList.appendChild(claimItem(c)); });
      clear(chapters);
      (scene.chapters || []).forEach(function (ch) { chapters.appendChild(chapterLink(ch)); });

      // What is made up says so, words on or off (D-148, D-171).
      madeUp.textContent = scene.madeUp ? MADE_UP[scene.madeUp] || "" : "";
      madeUp.hidden = !scene.madeUp;

      // Where you are.
      clear(trail);
      var chain = ancestors(scene);
      chain.forEach(function (s, n) {
        if (n) trail.appendChild(make(doc, "span", "sep", "›"));
        if (s === scene) {
          var here = make(doc, "span", "here", s.title);
          here.setAttribute("aria-current", "page");
          trail.appendChild(here);
        } else {
          var a = make(doc, "a", null, s.title);
          a.href = "?scene=" + s.id;
          a.addEventListener("click", function (e) { e.preventDefault(); go(s.id, true); });
          trail.appendChild(a);
        }
      });
      if (backBtn) backBtn.hidden = !scene.parent;
      doc.title = scene.title + " · Project CAMPUS";
      return svg;
    }

    /* ---------- moving between scenes, with a zoom ---------- */
    function camera(svg, target) {
      var fr = frame.getBoundingClientRect(), r = target.getBoundingClientRect();
      if (!fr.width || !r.width || !r.height) return null;
      var s = Math.min(fr.width / r.width, fr.height / r.height) * 0.7;
      s = Math.max(1.8, Math.min(s, 8));
      var cx = r.left + r.width / 2 - fr.left, cy = r.top + r.height / 2 - fr.top;
      return { origin: cx + "px " + cy + "px", transform: "translate(" + (fr.width / 2 - cx) + "px," + (fr.height / 2 - cy) + "px) scale(" + s + ")" };
    }
    function arrive() {
      frame.classList.remove("arrive");
      void frame.offsetWidth;
      frame.classList.add("arrive");
    }

    function go(id, push, opts) {
      var next = scenes[id];
      if (!next || state.busy) return;
      var cur = state.scene;
      if (cur === next) return;
      opts = opts || {};
      var still = opts.instant || reduced();

      // Into a child: zoom on the object that opens it.
      var inObj = cur && objectOpening(cur, next.id);
      var inEl = inObj && frame.querySelector('[data-object="' + inObj.id + '"]');
      // Out to an ancestor: start zoomed on the way back in, then pull out.
      var chain = cur ? ancestors(cur) : [];
      var up = chain.indexOf(next) > -1 && next !== cur ? chain[chain.indexOf(next) + 1] : null;

      var svgNow = frame.querySelector("svg");
      var cam = !still && inEl && svgNow ? camera(svgNow, inEl) : null;
      if (cam) {
        state.busy = true;
        doc.body.classList.add("moving");
        svgNow.style.transformOrigin = cam.origin;
        svgNow.classList.add("zoom-in");
        void svgNow.getBoundingClientRect();
        svgNow.style.transform = cam.transform;
        win.setTimeout(function () { finish(next, push, null); }, ZOOM_MS);
      } else {
        finish(next, push, still ? null : up);
      }
    }
    function finish(next, push, from) {
      var svg = render(next);
      writeAddress(push);
      var obj = from && objectOpening(next, from.id);
      var el = obj && svg && svg.querySelector('[data-object="' + obj.id + '"]');
      var cam = el ? camera(svg, el) : null;
      if (cam) {
        svg.classList.add("zoom-set");
        svg.style.transformOrigin = cam.origin;
        svg.style.transform = cam.transform;
        void svg.getBoundingClientRect();
        svg.classList.remove("zoom-set");
        svg.classList.add("zoom-out");
        svg.style.transform = "";
        state.busy = true;
        doc.body.classList.add("moving");
        win.setTimeout(function () { state.busy = false; doc.body.classList.remove("moving"); if (el.focus) el.focus(); }, ZOOM_MS);
      } else {
        arrive();
        state.busy = false;
        doc.body.classList.remove("moving");
      }
    }

    function openObject(o, el) {
      if (state.busy) return;
      if (o.opens && o.opens.scene) go(o.opens.scene, true);
      else if (o.opens && o.opens.card) openCard(o.opens.card, el);
    }
    function upOne() {
      if (state.scene && state.scene.parent) go(state.scene.parent, true);
    }
    function step(d) {
      if (!state.path) return;
      var list = state.path.scenes, i = list.indexOf(state.scene.id);
      var j = i < 0 ? 0 : i + d;
      if (j >= 0 && j < list.length) go(list[j], true);
    }

    /* ---------- keys: words, back, a presenter's clicker ---------- */
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (blank && !blank.hidden) { blank.hidden = true; e.preventDefault(); return; }
      var k = e.key;
      if (k === "w" || k === "W") { setWords(!state.words); e.preventDefault(); }
      else if (k === "Escape") { if (state.card) closeCard(); else upOne(); }
      else if (k === "Backspace") { if (state.card) closeCard(); else upOne(); e.preventDefault(); }
      else if (k === "ArrowRight" || k === "PageDown" || k === " ") { step(1); e.preventDefault(); }
      else if (k === "ArrowLeft" || k === "PageUp") { step(-1); e.preventDefault(); }
      else if (k === "Home") { go(data.start, true); e.preventDefault(); }
      else if (k === "p" || k === "P") { doc.body.classList.toggle("presenting"); }
      else if ((k === "b" || k === "B" || k === ".") && blank) { blank.hidden = false; }
    }
    doc.addEventListener("keydown", onKey);
    if (wordsBtn) wordsBtn.addEventListener("click", function () { setWords(!state.words); });
    if (backBtn) backBtn.addEventListener("click", upOne);
    if (blank) blank.addEventListener("click", function () { blank.hidden = true; });
    win.addEventListener("popstate", function () {
      var q = new win.URLSearchParams(win.location.search);
      var id = q.get("scene") || data.start;
      if (scenes[id]) go(id, false);
    });

    setWords(state.words);
    var first = scenes[params.get("scene")] || scenes[data.start];
    render(first);
    arrive();
    writeAddress(false);

    return { state: state, go: go, up: upOne, step: step, setWords: setWords, openCard: openCard, closeCard: closeCard };
  }

  function boot() {
    var doc = root.document;
    var stage = doc.getElementById("frame");
    if (!stage) return;
    root.fetch("data/scenes.json")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { start(data, { doc: doc, win: root }); })
      .catch(function () {
        var p = doc.createElement("p");
        p.className = "placeholder";
        p.textContent = "The scenes could not load. Everything they draw on is in the master doc.";
        stage.appendChild(p);
      });
  }

  root.CampusScenes = { start: start, sourceLink: sourceLink, MADE_UP: MADE_UP };
  if (!root.CAMPUS_NO_BOOT) {
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})(window);
