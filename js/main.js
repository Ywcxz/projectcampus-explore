/* ============================================================
   Project CAMPUS Scenes — the engine (D-152, D-170, D-171)
   Renders data/scenes.json with the drawings in js/art.js: one
   scene at a time, objects that open a deeper scene (with a zoom)
   or a card, a scene's states switched in place (today, and with
   CAMPUS), a words layer shown or hidden as one, paths a presenter
   steps through, and addresses like ?scene=lab&state=campus.
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
  var ZOOM_MS = 500;

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
    var state = { scene: null, view: null, words: params.get("words") !== "off", busy: false, card: null, path: path };

    var $ = function (id) { return doc.getElementById(id); };
    var frame = $("frame"), labels = $("labels"), madeUp = $("made-up"), trail = $("trail");
    var title = $("scene-title"), summary = $("scene-summary"), claimList = $("scene-claims"), chapters = $("scene-chapters");
    var card = $("card"), wordsBtn = $("words-btn"), backBtn = $("back-btn"), switcher = $("states");
    
    // The scene's own zoom: the drawing's view box, never the page, so words keep their size.
    var zoom = { k: 1, cx: null, cy: null }, baseVB = null;
    var about = $("caption"), aboutBtn = $("about-btn"), aboutClose = $("about-close");
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
    function setWords(on, byUser) {
      state.words = !!on;
      // Pressing W (or the button) also shows or hides the navigation with the words.
      doc.body.classList.toggle("no-words", !state.words);
      if (wordsBtn) {
        wordsBtn.setAttribute("aria-pressed", String(state.words));
        wordsBtn.textContent = state.words ? "Labels on" : "Labels off";
      }
      writeAddress(false);
    }

    /* ---------- the address: ?scene=, ?path=, ?words=off ---------- */
    // ?present skips the notice for students, for presentations (D-176), and stays in the address.
    var present = params.has("present"), gate = $("gate"), gateOpen = false;
    function writeAddress(push) {
      if (!win.history || !state.scene) return;
      var q = new win.URLSearchParams();
      if (state.scene.id !== data.start) q.set("scene", state.scene.id);
      if (state.view && state.view !== firstState(state.scene)) q.set("state", state.view);
      if (state.path && params.get("path")) q.set("path", state.path.id);
      if (!state.words) q.set("words", "off");
      if (present) q.set("present", "");
      var url = win.location.pathname + (q.toString() ? "?" + q.toString().replace(/(^|&)present=(?=&|$)/, "$1present") : "");
      try {
        if (push) win.history.pushState({ scene: state.scene.id }, "", url);
        else win.history.replaceState({ scene: state.scene.id }, "", url);
      } catch (e) { /* a file:// page may refuse; the visit goes on */ }
    }

    /* ---------- a card unfolds in place ---------- */
    /* A pop-up fades out: a copy of it, with no ids or controls, fades where it was. */
    function fadeOut(el) {
      if (!el || el.hidden || reduced() || !el.parentNode) return;
      var ghost = el.cloneNode(true);
      ghost.removeAttribute("id");
      each(ghost.querySelectorAll("[id]"), function (n) { n.removeAttribute("id"); });
      ghost.setAttribute("aria-hidden", "true");
      ghost.classList.add("leaving");
      el.parentNode.insertBefore(ghost, el.nextSibling);
      win.setTimeout(function () { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 200);
    }

    /* ---------- about this scene: title, summary, sources, as a pop-up ---------- */
    function openAbout() {
      if (!about) return;
      closeCard();
      about.hidden = false;
      if (aboutBtn) aboutBtn.setAttribute("aria-expanded", "true");
      if (aboutClose) aboutClose.focus();
    }
    function closeAbout() {
      if (!about || about.hidden) return false;
      fadeOut(about);
      about.hidden = true;
      if (aboutBtn) aboutBtn.setAttribute("aria-expanded", "false");
      return true;
    }

    function openCard(id, from) {
      var c = cards[id];
      if (!c) return;
      closeAbout();
      state.card = { id: id, from: from };
      clear(card);
      var close = make(doc, "button", "card-close", "Close");
      close.type = "button";
      close.setAttribute("aria-label", "Close this card");
      close.addEventListener("click", function () { closeCard(); });
      card.appendChild(close);
      card.appendChild(make(doc, "h2", "card-title", c.title));
      card.appendChild(make(doc, "p", "card-text", c.text));
      // Its claims, with their tags and sources, folded under Sources (D-148).
      var det = make(doc, "details", "scene-sources"), ul = make(doc, "ul", "claims");
      det.appendChild(make(doc, "summary", null, "Sources"));
      (c.claims || []).forEach(function (cl) { ul.appendChild(claimItem(cl)); });
      det.appendChild(ul);
      card.appendChild(det);
      if (c.chapter) card.appendChild(chapterLink(c.chapter));
      card.hidden = false;
      card.dataset.card = id;
      close.focus();
    }
    function closeCard() {
      if (!state.card) return;
      var from = state.card.from;
      state.card = null;
      fadeOut(card);
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

    /* ---------- a scene's states, switched in place ----------
       A scene may have states, such as today and with CAMPUS. The first
       state uses the scene's own title, summary, claims, and made-up
       label; a later state may replace any of them. In the drawing,
       data-show="state" shows a piece only in that state, data-dim dims
       it, and a .mover with data-at-state="x y scale" moves there. */
    function statesOf(s) { return s && s.states && s.states.length ? s.states : null; }
    function firstState(s) { var st = statesOf(s); return st ? st[0].id : null; }
    function stateIndex(s, id) {
      var st = statesOf(s) || [];
      for (var n = 0; n < st.length; n++) if (st[n].id === id) return n;
      return -1;
    }
    function viewOf(s, id) {
      var st = statesOf(s);
      if (!st) return { id: null, title: s.title, summary: s.summary, claims: s.claims, madeUp: s.madeUp };
      var v = st[Math.max(0, stateIndex(s, id))];
      return {
        id: v.id,
        title: v.title || s.title,
        summary: v.summary || s.summary,
        claims: v.claims || s.claims,
        madeUp: v.madeUp !== undefined ? v.madeUp : s.madeUp
      };
    }
    function each(list, fn) { Array.prototype.forEach.call(list, fn); }
    function paint(svg, view, instant) {
      if (instant) svg.classList.add("still");
      each(svg.querySelectorAll("[data-show]"), function (el) {
        el.classList.toggle("state-off", el.getAttribute("data-show").split(" ").indexOf(view) < 0);
      });
      each(svg.querySelectorAll("[data-dim]"), function (el) {
        el.classList.toggle("state-dim", el.getAttribute("data-dim").split(" ").indexOf(view) > -1);
      });
      each(svg.querySelectorAll(".mover"), function (el) {
        var at = el.getAttribute("data-at-" + view), m = at ? at.split(" ").map(Number) : null;
        el.style.transform = m ? "translate(" + m[0] + "px," + m[1] + "px) scale(" + (m[2] || 1) + ")" : "";
      });
      // A delay holds only on the way into a state, so leaving one is quick.
      each(svg.querySelectorAll("[data-delay]"), function (el) {
        var show = el.getAttribute("data-show"), into = (show && show.split(" ").indexOf(view) > -1) || el.hasAttribute("data-at-" + view);
        el.style.transitionDelay = (instant || !into ? 0 : Number(el.getAttribute("data-delay")) || 0) + "ms";
      });
      if (instant) { void svg.getBoundingClientRect(); svg.classList.remove("still"); }
    }

    function drawing(scene) {
      var make_ = art[scene.art];
      if (typeof make_ !== "function") return null;
      var parsed = new win.DOMParser().parseFromString(make_(), "image/svg+xml").documentElement;
      if (!parsed || parsed.nodeName !== "svg") return null;
      return doc.importNode(parsed, true);
    }

    function render(scene, view) {
      state.scene = scene;
      state.view = statesOf(scene) ? (stateIndex(scene, view) > -1 ? view : firstState(scene)) : null;
      clear(frame);
      clear(labels);
      closeCard();
      closeAbout();
      var svg = drawing(scene);
      if (svg) frame.appendChild(svg);
      else frame.appendChild(make(doc, "p", "placeholder", "Picture to come."));
      frame.dataset.scene = scene.id;

      (scene.objects || []).forEach(function (o) {
        var g = svg && svg.querySelector('[data-object="' + o.id + '"]');
        if (!g) return;
        var open = function () { openObject(o, g); };
        // Its label names it while the cursor is over it, or it has focus.
        var show = function () { var lb = labels.querySelector('.label[data-object="' + o.id + '"]'); if (lb) lb.classList.add("show"); };
        var hide = function () { var lb = labels.querySelector('.label[data-object="' + o.id + '"]'); if (lb) lb.classList.remove("show"); };
        g.addEventListener("mouseenter", show);
        g.addEventListener("mouseleave", hide);
        g.addEventListener("focus", show);
        g.addEventListener("blur", hide);
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
        b.dataset.lx = g.getAttribute("data-lx");
        b.dataset.ly = g.getAttribute("data-ly");
        b.addEventListener("click", open);
        labels.appendChild(b);
      });

      if (backBtn) backBtn.hidden = !scene.parent;
      // The drawing widens (or deepens) to the screen's shape: its middle,
      // 1600 by 1000, always shows whole, and its backgrounds run on past it.
      // A new scene starts unzoomed.
      zoom.k = 1; zoom.cx = null; zoom.cy = null;
      fitView();
      // Walkers move by SVG animation, which stops for those who ask for less motion.
      if (svg && reduced() && svg.pauseAnimations) svg.pauseAnimations();
      placeLabels();
      showView(true);
      return svg;
    }

    function fitView() {
      var svg = frame.querySelector("svg"), r = frame.getBoundingClientRect();
      if (!svg || !r.width || !r.height) return;
      var a = r.width / r.height, vb;
      if (a >= 1.6) { var w = Math.min(1000 * a, 4000); vb = [-(w - 1600) / 2, 0, w, 1000]; }
      else { var h = Math.min(1600 / a, 3000); vb = [0, -(h - 1000) / 2, 1600, h]; }
      baseVB = vb.map(function (n) { return Math.round(n); });
      applyZoom();
    }

    /* ---------- zoom: Ctrl and the wheel, Ctrl + and -, a pinch; drag to move ---------- */
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function applyZoom() {
      var svg = frame.querySelector("svg");
      if (!svg || !baseVB) return;
      var w = baseVB[2] / zoom.k, h = baseVB[3] / zoom.k;
      var cx = zoom.cx === null ? baseVB[0] + baseVB[2] / 2 : zoom.cx;
      var cy = zoom.cy === null ? baseVB[1] + baseVB[3] / 2 : zoom.cy;
      zoom.cx = clamp(cx, baseVB[0] + w / 2, baseVB[0] + baseVB[2] - w / 2);
      zoom.cy = clamp(cy, baseVB[1] + h / 2, baseVB[1] + baseVB[3] - h / 2);
      svg.setAttribute("viewBox", [zoom.cx - w / 2, zoom.cy - h / 2, w, h].map(function (n) { return Math.round(n * 10) / 10; }).join(" "));
      frame.classList.toggle("zoomed", zoom.k > 1.001);
      placeLabels();
    }
    function zoomAt(factor, x, y) {
      var r = frame.getBoundingClientRect();
      if (!baseVB || !r.width) return;
      var k2 = clamp(zoom.k * factor, 1, 5);
      var w = baseVB[2] / zoom.k, h = baseVB[3] / zoom.k;
      var fx = x === undefined ? 0.5 : clamp((x - r.left) / r.width, 0, 1), fy = y === undefined ? 0.5 : clamp((y - r.top) / r.height, 0, 1);
      // The point under the cursor stays under it.
      var px = zoom.cx - w / 2 + fx * w, py = zoom.cy - h / 2 + fy * h;
      var w2 = baseVB[2] / k2, h2 = baseVB[3] / k2;
      zoom.k = k2;
      zoom.cx = px - fx * w2 + w2 / 2;
      zoom.cy = py - fy * h2 + h2 / 2;
      applyZoom();
    }
    function resetZoom() { zoom.k = 1; zoom.cx = null; zoom.cy = null; applyZoom(); }
    function panBy(dx, dy) {
      var r = frame.getBoundingClientRect();
      if (!baseVB || !r.width || zoom.k <= 1.001) return;
      zoom.cx -= dx * (baseVB[2] / zoom.k) / r.width;
      zoom.cy -= dy * (baseVB[3] / zoom.k) / r.height;
      applyZoom();
    }
    // The browser's own zoom would grow the words with the scene; these take its place.
    win.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomAt(Math.exp(-clamp(e.deltaY, -60, 60) * 0.004), e.clientX, e.clientY);
    }, { passive: false });
    ["gesturestart", "gesturechange"].forEach(function (t) {
      // Safari's trackpad pinch.
      var last = 1;
      doc.addEventListener(t, function (e) {
        e.preventDefault();
        if (t === "gesturestart") last = 1;
        else { zoomAt(e.scale / last, e.clientX, e.clientY); last = e.scale; }
      }, { passive: false });
    });
    var ptrs = {}, pinch = null, drag = null, dragged = false;
    frame.addEventListener("pointerdown", function (e) {
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1 };
        drag = null;
      } else if (ids.length === 1 && zoom.k > 1.001 && (e.pointerType !== "mouse" || e.button === 0)) {
        drag = { x: e.clientX, y: e.clientY, moved: false };
      }
    });
    win.addEventListener("pointermove", function (e) {
      if (!ptrs[e.pointerId]) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (pinch && ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        zoomAt(d / pinch.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
        pinch.d = d;
        dragged = true;
      } else if (drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 6) return;
        drag.moved = true;
        dragged = true;
        frame.classList.add("dragging");
        panBy(dx, dy);
        drag.x = e.clientX;
        drag.y = e.clientY;
      }
    });
    function lift(e) {
      delete ptrs[e.pointerId];
      if (Object.keys(ptrs).length < 2) pinch = null;
      if (!Object.keys(ptrs).length) { drag = null; frame.classList.remove("dragging"); win.setTimeout(function () { dragged = false; }, 0); }
    }
    win.addEventListener("pointerup", lift);
    win.addEventListener("pointercancel", lift);
    // A drag is not a click on what it ends over.
    frame.addEventListener("click", function (e) { if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; } }, true);

    /* Labels sit on their points in the drawing, wherever the drawing is cut. */
    function placeLabels() {
      var svg = frame.querySelector("svg");
      var ctm = svg && svg.getScreenCTM && svg.getScreenCTM();
      var fr = frame.getBoundingClientRect();
      each(labels.querySelectorAll(".label"), function (b) {
        var x = Number(b.dataset.lx), y = Number(b.dataset.ly);
        if (ctm && fr.width) {
          var pt = svg.createSVGPoint();
          pt.x = x; pt.y = y;
          var p = pt.matrixTransform(ctm);
          b.style.left = (p.x - fr.left) + "px";
          b.style.top = (p.y - fr.top) + "px";
        } else {
          b.style.left = (x / 16) + "%";
          b.style.top = (y / 10) + "%";
        }
      });
    }
    win.addEventListener("resize", function () { if (!state.busy) { fitView(); placeLabels(); } });

    /* What a scene shows in its current state: the drawing, the objects
       that belong to it, the words, what is made up, and the trail. */
    function showView(instant) {
      var scene = state.scene, v = viewOf(scene, state.view);
      var svg = frame.querySelector("svg");
      if (state.view) frame.dataset.state = state.view;
      else delete frame.dataset.state;
      if (svg && state.view) paint(svg, state.view, instant);

      (scene.objects || []).forEach(function (o) {
        var on = !o.state || o.state === state.view;
        var g = svg && svg.querySelector('[data-object="' + o.id + '"]');
        if (g) {
          g.setAttribute("tabindex", on ? "0" : "-1");
          if (on) g.removeAttribute("aria-hidden");
          else g.setAttribute("aria-hidden", "true");
        }
        var b = labels.querySelector('.label[data-object="' + o.id + '"]');
        if (b) b.hidden = !on;
      });

      // The words: title, summary, sources, chapters.
      title.textContent = v.title;
      summary.textContent = v.summary;
      clear(claimList);
      (v.claims || []).forEach(function (c) { claimList.appendChild(claimItem(c)); });
      clear(chapters);
      (scene.chapters || []).forEach(function (ch) { chapters.appendChild(chapterLink(ch)); });

      // What is made up says so, words on or off (D-148, D-171).
      madeUp.textContent = v.madeUp ? MADE_UP[v.madeUp] || "" : "";
      madeUp.hidden = !v.madeUp;

      // The switch between states, shown only on a scene that has them.
      if (switcher) {
        clear(switcher);
        var st = statesOf(scene);
        switcher.hidden = !st;
        (st || []).forEach(function (x) {
          var btn = make(doc, "button", "state-btn", x.label);
          btn.type = "button";
          btn.dataset.state = x.id;
          btn.setAttribute("aria-pressed", String(x.id === state.view));
          btn.addEventListener("click", function () { setView(x.id); });
          switcher.appendChild(btn);
        });
      }

      // Where you are. A scene opened from one state shows that state's title.
      doc.title = v.title + " · Project CAMPUS";
    }

    function setView(id) {
      var scene = state.scene;
      if (!statesOf(scene) || stateIndex(scene, id) < 0 || id === state.view || state.busy) return;
      state.view = id;
      closeCard();
      showView(false);
      writeAddress(false);
    }

    /* ---------- moving between scenes, with a zoom ---------- */
    function camera(svg, target) {
      var fr = frame.getBoundingClientRect(), r = target.getBoundingClientRect();
      if (!fr.width || !r.width || !r.height) return null;
      var s = Math.min(fr.width / r.width, fr.height / r.height) * 0.7;
      s = Math.max(1.4, Math.min(s, 2.4));
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
      // Out to an ancestor: start zoomed on the way back in, then pull out,
      // in the state the way back in belongs to.
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
        win.setTimeout(function () { finish(next, push, null, false, opts.view); }, ZOOM_MS);
      } else {
        finish(next, push, up, !still, opts.view);
      }
    }
    function finish(next, push, from, zoom, view) {
      var obj = from && objectOpening(next, from.id);
      if (view === "last") { var st = statesOf(next); view = st ? st[st.length - 1].id : null; }
      if (!view && obj && obj.state) view = obj.state;
      var svg = render(next, view);
      writeAddress(push);
      var el = zoom && obj && svg && svg.querySelector('[data-object="' + obj.id + '"]');
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
      if (state.busy || (o.state && o.state !== state.view)) return;
      if (o.opens && o.opens.scene) go(o.opens.scene, true);
      else if (o.opens && o.opens.card) openCard(o.opens.card, el);
    }
    function upOne() {
      if (state.scene && state.scene.parent) go(state.scene.parent, true);
    }
    /* A presenter's next steps through a scene's states before moving on. */
    function step(d) {
      var st = statesOf(state.scene);
      if (st) {
        var k = stateIndex(state.scene, state.view) + d;
        if (k >= 0 && k < st.length) { setView(st[k].id); return; }
      }
      if (!state.path) return;
      var list = state.path.scenes, i = list.indexOf(state.scene.id);
      var j = i < 0 ? 0 : i + d;
      if (j >= 0 && j < list.length) go(list[j], true, d < 0 ? { view: "last" } : null);
    }

    /* Esc leaves only the scene: it closes any pop-up. */
    function minimal() {
      closeCard();
      closeAbout();
    }

    /* ---------- keys: Esc, the arrows, Home ---------- */
    function onKey(e) {
      if (gateOpen) return;
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        // The browser's zoom keys zoom the scene instead.
        if (e.key === "+" || e.key === "=") { zoomAt(1.25); e.preventDefault(); }
        else if (e.key === "-" || e.key === "_") { zoomAt(0.8); e.preventDefault(); }
        else if (e.key === "0") { resetZoom(); e.preventDefault(); }
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (k === "Escape") { minimal(); }
      else if (k === "ArrowRight" || k === "PageDown" || k === " ") { step(1); e.preventDefault(); }
      else if (k === "ArrowLeft" || k === "PageUp") { step(-1); e.preventDefault(); }
      else if (k === "Home") { go(data.start, true); e.preventDefault(); }
    }
    doc.addEventListener("keydown", onKey);
    if (wordsBtn) wordsBtn.addEventListener("click", function () { setWords(!state.words); });
    if (backBtn) backBtn.addEventListener("click", upOne);
    if (aboutBtn) aboutBtn.addEventListener("click", function () { if (about.hidden) openAbout(); else closeAbout(); });
    if (aboutClose) aboutClose.addEventListener("click", function () { closeAbout(); if (aboutBtn) aboutBtn.focus(); });
    win.addEventListener("popstate", function () {
      var q = new win.URLSearchParams(win.location.search);
      var id = q.get("scene") || data.start;
      if (!scenes[id]) return;
      if (state.scene && state.scene.id === id) setView(q.get("state") || firstState(state.scene));
      else go(id, false, { view: q.get("state") });
    });

    // The notice for students: shown on every visit without ?present, since the site remembers nothing (D-148).
    var gn = (data.site || {}).studentNotice;
    if (gate && gn && !present) {
      $("gate-t").textContent = gn.title;
      $("gate-text").textContent = gn.text;
      $("gate-go").textContent = gn.go;
      $("gate-leave").textContent = gn.leave;
      $("gate-leave").href = gn.leaveHref;
      // The survey is linked only once it opens (D-114): the owner sets surveyOpen then.
      if (gn.surveyOpen && $("gate-survey")) { $("gate-survey").textContent = gn.survey; $("gate-survey").href = gn.surveyHref; $("gate-survey").hidden = false; $("gate-go").classList.remove("go"); }
      gate.hidden = false;
      gateOpen = true;
      $("gate-go").addEventListener("click", function () { gate.hidden = true; gateOpen = false; });
      win.setTimeout(function () { $("gate-go").focus(); }, 0);
    }
    setWords(state.words);
    var first = scenes[params.get("scene")] || scenes[data.start];
    render(first, params.get("state"));
    arrive();
    writeAddress(false);

    return { state: state, zoom: zoom, zoomAt: zoomAt, resetZoom: resetZoom, openAbout: openAbout, closeAbout: closeAbout, go: go, up: upOne, step: step, setView: setView, setWords: setWords, openCard: openCard, closeCard: closeCard };
  }

  function boot() {
    var doc = root.document;
    var stage = doc.getElementById("frame");
    if (!stage) return;
    // The words load with the same cache key as the script, so a new version is never stale.
    var me = doc.querySelector('script[src*="js/main.js"]'), v = me && /\?v=([^&]+)/.exec(me.getAttribute("src"));
    root.fetch("data/scenes.json" + (v ? "?v=" + v[1] : ""))
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
