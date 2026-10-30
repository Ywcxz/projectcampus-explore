/* ============================================================
   Project CAMPUS Scenes — the drawings (D-170)
   Each scene is one SVG, 1600 by 1000, in flat paper layers like
   VSUrvey's (D-167): .lay.l1 is farthest and .lay.l4 nearest, and
   the engine slides them in at different speeds. Objects a visitor
   can open are <g class="obj" data-object="id"> with a label point
   (data-lx, data-ly) in the drawing's own units. Drawings carry no
   words of their own, except inside a labeled mock-up (D-171).
   Places are kinds of place, never a named building (D-153).
   ============================================================ */
(function (root) {
  "use strict";

  /* ---------- palette: the landing page's and VSUrvey's ---------- */
  var K = {
    paper: "#F3F4EE", paper2: "#EEF0E7", cream: "#F4E8C1", sand: "#EDE6CF",
    ink: "#1F2A22", ink2: "#52594C", ink3: "#8C9286", rule: "#D6D2C2",
    green: "#1F6B45", green2: "#2F7A52", green3: "#5E9A6E", green4: "#7DB38A", leaf: "#CADDBB", meadow: "#E3EBD6",
    gold: "#E2AE1C", gold2: "#E6B53A", gold3: "#F2DD8C",
    sea: "#17465A", sea2: "#2B7385", sky: "#B3D7DB", sky2: "#E3EEEF",
    red: "#C25B4A", brown: "#7A5C3A", white: "#FFFDF6"
  };
  var SKIN = ["#A0704F", "#C68B5E", "#7A4E33", "#D9A47C"];
  var HAIR = ["#1B1B22", "#3B2A20", "#24201C", "#5A3A26"];

  var DEFS = '<defs>' +
    '<filter id="paper" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#1F2A22" flood-opacity=".18"/></filter>' +
    '<filter id="soft" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#1F2A22" flood-opacity=".1"/></filter>' +
    '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>' +
    '<radialGradient id="gold-light" gradientUnits="userSpaceOnUse" cx="1376" cy="60" r="900"><stop offset="0" stop-color="#F2DD8C" stop-opacity=".75"/><stop offset="1" stop-color="#F2DD8C" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="green-light" gradientUnits="userSpaceOnUse" cx="80" cy="950" r="820"><stop offset="0" stop-color="#D5E6D3" stop-opacity=".9"/><stop offset="1" stop-color="#D5E6D3" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="grass" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#E3EBD6"/><stop offset="1" stop-color="#CADDBB"/></radialGradient>' +
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3EEEF"/><stop offset="1" stop-color="#F3F4EE"/></linearGradient>' +
    '<linearGradient id="screen-glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9F4EC"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>' +
    '</defs>';

  function svg(label, body, bg) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + label + '">' +
      DEFS + '<rect x="-1200" y="-1000" width="4000" height="3000" fill="' + (bg || K.paper) + '"/>' +
      '<rect x="-1200" y="-1000" width="4000" height="3000" fill="url(#green-light)"/><rect x="-1200" y="-1000" width="4000" height="3000" fill="url(#gold-light)"/>' +
      body + "</svg>";
  }
  function lay(n, body) { return '<g class="lay l' + n + '">' + body + "</g>"; }
  function piece(body) { return '<g filter="url(#paper)">' + body + "</g>"; }
  function obj(id, lx, ly, body) {
    return '<g class="obj" data-object="' + id + '" data-lx="' + Math.round(lx) + '" data-ly="' + Math.round(ly) + '">' + body + "</g>";
  }
  function f(n) { return (+n).toFixed(1); }
  /* An object or a piece with extra attributes, for a scene's states:
     data-show="state", data-dim="state", data-at-state="x y scale", data-delay. */
  function objX(id, lx, ly, attrs, body) {
    return '<g class="obj' + (/data-at-/.test(attrs) ? " mover" : "") + '" data-object="' + id + '" data-lx="' + Math.round(lx) + '" data-ly="' + Math.round(ly) + '" ' + attrs + ">" + body + "</g>";
  }
  function grp(attrs, body) {
    return '<g' + (/data-at-/.test(attrs) ? ' class="mover"' : "") + " " + attrs + ">" + body + "</g>";
  }

  /* ---------- 2.5D: an isometric projection and its pieces ---------- */
  var C30 = Math.cos(Math.PI / 6);
  function Iso(ox, oy, s) {
    var P = function (i, j, z) { return [ox + (i - j) * C30 * s, oy + (i + j) * 0.5 * s - (z || 0) * s]; };
    P.s = s;
    return P;
  }
  function pts(a) { return a.map(function (p) { return f(p[0]) + "," + f(p[1]); }).join(" "); }
  function poly(a, fill, extra) { return '<polygon points="' + pts(a) + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  /* A box from (i, j, z0) of w by d by h; c = [top, front-left, front-right, windows]. */
  function box(P, i, j, w, d, h, c, z0) {
    z0 = z0 || 0;
    var t = z0 + h, out = "";
    out += poly([P(i, j + d, z0), P(i + w, j + d, z0), P(i + w, j + d, t), P(i, j + d, t)], c[1]);
    out += poly([P(i + w, j, z0), P(i + w, j + d, z0), P(i + w, j + d, t), P(i + w, j, t)], c[2]);
    out += poly([P(i, j, t), P(i + w, j, t), P(i + w, j + d, t), P(i, j + d, t)], c[0]);
    if (c[3]) {
      var rows = h > 2.6 ? [0.2, 0.5, 0.8] : h > 1.6 ? [0.32, 0.68] : [0.5];
      for (var k = 0; k + 0.6 < w; k++) {
        rows.forEach(function (r) {
          var z = z0 + h * r;
          out += poly([P(i + k + 0.25, j + d, z + 0.18), P(i + k + 0.7, j + d, z + 0.18), P(i + k + 0.7, j + d, z - 0.18), P(i + k + 0.25, j + d, z - 0.18)], c[3]);
        });
      }
    }
    return out;
  }
  /* A building: a box with windows on both faces we see, floor by floor, and a door
     on the front face (j + d) that takes the place of one ground-floor window. */
  function bldg(P, i, j, w, d, h, c, doorCol) {
    var out = box(P, i, j, w, d, h, [c[0], c[1], c[2]]);
    var floors = Math.max(1, Math.round(h / 0.95)), fh = h / floors, wh = Math.min(0.2, fh * 0.22);
    var win = function (a) { return poly(a, c[3]); };
    for (var fl = 0; fl < floors; fl++) {
      var zc = fl * fh + fh * 0.55;
      for (var col = 0; col + 0.7 <= w; col++) {
        if (fl === 0 && col === doorCol) continue;
        out += win([P(i + col + 0.3, j + d, zc + wh), P(i + col + 0.75, j + d, zc + wh), P(i + col + 0.75, j + d, zc - wh), P(i + col + 0.3, j + d, zc - wh)]);
      }
      for (var row = 0; row + 0.7 <= d; row++) {
        out += win([P(i + w, j + row + 0.3, zc + wh), P(i + w, j + row + 0.75, zc + wh), P(i + w, j + row + 0.75, zc - wh), P(i + w, j + row + 0.3, zc - wh)]);
      }
    }
    if (doorCol != null) {
      var dh = Math.min(0.8, fh * 0.85);
      out += poly([P(i + doorCol + 0.25, j + d + 0.01, 0), P(i + doorCol + 0.8, j + d + 0.01, 0), P(i + doorCol + 0.8, j + d + 0.01, dh), P(i + doorCol + 0.25, j + d + 0.01, dh)], "#7A5C3A");
      out += poly([P(i + doorCol + 0.15, j + d + 0.01, dh + 0.06), P(i + doorCol + 0.9, j + d + 0.01, dh + 0.06), P(i + doorCol + 0.9, j + d + 0.01, dh), P(i + doorCol + 0.15, j + d + 0.01, dh)], c[3]);
    }
    return out;
  }
  function isoTree(P, i, j, k) {
    var p = P(i, j), r = (k || 1) * 11;
    return '<ellipse cx="' + f(p[0]) + '" cy="' + f(p[1] + 2) + '" rx="' + f(r * 0.85) + '" ry="' + f(r * 0.35) + '" fill="#1F2A22" opacity=".08"/>' +
      '<rect x="' + f(p[0] - 1.5) + '" y="' + f(p[1] - r * 1.3) + '" width="3" height="' + f(r * 1.3) + '" fill="' + K.brown + '"/>' +
      '<circle cx="' + f(p[0]) + '" cy="' + f(p[1] - r * 1.8) + '" r="' + f(r) + '" fill="' + K.green3 + '"/>' +
      '<circle cx="' + f(p[0] + r * 0.35) + '" cy="' + f(p[1] - r * 2.15) + '" r="' + f(r * 0.55) + '" fill="' + K.green4 + '"/>';
  }
  function isoPerson(P, i, j, n, z, phone) {
    var p = P(i, j, z || 0), k = P.s / 26;
    var shirt = [K.sea, K.red, K.gold, K.green2][n % 4];
    return '<g transform="translate(' + f(p[0]) + " " + f(p[1]) + ") scale(" + f(k) + ')">' +
      '<ellipse cy="2" rx="7" ry="3" fill="#1F2A22" opacity=".12"/>' +
      '<rect x="-5" y="-20" width="10" height="18" rx="4" fill="' + shirt + '"/>' +
      '<circle cy="-26" r="6" fill="' + SKIN[n % 4] + '"/><path d="M-6 -27a6 6 0 0 1 12 0Z" fill="' + HAIR[n % 4] + '"/>' +
      (phone ? '<rect x="4" y="-17" width="5" height="8" rx="1.2" fill="' + K.ink + '"/><rect x="5" y="-16" width="3" height="5.5" fill="' + K.gold3 + '"/>' : "") +
      "</g>";
  }
  function ring(P, r, stroke, dash, w, op) {
    var c = P(0, 0), rx = r * P.s * C30 * Math.SQRT2, ry = rx * Math.tan(Math.PI / 6);
    return '<ellipse cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="none" stroke="' + stroke + '" stroke-width="' + w + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : "") + ' opacity="' + op + '"/>';
  }
  /* Wi-Fi: a small access point with its signal, drawn at (x, y) and scale k. */
  function accessPoint(x, y, k, down) {
    k = k || 1;
    var arcs = "";
    [16, 28, 40].forEach(function (r, n) {
      var rr = r * k, dy = down ? 1 : -1;
      arcs += '<path class="signal s' + n + '" d="M' + f(x - rr * 0.7) + " " + f(y + dy * rr * 0.55) + " Q" + f(x) + " " + f(y + dy * rr * 1.15) + " " + f(x + rr * 0.7) + " " + f(y + dy * rr * 0.55) + '" fill="none" stroke="' + K.green2 + '" stroke-width="' + f(2.6 * k) + '" stroke-linecap="round" opacity="' + (0.8 - n * 0.2) + '"/>';
    });
    return arcs + '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(13 * k) + '" ry="' + f(7 * k) + '" fill="' + K.white + '" filter="url(#soft)"/>' +
      '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(2.4 * k) + '" fill="' + K.green2 + '"/>';
  }

  /* ---------- 2D: front-on paper people ---------- */
  /* A person seen from behind, seated, at (x, y) the shoulder line. */
  function backPerson(x, y, n, k) {
    k = k || 1;
    var sh = [K.sea, K.red, K.gold2, K.green2, "#6A5A8C"][n % 5];
    return piece('<path d="M' + f(x - 44 * k) + " " + f(y + 70 * k) + "C" + f(x - 44 * k) + " " + f(y + 10 * k) + " " + f(x - 30 * k) + " " + f(y) + " " + f(x) + " " + f(y) + "S" + f(x + 44 * k) + " " + f(y + 10 * k) + " " + f(x + 44 * k) + " " + f(y + 70 * k) + 'Z" fill="' + sh + '"/>' +
      '<rect x="' + f(x - 8 * k) + '" y="' + f(y - 14 * k) + '" width="' + f(16 * k) + '" height="' + f(18 * k) + '" fill="' + SKIN[n % 4] + '"/>' +
      '<circle cx="' + f(x) + '" cy="' + f(y - 34 * k) + '" r="' + f(26 * k) + '" fill="' + HAIR[n % 4] + '"/>' +
      '<ellipse cx="' + f(x - 26 * k) + '" cy="' + f(y - 30 * k) + '" rx="' + f(4 * k) + '" ry="' + f(6 * k) + '" fill="' + SKIN[n % 4] + '"/>' +
      '<ellipse cx="' + f(x + 26 * k) + '" cy="' + f(y - 30 * k) + '" rx="' + f(4 * k) + '" ry="' + f(6 * k) + '" fill="' + SKIN[n % 4] + '"/>');
  }
  /* A face: two eyes that blink and a small smile, on a head at (x, y) of radius r. */
  function face(x, y, r) {
    var e = r * 0.34;
    return '<g class="eyes"><ellipse cx="' + f(x - e) + '" cy="' + f(y) + '" rx="' + f(r * 0.09) + '" ry="' + f(r * 0.12) + '" fill="' + K.ink + '"/>' +
      '<ellipse cx="' + f(x + e) + '" cy="' + f(y) + '" rx="' + f(r * 0.09) + '" ry="' + f(r * 0.12) + '" fill="' + K.ink + '"/></g>' +
      '<path d="M' + f(x - r * 0.22) + " " + f(y + r * 0.32) + "q" + f(r * 0.22) + " " + f(r * 0.2) + " " + f(r * 0.44) + ' 0" fill="none" stroke="' + K.ink + '" stroke-width="' + f(r * 0.08) + '" stroke-linecap="round"/>';
  }
  function frontTree(x, y, k) {
    k = k || 1;
    return piece('<rect x="' + f(x - 6 * k) + '" y="' + f(y - 90 * k) + '" width="' + f(12 * k) + '" height="' + f(90 * k) + '" fill="' + K.brown + '"/>' +
      '<circle cx="' + f(x) + '" cy="' + f(y - 120 * k) + '" r="' + f(56 * k) + '" fill="' + K.green3 + '"/>' +
      '<circle cx="' + f(x + 26 * k) + '" cy="' + f(y - 146 * k) + '" r="' + f(30 * k) + '" fill="' + K.green4 + '"/>' +
      '<circle cx="' + f(x - 30 * k) + '" cy="' + f(y - 100 * k) + '" r="' + f(30 * k) + '" fill="#4F8A60"/>');
  }

  /* ---------- the network, as a labeled mock-up (D-102, D-108) ---------- */
  /* Text inside a mock-up is part of the picture: it stays when words are off (D-171).
     Every office and person in it is generic and made up. */
  function chip(x, y, text, fill, ink, w) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="15" fill="' + fill + '"/>' +
      '<text class="ui ui-chip" x="' + (x + w / 2) + '" y="' + (y + 20) + '" text-anchor="middle" fill="' + ink + '">' + text + "</text>";
  }
  function bars(x, y, ws, gap) {
    return ws.map(function (w, n) { return '<rect x="' + x + '" y="' + (y + n * (gap || 22)) + '" width="' + w + '" height="10" rx="5" fill="#E4E6DE"/>'; }).join("");
  }
  function sampleTag(x, y, w) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="6" fill="#F3DED8"/>' +
      '<text class="ui ui-chip" x="' + (x + 14) + '" y="' + (y + 20) + '" fill="#8A2B1E">Sample: not an official VSU notice</text>';
  }

  /* ---------- kinds of place, and the icons posts carry ---------- */
  var KIND = {
    office: { c: K.sea2, bg: "#E3EEEF" },
    service: { c: K.gold, bg: K.cream },
    building: { c: K.green3, bg: K.meadow },
    residence: { c: "#B9974F", bg: "#F6EEDA" },
    org: { c: K.red, bg: "#F3DED8" },
    interest: { c: "#6A5A8C", bg: "#ECE7F3" }
  };
  /* An icon drawn in a box about 60 across, centred on (x, y). No words. */
  function icon(kind, x, y, k) {
    k = k || 1;
    var g = '<g transform="translate(' + f(x) + " " + f(y) + ") scale(" + f(k) + ')">';
    if (kind === "medal") g += '<path d="M-14 -26L-2 2H-14L-22 -26ZM14 -26L2 2H14L22 -26Z" fill="' + K.sea2 + '"/><circle cy="10" r="16" fill="' + K.gold + '"/><circle cy="10" r="10" fill="' + K.gold3 + '"/>';
    else if (kind === "id") g += '<rect x="-26" y="-18" width="52" height="36" rx="6" fill="' + K.white + '" stroke="' + K.green2 + '" stroke-width="3"/><rect x="-20" y="-11" width="16" height="20" rx="3" fill="' + K.green4 + '"/><rect x="0" y="-9" width="20" height="5" rx="2.5" fill="#C9CFC2"/><rect x="0" y="0" width="14" height="5" rx="2.5" fill="#C9CFC2"/>';
    else if (kind === "map") g += '<path d="M-26 -16L-9 -22L9 -16L26 -22V18L9 24L-9 18L-26 24Z" fill="#DCD3EA"/><path d="M-9 -22V18M9 -16V24" stroke="#B9AED0" stroke-width="2"/><path d="M4 -6a10 10 0 1 1 0.1 0L4 14Z" transform="translate(-4 -6)" fill="' + KIND.interest.c + '"/><circle cx="0" cy="-12" r="4" fill="#fff"/>';
    else if (kind === "tap") g += '<rect x="-24" y="-20" width="30" height="12" rx="5" fill="#8C9286"/><rect x="0" y="-16" width="12" height="22" rx="4" fill="#8C9286"/><rect x="-14" y="-28" width="10" height="10" rx="2" fill="#6E7466"/><path d="M6 14q6 8 0 14q-6-6 0-14Z" fill="none" stroke="' + K.sea2 + '" stroke-width="2.5" stroke-dasharray="3 3"/><circle cx="20" cy="-14" r="9" fill="' + K.red + '"/><rect x="18.5" y="-20" width="3" height="8" rx="1.5" fill="#fff"/><circle cx="20" cy="-9" r="1.6" fill="#fff"/>';
    else if (kind === "megaphone") g += '<path d="M-20 -8H-6L18 -22V22L-6 8H-20Z" fill="' + K.red + '"/><rect x="-14" y="8" width="8" height="14" rx="3" fill="#A64A3B"/><path d="M24 -10q8 10 0 20" fill="none" stroke="' + K.red + '" stroke-width="3" stroke-linecap="round"/>';
    else if (kind === "storm") g += '<path d="M-22 6a12 12 0 0 1 4-22 16 16 0 0 1 30-2 11 11 0 0 1 8 24Z" fill="#8FA9B4"/><path d="M-2 8L-10 22H0L-6 34L10 16H0L6 8Z" fill="' + K.gold + '"/><path d="M-18 14l-4 10M16 14l-4 10" stroke="' + K.sea2 + '" stroke-width="3" stroke-linecap="round"/>';
    else if (kind === "pin") g += '<rect x="-20" y="-16" width="40" height="32" rx="4" fill="' + K.white + '" stroke="#C9CFC2" stroke-width="2"/><circle cy="-16" r="6" fill="' + K.red + '"/><rect x="-12" y="-4" width="24" height="4" rx="2" fill="#C9CFC2"/><rect x="-12" y="4" width="16" height="4" rx="2" fill="#C9CFC2"/>';
    else if (kind === "ask") g += '<rect x="-22" y="-20" width="44" height="34" rx="10" fill="' + K.sea2 + '"/><path d="M-6 14l6 10l6-10Z" fill="' + K.sea2 + '"/><path d="M-6 -8a6 6 0 1 1 9 5c-3 2-3 3-3 6" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="0" cy="9" r="2.3" fill="#fff"/>';
    else if (kind === "book") g += '<path d="M0 -14C-8 -20-18 -20-26 -16V20C-18 16-8 16 0 22C8 16 18 16 26 20V-16C18 -20 8 -20 0 -14Z" fill="' + K.green3 + '"/><path d="M0 -14V22" stroke="#fff" stroke-width="2.5"/>';
    else if (kind === "calendar") g += '<rect x="-22" y="-18" width="44" height="40" rx="6" fill="' + K.white + '" stroke="#C9CFC2" stroke-width="2"/><rect x="-22" y="-18" width="44" height="12" rx="6" fill="' + K.gold + '"/><rect x="-14" y="-24" width="5" height="10" rx="2" fill="' + K.ink2 + '"/><rect x="9" y="-24" width="5" height="10" rx="2" fill="' + K.ink2 + '"/><circle cx="-8" cy="4" r="3" fill="#C9CFC2"/><circle cx="2" cy="4" r="3" fill="#C9CFC2"/><circle cx="12" cy="4" r="3" fill="' + K.red + '"/><circle cx="-8" cy="13" r="3" fill="#C9CFC2"/>';
    return g + "</g>";
  }
  /* A post in a feed, 388 by 112, at (x, y): a poster, lines that stand for words, and an icon. */
  function post(x, y, n, ic, kind) {
    var av = [K.sea2, K.gold2, K.green3, K.red, "#6A5A8C", "#B9974F"][n % 6];
    return '<rect x="' + x + '" y="' + y + '" width="388" height="112" rx="14" fill="#FFFFFF" stroke="#D6D2C2" stroke-width="2"/>' +
      '<circle cx="' + (x + 30) + '" cy="' + (y + 30) + '" r="16" fill="' + av + '"/>' +
      '<rect x="' + (x + 56) + '" y="' + (y + 20) + '" width="' + (96 + (n * 17) % 40) + '" height="10" rx="5" fill="#B9BFB3"/>' +
      '<rect x="' + (x + 56) + '" y="' + (y + 37) + '" width="54" height="7" rx="3.5" fill="#E4E6DE"/>' +
      '<rect x="' + (x + 20) + '" y="' + (y + 62) + '" width="' + (230 - (n * 23) % 50) + '" height="9" rx="4.5" fill="#D9DCD2"/>' +
      '<rect x="' + (x + 20) + '" y="' + (y + 79) + '" width="' + (170 + (n * 31) % 60) + '" height="9" rx="4.5" fill="#E4E6DE"/>' +
      '<circle cx="' + (x + 26) + '" cy="' + (y + 100) + '" r="4" fill="#E4E6DE"/><circle cx="' + (x + 40) + '" cy="' + (y + 100) + '" r="4" fill="#E4E6DE"/><circle cx="' + (x + 54) + '" cy="' + (y + 100) + '" r="4" fill="#E4E6DE"/>' +
      '<rect x="' + (x + 296) + '" y="' + (y + 16) + '" width="76" height="80" rx="12" fill="' + KIND[kind].bg + '"/>' + icon(ic, x + 334, y + 56, 0.95);
  }
  /* A person standing, front on, feet at (x, base), scale k. */
  function standPerson(x, base, n, k, shirt) {
    var sk = SKIN[n % 4], hr = HAIR[n % 4], legs = "#2F3B5E";
    return piece(
      '<rect x="' + f(x - 30 * k) + '" y="' + f(base - 112 * k) + '" width="' + f(24 * k) + '" height="' + f(108 * k) + '" rx="' + f(10 * k) + '" fill="' + legs + '"/>' +
      '<rect x="' + f(x + 6 * k) + '" y="' + f(base - 112 * k) + '" width="' + f(24 * k) + '" height="' + f(108 * k) + '" rx="' + f(10 * k) + '" fill="' + legs + '"/>' +
      '<rect x="' + f(x - 36 * k) + '" y="' + f(base - 12 * k) + '" width="' + f(34 * k) + '" height="' + f(13 * k) + '" rx="' + f(6 * k) + '" fill="' + K.ink + '"/>' +
      '<rect x="' + f(x + 2 * k) + '" y="' + f(base - 12 * k) + '" width="' + f(34 * k) + '" height="' + f(13 * k) + '" rx="' + f(6 * k) + '" fill="' + K.ink + '"/>' +
      '<rect x="' + f(x - 62 * k) + '" y="' + f(base - 246 * k) + '" width="' + f(22 * k) + '" height="' + f(124 * k) + '" rx="' + f(11 * k) + '" fill="' + shirt + '"/>' +
      '<rect x="' + f(x + 40 * k) + '" y="' + f(base - 246 * k) + '" width="' + f(22 * k) + '" height="' + f(124 * k) + '" rx="' + f(11 * k) + '" fill="' + shirt + '"/>' +
      '<rect x="' + f(x - 46 * k) + '" y="' + f(base - 262 * k) + '" width="' + f(92 * k) + '" height="' + f(164 * k) + '" rx="' + f(38 * k) + '" fill="' + shirt + '"/>' +
      '<circle cx="' + f(x - 51 * k) + '" cy="' + f(base - 120 * k) + '" r="' + f(12 * k) + '" fill="' + sk + '"/>' +
      '<circle cx="' + f(x + 51 * k) + '" cy="' + f(base - 120 * k) + '" r="' + f(12 * k) + '" fill="' + sk + '"/>' +
      '<rect x="' + f(x - 11 * k) + '" y="' + f(base - 284 * k) + '" width="' + f(22 * k) + '" height="' + f(28 * k) + '" fill="' + sk + '"/>' +
      '<circle cx="' + f(x) + '" cy="' + f(base - 314 * k) + '" r="' + f(42 * k) + '" fill="' + sk + '"/>' +
      '<path d="M' + f(x - 42 * k) + " " + f(base - 318 * k) + "a" + f(42 * k) + " " + f(42 * k) + " 0 0 1 " + f(84 * k) + " " + f(-6 * k) + "c" + f(-18 * k) + " " + f(-24 * k) + " " + f(-62 * k) + " " + f(-28 * k) + " " + f(-84 * k) + " " + f(6 * k) + 'Z" fill="' + hr + '"/>') +
      face(x + 2 * k, base - 306 * k, 40 * k);
  }
  /* A place role, worn as a pin: key (steward), shield (moderator), star (peer guide), dot (member). */
  function badge(kind, x, y, k) {
    k = k || 1;
    var g = '<g transform="translate(' + f(x) + " " + f(y) + ") scale(" + f(k) + ')"><circle r="16" fill="' + K.white + '" filter="url(#soft)"/>';
    if (kind === "key") g += '<circle cx="-5" cy="0" r="5" fill="none" stroke="' + K.gold + '" stroke-width="3"/><path d="M0 0H10M7 0V5M10 0V4" stroke="' + K.gold + '" stroke-width="3" stroke-linecap="round"/>';
    else if (kind === "shield") g += '<path d="M0 -10L9 -6V1C9 6 5 9 0 11C-5 9-9 6-9 1V-6Z" fill="' + K.green2 + '"/>';
    else if (kind === "star") g += '<path d="M0 -10L3 -3L10 -3L4 2L6 9L0 5L-6 9L-4 2L-10 -3L-3 -3Z" fill="' + K.gold + '"/>';
    else g += '<circle r="6" fill="#B9BFB3"/>';
    return g + "</g>";
  }

  /* ============================================================
     Scene: the campus, one world with two layers (D-170)
     ============================================================ */
  /* A person at (x, y), drawn at scale k: the iso cast, reused across scenes. */
  function personAt(x, y, n, k, phone) {
    var shirt = [K.sea, K.red, K.gold, K.green2, "#6A5A8C", K.sea2][n % 6];
    return '<g transform="translate(' + f(x) + " " + f(y) + ") scale(" + f(k) + ')">' +
      '<ellipse cy="2" rx="7" ry="3" fill="#1F2A22" opacity=".12"/>' +
      '<rect x="-5" y="-20" width="10" height="18" rx="4" fill="' + shirt + '"/>' +
      '<circle cy="-26" r="6" fill="' + SKIN[n % 4] + '"/><path d="M-6 -27a6 6 0 0 1 12 0Z" fill="' + HAIR[(n + 1) % 4] + '"/>' +
      (phone ? '<rect x="4" y="-17" width="5" height="8" rx="1.2" fill="' + K.ink + '"/><rect class="glow-phone" x="5" y="-16" width="3" height="5.5" fill="' + K.gold3 + '"/>' : "") +
      "</g>";
  }
  /* Someone walking a path, back and forth, for dur seconds each way and back. */
  /* The campus cast: invented people, women and men, with their own skin, hair,
     clothes, and what they carry (D-146). All drawn at one size. */
  var CAST = [
    { skin: 1, hair: "#1B1B22", style: "long", top: K.red, low: "#2F3B5E", skirt: false, item: "bag" },
    { skin: 0, hair: "#24201C", style: "short", top: K.sea, low: "#3B3B44", skirt: false, item: "laptop" },
    { skin: 3, hair: "#3B2A20", style: "pony", top: K.gold2, low: "#2F3B5E", skirt: true, item: "book" },
    { skin: 2, hair: "#1B1B22", style: "short", top: K.green2, low: "#4A4A52", skirt: false, item: "phone" },
    { skin: 1, hair: "#5A3A26", style: "bun", top: "#6A5A8C", low: "#E8E2D0", skirt: true, item: "umbrella" },
    { skin: 0, hair: "#1B1B22", style: "long", top: K.sea2, low: "#2F3B5E", skirt: false, item: "phone" },
    { skin: 2, hair: "#24201C", style: "short", top: "#B9974F", low: "#3B3B44", skirt: false, item: "bag" },
    { skin: 3, hair: "#1B1B22", style: "pony", top: K.green3, low: "#2F3B5E", skirt: true, item: "bag" },
    { skin: 1, hair: "#3B2A20", style: "short", top: K.red, low: "#4A4A52", skirt: false, item: "book" },
    { skin: 0, hair: "#1B1B22", style: "bun", top: K.gold, low: "#2F3B5E", skirt: true, item: "phone" }
  ];
  /* One of the cast, feet at (x, y), at scale k. */
  function isoChar(x, y, n, k, legs, phoneEvery) {
    var c = CAST[n % CAST.length], sk = SKIN[c.skin], h = c.hair, out = "";
    var swing = function (side) { return legs ? legs(side) : ""; };
    out += '<ellipse cy="1.5" rx="7" ry="2.6" fill="#1F2A22" opacity=".13"/>';
    if (c.item === "bag") out += '<rect x="-8.5" y="-21" width="5" height="10" rx="2" fill="#5B4A3A"/>';
    if (c.style === "long") out += '<rect x="-6" y="-28" width="12" height="13" rx="4" fill="' + h + '"/>';
    if (c.skirt) out += '<rect x="-3.4" y="-8" width="2.6" height="8" rx="1.2" fill="' + sk + '">' + swing(1) + '</rect><rect x="0.8" y="-8" width="2.6" height="8" rx="1.2" fill="' + sk + '">' + swing(-1) + '</rect><path d="M-5 -12H5L6 -6H-6Z" fill="' + c.low + '"/>';
    else out += '<rect x="-4.2" y="-11" width="3.6" height="11" rx="1.5" fill="' + c.low + '">' + swing(1) + '</rect><rect x="0.6" y="-11" width="3.6" height="11" rx="1.5" fill="' + c.low + '">' + swing(-1) + '</rect>';
    out += '<rect x="-5" y="-21" width="10" height="11" rx="4" fill="' + c.top + '"/>';
    out += '<rect x="-7" y="-20" width="2.6" height="9" rx="1.3" fill="' + c.top + '"/><rect x="4.4" y="-20" width="2.6" height="9" rx="1.3" fill="' + c.top + '"/>';
    out += '<circle cx="-5.7" cy="-10.5" r="1.6" fill="' + sk + '"/><circle cx="5.7" cy="-10.5" r="1.6" fill="' + sk + '"/>';
    out += '<circle cy="-26" r="5.6" fill="' + sk + '"/><path d="M-5.7 -26.5a5.7 5.7 0 0 1 11.4 0c-3-2-8.4-2-11.4 0Z" fill="' + h + '"/>';
    if (c.style === "pony") out += '<ellipse cx="-6" cy="-25" rx="2.2" ry="3.6" fill="' + h + '"/>';
    if (c.style === "bun") out += '<circle cy="-32.5" r="2.6" fill="' + h + '"/>';
    if (c.item === "book") out += '<rect x="5" y="-15" width="4.5" height="6" rx="0.8" fill="' + K.red + '"/>';
    // Standing still, now and then: the phone comes out and lights up, then goes away.
    if (phoneEvery) out += '<g opacity="0"><animate attributeName="opacity" dur="' + phoneEvery + 's" repeatCount="indefinite" keyTimes="0;0.3;0.34;0.8;0.84;1" values="0;0;1;1;0;0"/>' +
      '<rect x="3.8" y="-19" width="4" height="6.5" rx="1" fill="' + K.ink + '"/><rect x="4.6" y="-18.2" width="2.4" height="4.6" fill="' + K.gold3 + '"/></g>';
    else if (c.item === "phone") out += '<rect x="3.8" y="-17" width="4" height="6.5" rx="1" fill="' + K.ink + '"/><rect class="glow-phone" x="4.6" y="-16.2" width="2.4" height="4.6" fill="' + K.gold3 + '"/>';
    if (c.item === "laptop") out += '<rect x="5" y="-12" width="9" height="2.4" rx="0.8" fill="#8C9286"/>';
    if (c.item === "umbrella") out += '<path d="M6 -10V-36" stroke="' + K.ink2 + '" stroke-width="1.2"/><path d="M-6 -35a12 7 0 0 1 24 0Z" fill="' + K.sea2 + '"/>';
    return '<g transform="translate(' + f(x) + " " + f(y) + ") scale(" + f(k) + ')">' + out + "</g>";
  }
  /* One of the cast walking a path and back, standing a while at each end.
     walk is seconds per way, rest seconds standing; the legs swing only
     while walking. Everything is SVG animation, paused for less motion. */
  function walker(path, n, k, walk, rest, begin) {
    var D = 2 * (walk + rest), a = walk / D, b = (walk + rest) / D, c = (2 * walk + rest) / D;
    var vals = [], times = [], t, STEP = 0.28;
    for (t = 0; t <= D + 1e-6; t += STEP) {
      var moving = t < walk || (t > walk + rest && t < 2 * walk + rest);
      vals.push(moving ? (Math.round(t / STEP) % 2 ? 1 : -1) : 0);
      times.push(Math.min(1, t / D));
    }
    times[times.length - 1] = 1;
    var legs = function (side) {
      return '<animateTransform attributeName="transform" type="rotate" dur="' + D + 's" begin="' + (begin || 0) + 's" repeatCount="indefinite" calcMode="linear" keyTimes="' +
        times.map(function (x) { return x.toFixed(4); }).join(";") + '" values="' + vals.map(function (v) { return (v * side * 22) + " " + (side > 0 ? -2.4 : 2.4) + " -11"; }).join(";") + '"/>';
    };
    return '<g class="walk">' + isoChar(0, 0, n, k, legs) +
      '<animateMotion dur="' + D + 's" begin="' + (begin || 0) + 's" repeatCount="indefinite" path="' + path + '" keyPoints="0;1;1;0;0" keyTimes="0;' + a.toFixed(4) + ";" + b.toFixed(4) + ";" + c.toFixed(4) + ';1" calcMode="linear"/></g>';
  }
  /* A journey: one of the cast walks through waypoints (i, j), stopping at some
     of them for a while, and fades in and out where the walk begins and ends,
     at the edge of campus or a door. stops[n] is the wait on reaching point n;
     talk lists the points where a speech bubble shows during the wait. After
     the last point the walker stays gone for gap seconds, so the loop is not
     seen to repeat. */
  function journey(P, n, k, way, speed, stops, talk, begin, gap) {
    var pts_ = way.map(function (q) { return P(q[0], q[1], q[2] || 0); });
    var lens = [0], total = 0;
    for (var m = 1; m < pts_.length; m++) {
      var dx = pts_[m][0] - pts_[m - 1][0], dy = pts_[m][1] - pts_[m - 1][1];
      total += Math.sqrt(dx * dx + dy * dy); lens.push(total);
    }
    // Events: [time, fraction of the path, moving?]
    var t = 0.6, ev = [[0, 0, false], [0.6, 0, false]], moving = [], waits = [];
    for (m = 1; m < pts_.length; m++) {
      var dur = (lens[m] - lens[m - 1]) / speed;
      moving.push([t, t + dur]); t += dur; ev.push([t, lens[m] / total]);
      var w = stops[m] || 0;
      if (w) { waits.push([m, t, t + w]); t += w; ev.push([t, lens[m] / total]); }
    }
    var end = t + 0.6, D = end + gap;
    ev.push([end, 1]); ev.push([D, 1]);
    var kt = ev.map(function (e) { return (e[0] / D).toFixed(4); }).join(";"), kp = ev.map(function (e) { return e[1].toFixed(4); }).join(";");
    var path = "M" + pts_.map(function (q) { return f(q[0]) + "," + f(q[1]); }).join(" L");
    var STEP = 0.28, vals = [], times = [];
    for (var s2 = 0; s2 <= D + 1e-6; s2 += STEP) {
      var mv = moving.some(function (r) { return s2 > r[0] && s2 < r[1]; });
      vals.push(mv ? (Math.round(s2 / STEP) % 2 ? 1 : -1) : 0); times.push(Math.min(1, s2 / D));
    }
    times[times.length - 1] = 1;
    var legs = function (side) {
      return '<animateTransform attributeName="transform" type="rotate" dur="' + f(D) + 's" begin="' + begin + 's" repeatCount="indefinite" calcMode="linear" keyTimes="' +
        times.map(function (x) { return x.toFixed(4); }).join(";") + '" values="' + vals.map(function (v) { return (v * side * 22) + " " + (side > 0 ? -2.4 : 2.4) + " -11"; }).join(";") + '"/>';
    };
    var fade = '<animate attributeName="opacity" dur="' + f(D) + 's" begin="' + begin + 's" repeatCount="indefinite" keyTimes="0;' + (0.6 / D).toFixed(4) + ";" + ((end - 0.6) / D).toFixed(4) + ";" + (end / D).toFixed(4) + ';1" values="0;1;1;0;0"/>';
    var out = '<g class="walk" opacity="0">' + fade + isoChar(0, 0, n, k, legs) +
      '<animateMotion dur="' + f(D) + 's" begin="' + begin + 's" repeatCount="indefinite" path="' + path + '" keyPoints="' + kp + '" keyTimes="' + kt + '" calcMode="linear"/></g>';
    waits.forEach(function (wt) {
      if (talk.indexOf(wt[0]) < 0) return;
      var q = pts_[wt[0]], a = (wt[1] / D).toFixed(4), b = (wt[2] / D).toFixed(4);
      out += '<g opacity="0"><animate attributeName="opacity" dur="' + f(D) + 's" begin="' + begin + 's" repeatCount="indefinite" keyTimes="0;' + a + ";" + (Math.min(wt[1] + 0.4, wt[2]) / D).toFixed(4) + ";" + (Math.max(wt[2] - 0.4, wt[1]) / D).toFixed(4) + ";" + b + ';1" values="0;0;1;1;0;0"/>' +
        '<rect x="' + f(q[0] - 2) + '" y="' + f(q[1] - 50 * k) + '" width="' + f(22 * k) + '" height="' + f(13 * k) + '" rx="' + f(5 * k) + '" fill="#FFFFFF" filter="url(#soft)"/>' +
        '<circle cx="' + f(q[0] + 4 * k) + '" cy="' + f(q[1] - 43.5 * k) + '" r="' + f(1.6 * k) + '" fill="' + K.ink3 + '"/><circle cx="' + f(q[0] + 9 * k) + '" cy="' + f(q[1] - 43.5 * k) + '" r="' + f(1.6 * k) + '" fill="' + K.ink3 + '"/><circle cx="' + f(q[0] + 14 * k) + '" cy="' + f(q[1] - 43.5 * k) + '" r="' + f(1.6 * k) + '" fill="' + K.ink3 + '"/></g>';
    });
    return out;
  }
  /* A balcony on the front face (j + d) of a box: a slab and a railing, at height z. */
  function balcony(P, i0, w, jFront, z) {
    var j1 = jFront + 0.45, out = "";
    out += poly([P(i0, jFront, z), P(i0 + w, jFront, z), P(i0 + w, j1, z), P(i0, j1, z)], "#E9E4D3");
    out += poly([P(i0, j1, z), P(i0 + w, j1, z), P(i0 + w, j1, z - 0.08), P(i0, j1, z - 0.08)], "#BDB6A0");
    return out;
  }
  function railing(P, i0, w, jFront, z) {
    var j1 = jFront + 0.45, t = z + 0.3, out = '<polyline points="' + pts([P(i0, jFront, t), P(i0, j1, t), P(i0 + w, j1, t), P(i0 + w, jFront, t)]) + '" fill="none" stroke="#7E8A80" stroke-width="2"/>';
    for (var q = 0; q <= w + 1e-6; q += w / 4) {
      var a = P(i0 + q, j1, z), bb = P(i0 + q, j1, t);
      out += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(bb[0]) + '" y2="' + f(bb[1]) + '" stroke="#7E8A80" stroke-width="1.6"/>';
    }
    return out;
  }
  /* A door on the front face (j + d) of a box. */
  function door(P, i0, jFront, w, h, fill) {
    return poly([P(i0, jFront + 0.01, 0), P(i0 + w, jFront + 0.01, 0), P(i0 + w, jFront + 0.01, h), P(i0, jFront + 0.01, h)], fill || "#7A5C3A");
  }
  /* ============================================================
     The campus world, shared by every scene that shows the whole
     campus: ground, walks, buildings by kind, trees, and its people.
     With live = true its places are objects a visitor can open.
     ============================================================ */
  var WORLD = Iso(800, 600, 37);
  // Where each kind of place stands, and the top of its roof (i, j, z).
  var SPOT = { building: [5, -7.8, 3.0], dorms: [-7, -2, 2.4], orgs: [-4.7, 6, 1.9], offices: [6.1, 4.3, 1.8] };
  function world(live) {
    var P = WORLD, S = P.s / 26, c = P(0, 0);
    var ground = '<ellipse cx="' + c[0] + '" cy="' + f(c[1] + 40 * S) + '" rx="' + f(640 * S) + '" ry="' + f(250 * S) + '" fill="#1F2A22" opacity=".06" filter="url(#blur)"/>' +
      '<ellipse cx="' + c[0] + '" cy="' + f(c[1] + 18 * S) + '" rx="' + f(610 * S) + '" ry="' + f(232 * S) + '" fill="#B9CFA9"/>' +
      '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="' + f(610 * S) + '" ry="' + f(232 * S) + '" fill="url(#grass)"/>';
    [[-4.5, 0, 14, 0], [0, -14, 0, 14]].forEach(function (w) {
      var a = P(w[0], w[1]), b = P(w[2], w[3]);
      ground += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + K.sand + '" stroke-width="12" stroke-linecap="round"/>';
    });
    var dorm = [K.cream, "#D9C48A", "#C7AE6E", "#5B7F8F"], acad = ["#DCE8EE", "#AFC6D0", "#94AFBB", "#3E5D69"],
      office = [K.paper, "#CFD7CC", "#B3BFAF", "#5B7F8F"], org = ["#F3DCC8", "#D9A47C", "#C68B5E", "#5B7F8F"];
    var place = function (id, lx, ly, body) { return live ? obj(id, lx, ly, body) : body; };
    var k = S * 0.92, items = [];
    var stand = function (i, j, z, n, phoneEvery) { var q = P(i, j, z || 0); return isoChar(q[0], q[1], n, k, null, phoneEvery); };
    var road = function (i0, j0, i1, j1, z) { var a = P(i0, j0, z || 0), b = P(i1, j1, z || 0); return "M" + f(a[0]) + "," + f(a[1]) + " L" + f(b[0]) + "," + f(b[1]); };
    // Buildings, each with a door, some with balconies and people on them; depth sorts the scene.
    var acadB = bldg(P, 2.5, -9, 5, 2.4, 3.0, acad, 2) +
      balcony(P, 2.75, 1.5, -6.6, 1.0) + stand(3.5, -6.35, 1.0, 9, 11) + railing(P, 2.75, 1.5, -6.6, 1.0) +
      balcony(P, 5.75, 1.5, -6.6, 2.0) + walker(road(5.95, -6.35, 7.05, -6.35, 2.0), 7, k, 3, 4, -2) + railing(P, 5.75, 1.5, -6.6, 2.0);
    items.push({ d: 7.5 - 6.6, svg: place("building", P(5, -7.8, 4.4)[0], P(5, -7.8, 4.4)[1], acadB) });
    var dormB = bldg(P, -9, -4, 4, 1.6, 2.4, dorm) + bldg(P, -9, -1.6, 4, 1.6, 2.4, dorm, 1) +
      balcony(P, -8.75, 0.9, 0, 1.2) + stand(-8.3, 0.25, 1.2, 8, 14) + railing(P, -8.75, 0.9, 0, 1.2) +
      balcony(P, -6.75, 1.6, 0, 1.2) + walker(road(-6.55, 0.25, -5.45, 0.25, 1.2), 3, k, 3, 5, -1) + railing(P, -6.75, 1.6, 0, 1.2);
    items.push({ d: -5 + 0, svg: place("dorms", P(-6.4, 0.6)[0], P(-6.4, 0.6)[1] + 6, dormB) });
    items.push({ d: -3.4 + 7, svg: place("orgs", P(-4.7, 7.2)[0], P(-4.7, 7.2)[1] + 10, bldg(P, -6, 5, 2.6, 2, 1.9, org, 1)) });
    items.push({ d: 7.7 + 5.4, svg: place("offices", P(6.6, 6.4)[0], P(6.6, 6.4)[1] + 10, bldg(P, 4.5, 3.2, 3.2, 2.2, 1.8, office, 1)) });
    [[-3.5, -6], [-2, -7.5], [9, -3], [9.5, 1], [-9.5, 3], [1.5, 7.5], [3, 8.5], [-2.5, 8.6], [8.6, 7.4], [-6, -8], [-11.5, -1], [10, 4.5]].forEach(function (t) {
      items.push({ d: t[0] + t[1], svg: isoTree(P, t[0], t[1], 1.6) });
    });
    // On a bench, with a phone; four in a circle, talking.
    var bp = P(3.25, -3.5);
    items.push({ d: -0.2, svg: box(P, 2.6, -3.7, 1.3, 0.4, 0.18, [K.brown, "#5C4529", "#4A3820"]) + isoChar(bp[0], bp[1] - 5 * S, 5, k) });
    var circle = "";
    [[-0.6, -0.4], [0.5, -0.5], [0.6, 0.5], [-0.5, 0.6]].forEach(function (o, n) { circle += stand(-2.8 + o[0], 3.4 + o[1], 0, [7, 3, 8, 9][n]); });
    [0, 1, 2].forEach(function (n) {
      var q = P(-2.8 + [-0.6, 0.5, 0.6][n], 3.4 + [-0.4, -0.5, 0.5][n]);
      circle += '<g class="chat c' + n + '"><rect x="' + f(q[0] - 4) + '" y="' + f(q[1] - 54 * S) + '" width="' + f(22 * S) + '" height="' + f(14 * S) + '" rx="' + f(5 * S) + '" fill="#FFFFFF" filter="url(#soft)"/>' +
        '<circle cx="' + f(q[0] + 2.5 * S) + '" cy="' + f(q[1] - 47 * S) + '" r="' + f(1.7 * S) + '" fill="' + K.ink3 + '"/><circle cx="' + f(q[0] + 7 * S) + '" cy="' + f(q[1] - 47 * S) + '" r="' + f(1.7 * S) + '" fill="' + K.ink3 + '"/><circle cx="' + f(q[0] + 11.5 * S) + '" cy="' + f(q[1] - 47 * S) + '" r="' + f(1.7 * S) + '" fill="' + K.ink3 + '"/></g>';
    });
    items.push({ d: 0.6, svg: circle });
    var sp = P(2.2, -5.2), st = isoChar(sp[0], sp[1], 1, k, null, 9);
    items.push({ d: -3, svg: live ? obj("student", sp[0], sp[1] - 40, st) : st });
    items.sort(function (x, y) { return x.d - y.d; });
    var places = items.map(function (x) { return x.svg; }).join("");
    // People come and go: in from the edge of campus or out of a door, and out again.
    // Two meet, talk a while, and walk on together; one stops to check a phone.
    var V = 1.15 * P.s / 26 * 26;
    places += journey(P, 0, k, [[0.4, -14], [0.4, -1.4], [0.4, 14]], V, { 1: 6 }, [1], 0, 6);
    places += journey(P, 6, k, [[-0.4, 14], [-0.4, -1.0], [-0.4, 14]], V, { 1: 6 }, [], -2, 4.4);
    places += journey(P, 2, k, [[14, 0.4], [-3.4, 0.4], [-4.75, 7.4]], V * 0.9, { 1: 5 }, [], -11, 9);
    places += journey(P, 4, k, [[-7.45, 0.3], [-7.45, 0.9], [14, 0.9]], V, { 1: 0, 2: 0 }, [], -23, 14);
    places += journey(P, 5, k, [[-0.4, 14], [-0.4, 7.2], [6.05, 7.2], [6.05, 5.6]], V * 0.85, { 1: 3 }, [], -7, 11);
    places += journey(P, 8, k, [[4.75, -6.4], [4.75, -2.9], [0.4, -2.9], [0.4, -14]], V, { 2: 4 }, [], -30, 8);
    places += journey(P, 1, k, [[14, -0.4], [3.6, -0.4], [14, -0.4]], V * 1.1, { 1: 9 }, [], -17, 12);
    return { ground: ground, places: places };
  }
  function hills() {
    return '<path d="M-1200,330 L0,330 C220,250 380,300 560,250 C760,195 900,270 1080,230 C1260,190 1420,250 1600,215 L2800,215 L2800,1000 L-1200,1000Z" fill="#DCE5D2" opacity=".8"/>' +
      '<path d="M-1200,380 L0,380 C260,320 420,350 640,320 C860,290 1020,340 1240,300 C1400,275 1500,300 1600,290 L2800,290 L2800,1000 L-1200,1000Z" fill="#CFDDC3" opacity=".8"/>';
  }

  function campus() {
    var P = WORLD, out = "", w = world(true);
    out += lay(1, hills());
    out += lay(2, w.ground);
    out += lay(3, w.places);

    // The network floats above the places it joins.
    var N = { dorm: P(-7, -2.5, 3.9), acad: P(4.8, -7.8, 3.4), office: P(6.1, 4.3, 3.0), org: P(-4.7, 6, 2.4), hub: P(8.5, -2, 2.2) };
    var lift = function (a, b) { var dx = b[0] - a[0], dy = b[1] - a[1]; return 40 + Math.sqrt(dx * dx + dy * dy) * 0.32; };
    var arc = function (a, b) { return "M" + f(a[0]) + "," + f(a[1]) + " Q" + f((a[0] + b[0]) / 2) + "," + f((a[1] + b[1]) / 2 - lift(a, b)) + " " + f(b[0]) + "," + f(b[1]); };
    var lines = "", drops = "", nodes = "";
    [["dorm", "office"], ["acad", "office"], ["org", "office"], ["acad", "hub"], ["hub", "office"], ["dorm", "acad"], ["dorm", "org"], ["org", "acad"]].forEach(function (e) {
      lines += '<path d="' + arc(N[e[0]], N[e[1]]) + '" fill="none" stroke="#C2C9BD" stroke-width="2"/>';
    });
    [["dorm", P(-7, -2.5, 2.4)], ["acad", P(4.8, -7.8, 2.0)], ["office", P(6.1, 4.3, 1.8)], ["org", P(-4.7, 6, 1.1)], ["hub", P(8.5, -2, 0)]].forEach(function (d) {
      var a = N[d[0]];
      drops += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(d[1][0]) + '" y2="' + f(d[1][1]) + '" stroke="' + K.green2 + '" stroke-width="1.2" stroke-dasharray="3 4" opacity=".5"/>';
    });
    Object.keys(N).forEach(function (key) {
      var on = key === "dorm" || key === "office";
      nodes += '<circle cx="' + f(N[key][0]) + '" cy="' + f(N[key][1]) + '" r="9" fill="' + (on ? K.green : K.white) + '" stroke="' + K.green + '" stroke-width="2.5"/>';
    });
    var a = N.dorm, d = N.office, route = arc(a, d);
    var routeObj = '<path d="' + route + '" fill="none" stroke="#000" stroke-opacity="0" stroke-width="22" class="hit"/>' +
      '<path d="' + route + '" fill="none" stroke="' + K.green + '" stroke-width="5" stroke-linecap="round" filter="url(#glow)"/>' +
      '<path class="flow" d="' + route + '" fill="none" stroke="' + K.white + '" stroke-width="2.4" stroke-dasharray="2 14" stroke-linecap="round"/>' +
      '<g transform="translate(' + f(a[0] - 30) + " " + f(a[1] - 70) + ')"><rect width="60" height="44" rx="10" fill="' + K.sea + '"/><path d="M22,44 l8,12 l8,-12z" fill="' + K.sea + '"/>' +
      '<text class="ui" x="30" y="33" text-anchor="middle" font-size="30" font-weight="700" fill="#fff">?</text></g>' +
      '<circle cx="' + f(d[0]) + '" cy="' + f(d[1]) + '" r="24" fill="none" stroke="' + K.gold + '" stroke-width="4" filter="url(#glow)"/>' +
      '<g transform="translate(' + f(d[0] + 34) + " " + f(d[1] - 22) + ')" filter="url(#soft)"><rect width="40" height="40" rx="9" fill="' + K.green + '"/><path d="M10 13h20M10 20h20M10 27h13" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>';

    out += lay(4, lines + drops + obj("route", d[0] + 150, d[1] - 34, routeObj) + nodes);

    return svg("A drawn campus: dormitories, academic buildings, offices, and organizations, with the network's routes above them; people walk to class, one sits on a bench with a phone, four talk in a circle", out);
  }

  /* ============================================================
     Scene: inside an academic building, cut away
     ============================================================ */
  function building() {
    var P = Iso(560, 300, 58), H = 2.6, out = "";
    out += lay(1,
      '<path d="M-1200,520 L0,520 C240,460 420,500 640,470 C860,440 1040,490 1260,455 C1420,430 1520,450 1600,445 L2800,445 L2800,1000 L-1200,1000Z" fill="#DCE5D2" opacity=".7"/>' +
      frontTree(1430, 520, 0.8) + frontTree(150, 470, 0.7));

    var wallL = "#E7EBE2", wallR = "#DADFD3", rim = "#C9D0C2";
    var g = "";
    // Ground and floor slab.
    g += '<ellipse cx="' + f(P(6, 3.5)[0]) + '" cy="' + f(P(6, 3.5)[1] + 40) + '" rx="620" ry="190" fill="#1F2A22" opacity=".07" filter="url(#blur)"/>';
    g += box(P, -0.4, -0.4, 12.8, 7.2, 0.35, ["#E8E4D6", "#CFC9B6", "#BDB6A0"], -0.35);
    // Back walls, cut open at the front.
    g += poly([P(0, 0, 0), P(0, 6.4, 0), P(0, 6.4, H), P(0, 0, H)], wallR) + poly([P(0, 0, H), P(0, 6.4, H), P(-0.15, 6.4, H), P(-0.15, 0, H)], rim);
    g += poly([P(0, 0, 0), P(12, 0, 0), P(12, 0, H), P(0, 0, H)], wallL) + poly([P(0, 0, H), P(12, 0, H), P(12, -0.15, H), P(0, -0.15, H)], rim);
    // Floors: three rooms and a stair hall, with a hall along the front.
    var rooms = [[0, 4.5, "#EEF0E7"], [4.5, 8, "#F4EFE0"], [8, 10.5, "#EEF0E7"], [10.5, 12, "#E9E4D3"]];
    rooms.forEach(function (r) { g += poly([P(r[0], 0, 0), P(r[1], 0, 0), P(r[1], 4.6, 0), P(r[0], 4.6, 0)], r[2]); });
    g += poly([P(0, 4.6, 0), P(12, 4.6, 0), P(12, 6.4, 0), P(0, 6.4, 0)], "#E2DDCB");
    out += lay(2, g);

    // Windows on the back wall, and a whiteboard in the classroom.
    function wallRect(i0, i1, z0, z1, fill) { return poly([P(i0, 0.02, z0), P(i1, 0.02, z0), P(i1, 0.02, z1), P(i0, 0.02, z1)], fill); }
    var w = "";
    [[5.0, 5.9], [9.0, 9.9]].forEach(function (x) { w += wallRect(x[0], x[1], 1.1, 2.1, K.sky) + wallRect(x[0], x[1], 1.1, 1.18, "#9CC3C7"); });
    w += wallRect(6.1, 7.7, 1.0, 2.0, "#FFFFFF") + wallRect(6.1, 7.7, 0.95, 1.0, "#C9CFC2");
    w += '<path d="M' + pts([P(6.3, 0.02, 1.7), P(6.9, 0.02, 1.8), P(7.3, 0.02, 1.5)]).replace(/ /g, " L") + '" fill="none" stroke="' + K.sea2 + '" stroke-width="3" opacity=".6"/>';
    // Shelves in the faculty room.
    w += wallRect(8.2, 8.9, 0.6, 1.9, "#CDBB98");
    [0.9, 1.3, 1.7].forEach(function (z) {
      w += wallRect(8.25, 8.85, z - 0.02, z + 0.02, "#A8936C");
      w += wallRect(8.3, 8.4, z + 0.02, z + 0.3, K.red) + wallRect(8.43, 8.52, z + 0.02, z + 0.26, K.sea2) + wallRect(8.56, 8.66, z + 0.02, z + 0.32, K.gold);
    });
    out += lay(2, w);

    // The computer lab, the room a visitor can open.
    var lab = "";
    lab += poly([P(0, 0, H), P(4.5, 0, H), P(4.5, 4.6, 1.6), P(4.5, 4.6, 0), P(0, 4.6, 0), P(0, 0, 0)], "#000", ' fill-opacity="0"');
    lab += wallRect(0.6, 3.9, 1.1, 2.0, "#FFFFFF") + wallRect(0.6, 3.9, 1.05, 1.1, "#C9CFC2");
    [0.9, 2.1, 3.3].forEach(function (j) {
      lab += box(P, 0.5, j, 3.6, 0.65, 0.07, ["#D8CDB4", "#BFB296", "#B0A385"], 0.5);
      [0.75, 1.85, 2.95].forEach(function (i) {
        lab += box(P, i, j + 0.06, 0.6, 0.07, 0.42, [K.ink, "#33413A", "#2A3530"], 0.58);
        lab += poly([P(i + 0.05, j + 0.13, 0.63), P(i + 0.55, j + 0.13, 0.63), P(i + 0.55, j + 0.13, 0.95), P(i + 0.05, j + 0.13, 0.95)], j === 3.3 && i === 2.95 ? K.gold3 : "#BFE0CC");
        lab += box(P, i + 0.1, j + 0.85, 0.42, 0.38, 0.42, ["#5B7F8F", "#4A6C7A", "#3E5D69"]);
      });
    });
    lab += isoPerson(P, 1.1, 1.75, 3) + isoPerson(P, 3.2, 2.95, 0);
    out += lay(3, obj("lab", P(2.2, 0, H + 0.2)[0], P(2.2, 0, H + 0.2)[1], lab));

    // Partitions, cut low so the rooms show.
    var parts = "";
    [4.5, 8, 10.5].forEach(function (i) { parts += box(P, i, 0, 0.12, 4.6, 1.6, ["#F6F6F0", "#DADFD3", "#C9D0C2"]); });
    // Classroom desks, the faculty counter, the stair hall.
    var room = "";
    [1.1, 2.3, 3.4].forEach(function (j) {
      [5.0, 6.2, 7.2].forEach(function (i) {
        room += box(P, i, j, 0.65, 0.5, 0.06, ["#D8CDB4", "#BFB296", "#B0A385"], 0.48) + box(P, i + 0.1, j + 0.55, 0.42, 0.35, 0.4, ["#C25B4A", "#A64A3B", "#8F3F32"]);
      });
    });
    room += box(P, 8.6, 2.4, 1.4, 0.7, 0.75, ["#E8E0CC", "#CDBB98", "#B8A57F"]) + isoPerson(P, 9.2, 1.9, 2);
    for (var s = 0; s < 7; s++) room += box(P, 10.7, 0.3 + s * 0.45, 1.1, 0.45, 0.25 + s * 0.3, ["#E9E4D3", "#CFC9B6", "#BDB6A0"]);
    out += lay(3, parts + room);

    // The building's switch, and the fiber that leaves it for the campus core.
    var p0 = P(11.6, 4.9, 0.1), p1 = P(11.6, 6.6, -0.35), p2 = P(14.5, 8.5, -0.35), p3 = P(16.5, 10.5, -0.35);
    var fiber = '<path d="M' + f(p0[0]) + " " + f(p0[1]) + " L" + f(p1[0]) + " " + f(p1[1]) + " L" + f(p2[0]) + " " + f(p2[1]) + " L" + f(p3[0]) + " " + f(p3[1]) + '" fill="none" stroke="' + K.gold + '" stroke-width="5" stroke-linecap="round" filter="url(#glow)"/>' +
      '<path class="flow" d="M' + f(p0[0]) + " " + f(p0[1]) + " L" + f(p1[0]) + " " + f(p1[1]) + " L" + f(p2[0]) + " " + f(p2[1]) + " L" + f(p3[0]) + " " + f(p3[1]) + '" fill="none" stroke="#FFF7DA" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>';
    var rack = box(P, 11.3, 4.75, 0.6, 0.5, 1.5, [K.ink, "#33413A", "#2A3530"]);
    [0.4, 0.7, 1.0, 1.3].forEach(function (z, n) {
      var q = P(11.45 + (n % 2) * 0.2, 5.25, z);
      rack += '<circle class="led" cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="3" fill="' + (n === 2 ? K.gold : "#7CE0A0") + '"/>';
    });
    out += lay(4, fiber + obj("closet", P(11.6, 5, 1.8)[0], P(11.6, 5, 1.8)[1], '<g>' + rack + "</g>"));

    // Access points on the walls, one per room and one in the hall.
    var aps = "";
    [[2.25, 0.02], [9.25, 0.02], [0.02, 5.5]].forEach(function (a) {
      var q = a[1] > 1 ? P(a[0], a[1], 2.35) : P(a[0], a[1], 2.35);
      aps += accessPoint(q[0], q[1], 1.1, true);
    });
    var q = P(6.25, 0.02, 2.35);
    aps += obj("ap", q[0], q[1] - 34, accessPoint(q[0], q[1], 1.3, true));
    // People in the hall.
    aps += isoPerson(P, 6.5, 5.4, 1) + isoPerson(P, 3, 5.9, 0, 0, true);
    out += lay(4, aps);

    return svg("An academic building, cut away: a computer lab, a classroom, a faculty room, and a stair hall, with Wi-Fi access points on the walls and a switch whose fiber leaves for the campus core", out);
  }

  /* ============================================================
     Scene: a computer lab, front on
     ============================================================ */
  function lab() {
    var out = "";
    // Back wall, window, clock, whiteboard, access point.
    var wall = '<rect x="-1200" width="4000" height="640" fill="' + K.paper2 + '"/><rect x="-1200" y="620" width="4000" height="24" fill="#DCDFD4"/>' +
      '<rect x="1180" y="130" width="320" height="270" rx="10" fill="' + K.sky + '"/><path d="M1180 330C1260 300 1330 320 1400 290S1480 300 1500 296V400H1180Z" fill="#9CC3C7"/>' +
      '<circle cx="1250" cy="330" r="30" fill="' + K.green3 + '"/><circle cx="1440" cy="320" r="40" fill="' + K.green4 + '"/>' +
      '<path d="M1340 130V400M1180 265H1500" stroke="' + K.white + '" stroke-width="10"/><rect x="1170" y="396" width="340" height="14" rx="4" fill="#DCDFD4"/>' +
      '<circle cx="1060" cy="150" r="34" fill="' + K.white + '" filter="url(#soft)"/><path class="hand" d="M1060 150V128M1060 150L1074 158" stroke="' + K.ink + '" stroke-width="4" stroke-linecap="round"/>';
    out += lay(1, wall);
    var board = piece('<rect x="160" y="110" width="840" height="340" rx="8" fill="#FFFFFF"/><rect x="160" y="440" width="840" height="16" rx="4" fill="#C9CFC2"/>') +
      '<g fill="none" stroke-linecap="round" stroke-width="5"><rect x="220" y="170" width="150" height="90" rx="10" stroke="' + K.sea2 + '"/><rect x="520" y="170" width="150" height="90" rx="10" stroke="' + K.sea2 + '"/>' +
      '<rect x="370" y="320" width="150" height="90" rx="10" stroke="' + K.green2 + '"/><path d="M370 215H520M300 260L410 320M600 260L480 320" stroke="' + K.ink2 + '"/>' +
      '<path d="M740 180h200M740 230h160M740 280h190M740 330h120" stroke="#B9BFB3"/></g>' +
      '<rect x="230" y="438" width="60" height="10" rx="5" fill="' + K.red + '"/><rect x="300" y="438" width="60" height="10" rx="5" fill="' + K.sea2 + '"/>';
    out += lay(2, board + obj("ap", 800, 92, accessPoint(800, 40, 2.2, true)));

    // The instructor at the board.
    var t = piece('<rect x="1050" y="430" width="70" height="200" rx="26" fill="' + K.green2 + '"/><rect x="1060" y="600" width="22" height="40" fill="' + K.ink + '"/><rect x="1088" y="600" width="22" height="40" fill="' + K.ink + '"/>' +
      '<path d="M1060 470L1010 420" stroke="' + K.green2 + '" stroke-width="20" stroke-linecap="round"/><circle cx="1004" cy="414" r="12" fill="' + SKIN[2] + '"/>' +
      '<rect x="1076" y="404" width="18" height="30" fill="' + SKIN[2] + '"/><circle cx="1085" cy="378" r="38" fill="' + SKIN[2] + '"/><path d="M1047 372a38 38 0 0 1 76 -4c-14-14-40-20-76 4Z" fill="' + HAIR[0] + '"/>') +
      face(1085, 384, 38);
    out += lay(2, t);

    // Back row: tables and screens, students from behind.
    var back = piece('<rect x="70" y="600" width="1460" height="22" rx="6" fill="#D8CDB4"/><rect x="100" y="622" width="14" height="80" fill="#B0A385"/><rect x="1486" y="622" width="14" height="80" fill="#B0A385"/>');
    [200, 470, 740, 1320].forEach(function (x, n) {
      back += piece('<rect x="' + (x - 70) + '" y="500" width="140" height="94" rx="8" fill="' + K.ink + '"/><rect x="' + (x - 62) + '" y="508" width="124" height="78" rx="4" fill="#BFE0CC"/><rect x="' + (x - 10) + '" y="594" width="20" height="8" fill="#33413A"/>');
      if (n !== 2) back += backPerson(x, 640, n, 0.8);
    });
    out += lay(3, back);

    // Front row: a table, three screens, and the one a visitor can open.
    var front = piece('<rect x="-1200" y="820" width="4000" height="30" rx="6" fill="#D8CDB4"/><rect x="-1200" y="850" width="4000" height="150" fill="#E3DCC8"/>');
    [260, 700].forEach(function (x, n) {
      front += piece('<rect x="' + (x - 130) + '" y="640" width="260" height="170" rx="12" fill="' + K.ink + '"/><rect x="' + (x - 118) + '" y="652" width="236" height="146" rx="6" fill="#BFE0CC"/><rect x="' + (x - 20) + '" y="810" width="40" height="12" fill="#33413A"/>');
      front += backPerson(x, 880, n + 3, 1.2);
    });
    var mon = piece('<rect x="1000" y="600" width="400" height="230" rx="14" fill="' + K.ink + '"/><rect x="1016" y="616" width="368" height="198" rx="6" fill="url(#screen-glow)"/><rect x="1180" y="830" width="40" height="0" fill="#33413A"/>') +
      '<rect x="1016" y="616" width="368" height="30" rx="6" fill="' + K.green + '"/><rect x="1016" y="636" width="368" height="10" fill="' + K.green + '"/>' +
      '<rect x="1032" y="660" width="90" height="140" rx="6" fill="#EEF0E7"/><rect x="1134" y="660" width="236" height="64" rx="8" fill="#FFFFFF" stroke="#D6D2C2"/><rect x="1146" y="672" width="56" height="12" rx="6" fill="' + K.green + '"/><rect x="1146" y="694" width="160" height="10" rx="5" fill="#C9CFC2"/>' +
      '<rect x="1134" y="734" width="236" height="66" rx="8" fill="#FFFFFF" stroke="#D6D2C2"/><rect x="1146" y="746" width="80" height="12" rx="6" fill="' + K.gold2 + '"/><rect x="1146" y="768" width="190" height="10" rx="5" fill="#C9CFC2"/>';
    front += obj("monitor", 1200, 588, '<g class="screen-glow">' + mon + "</g>");
    front += backPerson(1150, 900, 1, 1.25);
    out += lay(4, front);

    return svg("A computer lab: a whiteboard, an instructor, rows of tables with computers, and students at work; one monitor shows the network", out);
  }

  /* ============================================================
     Scene: the network on a monitor, a labeled mock-up
     ============================================================ */
  function screen() {
    var out = lay(1, '<rect x="140" y="50" width="1320" height="820" rx="28" fill="' + K.ink + '" filter="url(#paper)"/><rect x="740" y="870" width="120" height="70" fill="#33413A"/><rect x="620" y="934" width="360" height="22" rx="11" fill="#2A3530"/>');
    var ui = '<rect x="170" y="80" width="1260" height="760" rx="10" fill="#FBFBF7"/>' +
      '<rect x="170" y="80" width="1260" height="70" rx="10" fill="' + K.green + '"/><rect x="170" y="130" width="1260" height="20" fill="' + K.green + '"/>' +
      '<circle cx="214" cy="115" r="16" fill="' + K.gold2 + '"/><text class="ui ui-h" x="246" y="124" fill="#FFFFFF">A department community</text>' +
      '<rect x="1070" y="98" width="336" height="34" rx="17" fill="' + K.cream + '"/><text class="ui ui-chip" x="1238" y="121" text-anchor="middle" fill="#785808">Mock-up: made-up content</text>' +
      '<rect x="170" y="150" width="260" height="690" fill="#EEF0E7"/>';
    ["Notices", "Questions", "Guides", "Events", "Members"].forEach(function (s, n) {
      ui += (n === 0 ? '<rect x="186" y="' + (176 + n * 58) + '" width="228" height="44" rx="10" fill="#D5E6D3"/>' : "") +
        '<text class="ui ui-nav" x="210" y="' + (205 + n * 58) + '" fill="' + (n === 0 ? K.green : K.ink2) + '">' + s + "</text>";
    });
    // A notice, labeled by type and state (D-063), marked as a sample (D-108).
    var notice = '<rect x="462" y="176" width="936" height="276" rx="14" fill="#FFFFFF" stroke="#D6D2C2" stroke-width="2"/>' +
      chip(486, 198, "Official", "#D5E6D3", K.green, 110) + chip(606, 198, "Current", K.sky2, K.sea, 110) + chip(726, 198, "This school year", "#EEF0E7", K.ink2, 170) +
      '<text class="ui ui-t" x="486" y="276" fill="' + K.ink + '">Lab classes move to Room 2 on Friday</text>' +
      '<text class="ui ui-m" x="486" y="310" fill="' + K.ink3 + '">Department office (sample) · posted Monday</text>' +
      bars(486, 336, [820, 760, 520]) + sampleTag(486, 406, 360);
    ui += obj("notice", 1290, 170, notice);
    // A question, with an office's confirmed answer kept (D-070, D-071).
    var q = '<rect x="462" y="476" width="936" height="340" rx="14" fill="#FFFFFF" stroke="#D6D2C2" stroke-width="2"/>' +
      '<text class="ui ui-t" x="486" y="526" fill="' + K.ink + '">Where do we get the lab clearance form?</text>' +
      '<text class="ui ui-m" x="486" y="558" fill="' + K.ink3 + '">Asked by a second-year student · routed to the department office</text>' +
      '<rect x="486" y="580" width="888" height="150" rx="12" fill="#F2F7F1" stroke="#9FC7A8" stroke-width="2"/>' +
      chip(506, 598, "Official · confirmed answer", "#D5E6D3", K.green, 270) +
      '<text class="ui ui-b" x="506" y="664" fill="' + K.ink + '">At the department office, on weekdays. Bring your school ID.</text>' +
      '<text class="ui ui-m" x="506" y="700" fill="' + K.ink3 + '">Department office (sample) · confirmed in August</text>' +
      chip(486, 748, "Kept for the next batch", K.cream, "#785808", 260) +
      chip(760, 748, "Community knowledge", "#EEF0E7", K.ink2, 230) + '<text class="ui ui-m" x="1004" y="769" fill="' + K.ink3 + '">A senior added a guide</text>';
    ui += obj("answer", 1290, 470, q);
    out += lay(2, ui);
    return svg("A mock-up of the network on a computer, made-up content: a department community with an office notice labeled official and current, and a question with a confirmed answer kept for the next batch", out, "#E7EBE0");
  }

  /* ============================================================
     Scene: outside the building, between classes
     ============================================================ */
  function outside() {
    var out = lay(1, '<rect x="-1200" width="4000" height="620" fill="url(#sky)"/>' +
      '<g class="cloud c1"><path d="M220 150a24 24 0 0 1 42-14 30 30 0 0 1 54 8 18 18 0 0 1 3 36H223a15 15 0 0 1-3-30Z" fill="#FFFFFF" opacity=".8"/></g>' +
      '<g class="cloud c2"><path d="M980 100a18 18 0 0 1 33-12 24 24 0 0 1 42 6 15 15 0 0 1 3 27h-75a12 12 0 0 1-3-21Z" fill="#FFFFFF" opacity=".7"/></g>' +
      '<path d="M-1200 470L0 470C200 400 380 430 600 390S1000 410 1200 380 1500 400 1600 390H2800V700H-1200Z" fill="#DCE5D2"/>' +
      '<path d="M-1200 520L0 520C260 470 460 500 700 470S1100 490 1350 460 1560 480 1600 476H2800V700H-1200Z" fill="#CFDDC3"/>');
    // A generic academic building: two floors of windows, an entrance, and an outdoor access point.
    var b = piece('<rect x="180" y="240" width="980" height="420" rx="6" fill="' + K.paper2 + '"/><rect x="900" y="240" width="260" height="420" fill="#DCE1D5"/>' +
      '<path d="M150 250H1190L1160 210H180Z" fill="' + K.sea2 + '"/><rect x="150" y="244" width="1040" height="14" fill="#1F5A68"/>' +
      '<rect x="180" y="440" width="980" height="14" fill="#DCE1D5"/>');
    for (var r = 0; r < 2; r++) for (var col = 0; col < 7; col++) {
      var x = 220 + col * 132, y = 290 + r * 200;
      if (r === 1 && col === 3) continue;
      b += '<rect x="' + x + '" y="' + y + '" width="92" height="110" rx="6" fill="' + K.sky + '"/><path d="M' + (x + 14) + " " + (y + 90) + "l40-58M" + (x + 44) + " " + (y + 96) + 'l30-42" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity=".5"/>';
    }
    b += piece('<rect x="606" y="500" width="128" height="160" fill="#82654B"/><rect x="668" y="500" width="4" height="160" fill="#6B523C"/><path d="M586 506H754L740 486H600Z" fill="' + K.sea2 + '"/>');
    out += lay(2, b + obj("ap", 1110, 278, '<rect x="1102" y="322" width="16" height="30" rx="4" fill="#C9CFC2"/>' + accessPoint(1110, 320, 1.6, false)));
    out += lay(2, frontTree(1330, 660, 1.1) + frontTree(90, 660, 0.9));

    // The walk, a bench, and a student with a phone.
    var g = '<rect x="-1200" y="640" width="4000" height="360" fill="#CADDBB"/><path d="M-1200 760L0 760C400 730 900 740 1600 720H2800V840H1600C900 860 400 850 0 880H-1200Z" fill="' + K.sand + '"/>';
    g += piece('<rect x="1240" y="700" width="230" height="16" rx="6" fill="' + K.brown + '"/><rect x="1250" y="716" width="12" height="40" fill="#5C4529"/><rect x="1448" y="716" width="12" height="40" fill="#5C4529"/>');
    g += piece('<rect x="1290" y="610" width="56" height="96" rx="22" fill="' + K.gold2 + '"/><circle cx="1318" cy="584" r="26" fill="' + SKIN[3] + '"/><path d="M1292 580a26 26 0 0 1 52 0c-12-10-36-12-52 0Z" fill="' + HAIR[1] + '"/>') + face(1318, 588, 26);
    out += lay(3, g);
    var sk = SKIN[0];
    var walker = '<g class="walker">' + piece(
      '<path d="M786 840L770 940" stroke="#2F3B5E" stroke-width="30" stroke-linecap="round"/><path d="M826 840L852 936" stroke="#2F3B5E" stroke-width="30" stroke-linecap="round"/>' +
      '<rect x="752" y="934" width="40" height="16" rx="8" fill="' + K.ink + '"/><rect x="838" y="930" width="40" height="16" rx="8" fill="' + K.ink + '"/>' +
      '<rect x="760" y="660" width="100" height="200" rx="40" fill="' + K.red + '"/><rect x="842" y="690" width="40" height="110" rx="14" fill="' + K.sea + '"/>' +
      '<path d="M770 700L740 800" stroke="' + K.red + '" stroke-width="28" stroke-linecap="round"/><circle cx="738" cy="806" r="15" fill="' + sk + '"/>' +
      '<path d="M840 700L880 760L850 720" stroke="' + K.red + '" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="798" y="630" width="26" height="36" fill="' + sk + '"/><circle cx="811" cy="596" r="46" fill="' + sk + '"/>' +
      '<path d="M765 592a46 46 0 0 1 92 -6c-20-22-58-26-92 6Z" fill="' + HAIR[0] + '"/>') + face(818, 606, 44) + "</g>";
    var phone = '<g class="phone-glow"><rect x="858" y="716" width="46" height="80" rx="9" fill="' + K.ink + '" transform="rotate(-14 881 756)"/>' +
      '<rect x="864" y="724" width="34" height="62" rx="5" fill="url(#screen-glow)" transform="rotate(-14 881 756)"/>' +
      '<rect x="864" y="724" width="34" height="12" rx="4" fill="' + K.green + '" transform="rotate(-14 881 756)"/></g>' +
      '<circle cx="880" cy="782" r="15" fill="' + sk + '"/>';
    out += lay(4, obj("phone", 840, 560, walker + phone));
    return svg("Outside a generic academic building with an outdoor access point; a student walks past, looking at a phone, and another sits on a bench", out);
  }

  /* ============================================================
     Scene: the same network, on a phone, a labeled mock-up
     ============================================================ */
  function phone() {
    var out = lay(1, '<rect x="-1200" width="4000" height="1000" fill="#DCE5D2"/><circle cx="260" cy="300" r="220" fill="#CADDBB" filter="url(#blur)"/><circle cx="1380" cy="700" r="260" fill="#CFDDC3" filter="url(#blur)"/>' +
      '<rect x="-1200" y="640" width="4000" height="360" fill="' + K.sand + '" opacity=".6" filter="url(#blur)"/>');
    var sk = SKIN[0];
    // The hand behind the phone.
    out += lay(2, piece('<path d="M470 1000C470 860 520 780 600 760L620 1000Z" fill="' + sk + '"/><rect x="560" y="560" width="70" height="200" rx="35" fill="' + sk + '" transform="rotate(-8 595 660)"/>'));
    var ph = piece('<rect x="560" y="40" width="480" height="940" rx="56" fill="' + K.ink + '"/>') +
      '<rect x="584" y="64" width="432" height="892" rx="40" fill="#FBFBF7"/><rect x="740" y="78" width="120" height="22" rx="11" fill="' + K.ink + '"/>' +
      // Status bar: the Wi-Fi mark for campus Wi-Fi.
      '<path d="M960 92q14-12 28 0M965 98q9-7 18 0" fill="none" stroke="' + K.ink + '" stroke-width="3" stroke-linecap="round"/><circle cx="974" cy="104" r="3" fill="' + K.ink + '"/>' +
      '<rect x="584" y="120" width="432" height="74" fill="' + K.green + '"/><text class="ui ui-hs" x="608" y="166" fill="#FFFFFF">A department community</text>' +
      '<rect x="608" y="210" width="230" height="32" rx="16" fill="' + K.cream + '"/><text class="ui ui-cs" x="723" y="231" text-anchor="middle" fill="#785808">Mock-up: made-up content</text>';
    ph += obj("saved", 1150, 244, '<rect x="846" y="210" width="150" height="32" rx="16" fill="#E3EEEF"/><path d="M864 220v12l6-4 6 4v-12Z" fill="' + K.sea + '"/><text class="ui ui-cs" x="882" y="231" fill="' + K.sea + '">Saved here</text>');
    var n = '<rect x="604" y="260" width="392" height="300" rx="16" fill="#FFFFFF" stroke="#D6D2C2" stroke-width="2"/>' +
      '<rect x="622" y="278" width="90" height="28" rx="14" fill="#D5E6D3"/><text class="ui ui-cs" x="667" y="297" text-anchor="middle" fill="' + K.green + '">Official</text>' +
      '<rect x="720" y="278" width="90" height="28" rx="14" fill="' + K.sky2 + '"/><text class="ui ui-cs" x="765" y="297" text-anchor="middle" fill="' + K.sea + '">Current</text>' +
      '<text class="ui ui-ts" x="622" y="344" fill="' + K.ink + '">Lab classes move to</text><text class="ui ui-ts" x="622" y="376" fill="' + K.ink + '">Room 2 on Friday</text>' +
      '<text class="ui ui-ms" x="622" y="406" fill="' + K.ink3 + '">Department office (sample)</text>' + bars(622, 426, [340, 300, 220], 20) +
      '<rect x="622" y="500" width="356" height="40" rx="8" fill="#F3DED8"/><text class="ui ui-cs" x="638" y="526" fill="#8A2B1E">Sample: not an official VSU notice</text>';
    ph += obj("notice", 1150, 330, n);
    var a = '<rect x="604" y="580" width="392" height="300" rx="16" fill="#FFFFFF" stroke="#D6D2C2" stroke-width="2"/>' +
      '<text class="ui ui-ts" x="622" y="622" fill="' + K.ink + '">Where do we get the lab</text><text class="ui ui-ts" x="622" y="654" fill="' + K.ink + '">clearance form?</text>' +
      '<rect x="622" y="672" width="356" height="140" rx="12" fill="#F2F7F1" stroke="#9FC7A8" stroke-width="2"/>' +
      '<rect x="638" y="686" width="200" height="28" rx="14" fill="#D5E6D3"/><text class="ui ui-cs" x="738" y="705" text-anchor="middle" fill="' + K.green + '">Official · confirmed</text>' +
      '<text class="ui ui-ms" x="638" y="744" fill="' + K.ink + '">At the department office,</text><text class="ui ui-ms" x="638" y="770" fill="' + K.ink + '">weekdays. Bring your ID.</text>' +
      '<text class="ui ui-ms" x="638" y="798" fill="' + K.ink3 + '">Confirmed in August</text>' +
      '<rect x="622" y="830" width="240" height="32" rx="16" fill="' + K.cream + '"/><text class="ui ui-cs" x="742" y="851" text-anchor="middle" fill="#785808">Kept for the next batch</text>';
    ph += obj("answer", 1150, 640, a);
    out += lay(3, ph);
    // The thumb, in front.
    out += lay(4, piece('<path d="M1040 700C1110 690 1150 740 1130 800L1030 900C1000 930 960 900 980 870Z" fill="' + sk + '"/>'));
    return svg("A mock-up of the network on a phone, made-up content: the same notice and kept answer, with the latest notices saved on the phone", out);
  }

  /* ============================================================
     Scene: one feed for everything, and a place for every post
     Today: a phone shows a feed, every kind of post in one
     column, with the campus small and dim beside it. With
     CAMPUS: the posts fly to the places they belong to on the
     campus (D-144). A drawn composite: no real post (D-148).
     ============================================================ */
  // Each post: its icon, its kind of place, and the place it lands on (x, y of the tile).
  var FEED = [
    { ic: "medal", kind: "service", at: "orgs", dx: 100 },
    { ic: "tap", kind: "residence", at: "dorms", dx: 0 },
    { ic: "id", kind: "building", at: "building", dx: 0 },
    { ic: "storm", kind: "office", at: "orgs", dx: -100 },
    { ic: "megaphone", kind: "org", at: null, to: [330, 300] },
    { ic: "map", kind: "interest", at: null, to: [1290, 230] }
  ];
  // A post's tile floats over its place on the shared campus, tied to its roof.
  FEED.forEach(function (p) {
    if (!p.at) return;
    var r = SPOT[p.at], roof = WORLD(r[0], r[1], r[2]);
    p.roof = roof;
    p.to = [Math.round(roof[0] + p.dx), Math.round(roof[1] - 110)];
  });
  var POST_X = 596, POST_Y = 196, POST_STEP = 124, POST_S = 0.42;
  function tile(t, kind, ground) {
    var x = t[0], y = t[1], k = KIND[kind];
    var stem = ground ? '<line x1="' + x + '" y1="' + (y + 34) + '" x2="' + f(ground[0]) + '" y2="' + f(ground[1]) + '" stroke="' + k.c + '" stroke-width="2.5" stroke-dasharray="4 5"/>' +
      '<ellipse cx="' + f(ground[0]) + '" cy="' + f(ground[1]) + '" rx="22" ry="9" fill="' + k.c + '" opacity=".35"/>'
      : '<ellipse cx="' + x + '" cy="' + (y + 52) + '" rx="70" ry="12" fill="' + k.c + '" opacity=".14" filter="url(#blur)"/>';
    return stem + '<rect x="' + (x - 92) + '" y="' + (y - 34) + '" width="184" height="68" rx="14" fill="' + k.bg + '" stroke="' + k.c + '" stroke-width="2.5" filter="url(#soft)"/>' +
      '<rect x="' + (x - 82) + '" y="' + (y - 28) + '" width="14" height="5" rx="2.5" fill="' + k.c + '"/>';
  }
  function elsewhere() {
    var out = "";
    out += lay(1, '<rect x="-1200" width="4000" height="1000" fill="#EEF1EA"/><circle cx="1320" cy="560" r="300" fill="#E3EBD6" filter="url(#blur)"/><circle cx="260" cy="820" r="260" fill="#E6ECE6" filter="url(#blur)"/>');

    // The campus, the same as the start: small and dim beside the phone today, the whole stage with CAMPUS.
    var w = world(false);
    out += lay(1, grp('data-show="campus"', hills()));
    out += lay(2, grp('data-at-today="1068 359 0.34" data-dim="today"', w.ground + w.places));

    // Where each post lands: a tile above its place, tied to its roof; an interest place names no location, so it floats (D-144).
    var tiles = "", objs = "";
    FEED.forEach(function (p, n) {
      var t = tile(p.to, p.kind, p.roof || null);
      var at = 'data-show="campus" data-delay="' + (520 + n * 90) + '"';
      if (n === 3) objs += objX("office-notice", p.to[0], p.to[1] + 76, at, t);
      else if (n === 0) objs += objX("scholarships", p.to[0], p.to[1] - 40, at, t);
      else if (n === 4) objs += objX("org-place", p.to[0], p.to[1] - 40, at, t);
      else tiles += grp(at, t);
    });
    out += lay(3, tiles + objs);

    // The phone, with the group's header; its posts are drawn on top of it so they can fly.
    var ph = piece('<rect x="560" y="40" width="460" height="940" rx="56" fill="' + K.ink + '"/>') +
      '<rect x="582" y="62" width="416" height="896" rx="40" fill="#F4F5F1"/><rect x="730" y="76" width="120" height="22" rx="11" fill="' + K.ink + '"/>' +
      '<rect x="582" y="112" width="416" height="68" fill="#6B7A86"/>' +
      '<circle cx="616" cy="146" r="7" fill="#DDE3E6"/><circle cx="632" cy="140" r="9" fill="#FFFFFF"/><circle cx="648" cy="146" r="7" fill="#DDE3E6"/>' +
      '<rect x="670" y="134" width="150" height="11" rx="5.5" fill="#DDE3E6"/><rect x="670" y="152" width="90" height="8" rx="4" fill="#AEB9C0"/>' +
      '<rect x="940" y="136" width="36" height="20" rx="10" fill="#8796A1"/>';
    out += lay(3, objX("feed", 1000, 150, 'data-show="today" data-at-campus="-160 20 1"', ph));

    // The posts, and the questions over them today.
    var posts = "";
    FEED.forEach(function (p, n) {
      var y = POST_Y + n * POST_STEP, cx = POST_X + 194, cy = y + 56;
      var a = p.to[0] - POST_S * cx, b = p.to[1] - POST_S * cy;
      posts += '<g class="mover post" pointer-events="none" data-at-campus="' + f(a) + " " + f(b) + " " + POST_S + '" data-delay="' + (n * 90) + '">' + post(POST_X, y, n, p.ic, p.kind) + "</g>";
    });
    var asks = "";
    [0, 2, 3].forEach(function (n, k) {
      asks += '<g class="ask a' + k + '">' + icon("ask", 1062, POST_Y + n * POST_STEP + 40, 1.15) + "</g>";
    });
    out += lay(4, posts + grp('data-show="today"', asks));

    return svg("Today: a phone shows a feed: a scholarship deadline, a dormitory without water, a lost ID, a storm notice, an organization recruiting, and a question about GIS, all in one column, with questions rising over them. With CAMPUS: each post flies to its own place on a drawn campus", out);
  }

  /* ============================================================
     Scene: one place, and the people who look after it (D-144, D-145)
     An organization's place on a board; its steward, a moderator, a
     peer guide, and members, among them a faculty member who joined.
     The steward's term ends: a cap, and the key passes on. Roles
     still open (Q-69) stand as dashed outlines.
     ============================================================ */
  function aPlace() {
    var out = lay(1, '<rect x="-1200" width="4000" height="1000" fill="url(#sky)"/><circle cx="1360" cy="260" r="260" fill="#E8EEE4" filter="url(#blur)"/>' +
      '<rect x="-1200" y="860" width="4000" height="140" fill="' + K.sand + '"/><rect x="-1200" y="852" width="4000" height="12" fill="#E2D9BE"/>');

    // The place, on a board: its header, its boards, and what is pinned there.
    var bd = piece('<rect x="634" y="560" width="16" height="300" fill="#B0A385"/><rect x="950" y="560" width="16" height="300" fill="#B0A385"/>' +
      '<rect x="500" y="100" width="600" height="470" rx="20" fill="#FFFFFF"/>') +
      '<rect x="500" y="100" width="600" height="92" rx="20" fill="' + K.red + '"/><rect x="500" y="160" width="600" height="32" fill="' + K.red + '"/>' +
      '<circle cx="556" cy="146" r="28" fill="#FFFFFF" opacity=".95"/>' + icon("megaphone", 556, 146, 0.8) +
      '<rect x="604" y="128" width="210" height="14" rx="7" fill="#FFFFFF" opacity=".9"/><rect x="604" y="154" width="130" height="10" rx="5" fill="#FFFFFF" opacity=".6"/>';
    ["pin", "ask", "book", "calendar"].forEach(function (ic, n) {
      var x = 530 + n * 140;
      bd += '<rect x="' + x + '" y="214" width="122" height="64" rx="14" fill="' + (n === 0 ? "#F3DED8" : "#F4F5F1") + '"/>' + icon(ic, x + 61, 246, 0.8);
    });
    [[300, 1, K.green], [404, 0, K.gold2], [500, 2, K.sea2]].forEach(function (r) {
      bd += '<rect x="530" y="' + r[0] + '" width="540" height="86" rx="12" fill="#FFFFFF" stroke="#E4E6DE" stroke-width="2"/>' +
        '<rect x="550" y="' + (r[0] + 18) + '" width="64" height="16" rx="8" fill="' + r[2] + '" opacity=".75"/>' +
        '<rect x="550" y="' + (r[0] + 46) + '" width="' + [380, 300, 340][r[1]] + '" height="10" rx="5" fill="#D9DCD2"/><rect x="550" y="' + (r[0] + 64) + '" width="' + [240, 280, 200][r[1]] + '" height="8" rx="4" fill="#E4E6DE"/>';
    });
    bd = bd.replace('<rect x="530" y="500" width="540" height="86"', '<rect x="530" y="500" width="540" height="56"');
    out += lay(2, obj("boards", 800, 90, bd));

    // Roles still open (Q-69): dashed outlines, with a question over each.
    var ghosts = "";
    [[200, 470], [370, 470]].forEach(function (g, n) {
      var x = g[0], b = g[1], k = 0.62;
      ghosts += '<g fill="none" stroke="' + K.ink3 + '" stroke-width="3" stroke-dasharray="7 6" opacity=".75">' +
        '<circle cx="' + x + '" cy="' + f(b - 314 * k) + '" r="' + f(42 * k) + '"/>' +
        '<rect x="' + f(x - 46 * k) + '" y="' + f(b - 262 * k) + '" width="' + f(92 * k) + '" height="' + f(164 * k) + '" rx="' + f(38 * k) + '"/>' +
        '<path d="M' + f(x - 18 * k) + " " + f(b - 98 * k) + "V" + f(b) + "M" + f(x + 18 * k) + " " + f(b - 98 * k) + "V" + f(b) + '"/></g>' +
        '<g class="ask a' + n + '">' + icon("ask", x, b - 314 * k - 72, 0.9) + "</g>";
    });
    out += lay(2, obj("more-roles", 285, 150, ghosts));

    // The people. A member's role at VSU (the faculty ID on a lanyard) is
    // not their role in the place (the pin on their chest).
    var base = 930, people = "";
    var fac = standPerson(560, base, 3, 0.98, "#6A5A8C") +
      '<path d="M' + (560 - 10) + " " + (base - 270) + "L" + (560 - 22) + " " + (base - 186) + "M" + (560 + 10) + " " + (base - 270) + "L" + (560 - 10) + " " + (base - 186) + '" stroke="' + K.sea2 + '" stroke-width="4"/>' +
      '<rect x="' + (560 - 34) + '" y="' + (base - 190) + '" width="34" height="44" rx="5" fill="#FFFFFF" stroke="' + K.sea2 + '" stroke-width="2"/><rect x="' + (560 - 28) + '" y="' + (base - 183) + '" width="12" height="14" rx="2" fill="' + K.green4 + '"/>' +
      badge("dot", 560 + 22, base - 212, 0.98);
    people += obj("faculty", 560, 600, fac);
    people += obj("moderator", 760, 600, standPerson(760, base, 0, 0.95, K.sea2) + badge("shield", 760 + 20, base - 212 * 0.95, 0.95));
    people += obj("peer-guide", 960, 600, standPerson(960, base, 1, 0.97, K.green2) + badge("star", 960 + 20, base - 212 * 0.97, 0.97));
    var hand = [1180 + 51, base - 120];
    var key = '<g class="key"><g transform="translate(' + hand[0] + " " + (hand[1] - 2) + ')"><circle cx="-2" cy="-16" r="11" fill="none" stroke="' + K.gold + '" stroke-width="5"/><rect x="-4.5" y="-6" width="5" height="34" rx="2.5" fill="' + K.gold + '"/><rect x="0" y="16" width="10" height="5" rx="2" fill="' + K.gold + '"/><rect x="0" y="24" width="7" height="4" rx="2" fill="' + K.gold + '"/></g></g>';
    var cap = '<g class="cap"><path d="M1180 ' + (base - 368) + 'l58 18l-58 18l-58-18Z" fill="' + K.ink + '"/><rect x="1150" y="' + (base - 352) + '" width="60" height="16" rx="4" fill="' + K.ink + '"/><path d="M1226 ' + (base - 346) + 'v30" stroke="' + K.gold + '" stroke-width="4"/><circle cx="1226" cy="' + (base - 314) + '" r="5" fill="' + K.gold + '"/></g>';
    people += obj("steward", 1180, 560, standPerson(1180, base, 1, 1.0, K.red) + badge("key", 1180 + 20, base - 212, 1.0) + cap + key);
    people += standPerson(1350, base, 2, 0.9, K.gold) + badge("dot", 1350 + 18, base - 212 * 0.9, 0.9);
    people += standPerson(1505, base, 0, 0.84, K.sea) + badge("dot", 1505 + 18, base - 212 * 0.84, 0.84);
    out += lay(3, people);

    return svg("An organization's place, drawn as a board with notices, questions, guides, and events; in front, its steward with a key, a moderator, a peer guide, and members, one of them a faculty member wearing a faculty ID; the steward's term ends and the key passes to the next officer; two dashed outlines stand for roles still to be decided", out);
  }

  root.CampusArt = { campus: campus, building: building, lab: lab, screen: screen, outside: outside, phone: phone, elsewhere: elsewhere, aPlace: aPlace };
})(typeof window !== "undefined" ? window : this);
