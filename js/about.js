/* About — SELF / FRAGMENT scene controller.
   Contract: IO activates the scene; a passive scroll listener queues at
   most one RAF while active; geometry is cached and invalidated by
   resize/ResizeObserver/fonts; reduced motion (including mid-session
   changes) falls back to the static composition. Pure function of
   progress — scrolling back reverses exactly, nothing accumulates. */
(function () {
  "use strict";

  var scene = document.querySelector("[data-scene]");
  if (!scene) return;

  var runway = scene.querySelector(".scene-runway");
  var stage = scene.querySelector(".scene-stage");
  if (!runway || !stage) return;

  var frags = Array.prototype.slice.call(scene.querySelectorAll(".frag"));
  var word = scene.querySelector(".frag-word");
  var line = scene.querySelector(".scene-line");
  var labels = Array.prototype.slice.call(scene.querySelectorAll(".scene-label")).map(function (el) {
    return { el: el, at: parseFloat(el.dataset.at) || 0.2 };
  });

  var mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqlMobile = window.matchMedia("(max-width: 760px)");

  /* per-fragment keyframes: [progress, tx, ty, rotate(°)]
     face fragment (frag--1) moves least; separation peaks at ~0.5 and the
     pieces are exactly back at 0.88 — reconstruction before Practice */
  var FRAG_KEYS = {
    1: [[0, 0, 0, 0], [0.12, 0, 0, 0], [0.5, -3, -12, -0.6], [0.88, 0, 0, 0], [1, 0, 0, 0]],
    2: [[0, 0, 0, 0], [0.12, 0, 0, 0], [0.5, -86, 24, -2.2], [0.88, 0, 0, 0], [1, 0, 0, 0]],
    3: [[0, 0, 0, 0], [0.12, 0, 0, 0], [0.5, 94, 18, 1.8], [0.88, 0, 0, 0], [1, 0, 0, 0]],
    4: [[0, 0, 0, 0], [0.12, 0, 0, 0], [0.5, 0, 110, 0.6], [0.88, 0, 0, 0], [1, 0, 0, 0]],
    5: [[0, 0, 0, 0], [0.12, 0, 0, 0], [0.5, -14, 198, -0.5], [0.88, 0, 0, 0], [1, 0, 0, 0]]
  };
  /* typography fragment: [progress, tx, ty, opacity] — dips while the
     pieces separate, returns strong as reconstruction completes */
  var WORD_KEYS = [[0, 0, 0, 1], [0.3, -52, 12, 0.22], [0.6, -52, 12, 0.22], [0.9, 0, 0, 1], [1, 0, 0, 1]];
  /* scene-line: [progress, opacity, ty] — the connecting sentence */
  var LINE_KEYS = [[0, 0, 18], [0.6, 0, 18], [0.76, 1, 0], [0.9, 1, 0], [1, 0, -10]];

  var motionOK = !mqlReduce.matches;
  var enabled = false, active = false;
  var rafId = null, lastP = -1;
  var geo = { top: 0, max: 1, scale: 1 };

  function smooth(t) { return t * t * (3 - 2 * t); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* piecewise linear between keyframes, eased with smoothstep */
  function track(keys, p) {
    if (p <= keys[0][0]) return keys[0].slice(1);
    for (var i = 0; i < keys.length - 1; i++) {
      var a = keys[i], b = keys[i + 1];
      if (p >= a[0] && p <= b[0]) {
        var span = b[0] - a[0];
        var t = span === 0 ? 0 : smooth((p - a[0]) / span);
        var out = [];
        for (var j = 1; j < a.length; j++) out.push(a[j] + (b[j] - a[j]) * t);
        return out;
      }
    }
    return keys[keys.length - 1].slice(1);
  }

  function scrollY() { return window.scrollY || window.pageYOffset || 0; }

  function measure() {
    var rect = runway.getBoundingClientRect();
    geo.top = rect.top + scrollY();
    geo.max = Math.max(rect.height - window.innerHeight, 1);
    /* tablet: roughly half the travel, rotation ≤ ~2° */
    geo.scale = window.innerWidth <= 1024 ? 0.55 : 1;
  }

  function render(p) {
    frags.forEach(function (frag) {
      var n = frag.getAttribute("class").match(/frag--(\d)/);
      var keys = n && FRAG_KEYS[n[1]];
      if (!keys) return;
      var v = track(keys, p);
      frag.style.setProperty("--tx", (v[0] * geo.scale).toFixed(2) + "px");
      frag.style.setProperty("--ty", (v[1] * geo.scale).toFixed(2) + "px");
      frag.style.setProperty("--tr", (v[2] * geo.scale).toFixed(3) + "deg");
    });

    if (word) {
      var w = track(WORD_KEYS, p);
      word.style.setProperty("--tx", (w[0] * geo.scale * 0.6).toFixed(2) + "px");
      word.style.setProperty("--ty", (w[1] * geo.scale * 0.6).toFixed(2) + "px");
      word.style.setProperty("--o", clamp01(w[2]).toFixed(3));
    }

    labels.forEach(function (label) {
      var fadeIn = smooth(clamp01((p - label.at) / 0.14));
      var fadeOut = 1 - smooth(clamp01((p - 0.86) / 0.13));
      var o = fadeIn * fadeOut;
      label.el.style.setProperty("--o", o.toFixed(3));
      label.el.style.setProperty("--ty", ((1 - fadeIn) * 18).toFixed(2) + "px");
    });

    var lv = track(LINE_KEYS, p);
    line.style.setProperty("--o", clamp01(lv[0]).toFixed(3));
    line.style.setProperty("--ty", lv[1].toFixed(2) + "px");
  }

  function update() {
    rafId = null;
    var p = clamp01((scrollY() - geo.top) / geo.max);
    if (p === lastP) return;
    lastP = p;
    render(p);
  }
  function queue() { if (rafId === null && enabled && active) rafId = requestAnimationFrame(update); }

  function clearInline() {
    frags.concat(labels.map(function (l) { return l.el; }))
      .concat(word ? [word] : [])
      .concat(line ? [line] : [])
      .forEach(function (el) {
        el.style.removeProperty("--tx");
        el.style.removeProperty("--ty");
        el.style.removeProperty("--tr");
        el.style.removeProperty("--o");
      });
  }

  function enable() {
    scene.setAttribute("data-motion", "on");
    scene.classList.add("scene--live");
    enabled = true;
    measure();
    lastP = -1;
    queue(); // initial frame uses the current scroll position (hash/restore safe)
  }

  function disable() {
    scene.classList.remove("scene--live");
    scene.setAttribute("data-motion", "off");
    enabled = false;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    clearInline(); // back to the static, readable composition
    lastP = -1;
  }

  function reevaluate() {
    var gates = motionOK &&
      "IntersectionObserver" in window &&
      !mqlMobile.matches &&
      window.innerHeight >= 620;
    if (gates && !enabled) enable();
    else if (!gates && enabled) disable();
    else if (enabled) { measure(); queue(); }
  }

  reevaluate();

  if ("IntersectionObserver" in window) {
    var sceneIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        active = entry.isIntersecting;
        /* will-change only while the scene is actually on screen */
        scene.classList.toggle("scene--live", enabled && active);
        if (active) queue();
        else if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      });
    }, { rootMargin: "25% 0px 25% 0px" });
    sceneIO.observe(runway);
  }

  var resizeQueued = false;
  window.addEventListener("resize", function () {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(function () {
      resizeQueued = false;
      reevaluate();
    });
  });
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      if (!enabled) return;
      measure();
      queue();
    }).observe(runway);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (!enabled) return;
      measure();
      queue();
    }, function () { /* fonts failed — geometry still valid */ });
  }
  if (mqlMobile.addEventListener) {
    mqlMobile.addEventListener("change", reevaluate);
  } else if (mqlMobile.addListener) {
    mqlMobile.addListener(reevaluate);
  }

  function onMotionChange(fn) {
    if (mqlReduce.addEventListener) mqlReduce.addEventListener("change", fn);
    else if (mqlReduce.addListener) mqlReduce.addListener(fn);
  }
  onMotionChange(function (e) {
    motionOK = !e.matches;
    reevaluate();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    } else {
      queue();
    }
  });

  window.addEventListener("scroll", function () {
    if (!enabled || !active) return;
    queue(); // at most one RAF outstanding
  }, { passive: true });
})();
