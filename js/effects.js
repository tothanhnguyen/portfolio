/* Effects: scroll reveal, outline mask sync, hero parallax (mouse + scroll), footer year */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- keep the outline-word mask glued to the person cutout ----
     The outline copy of the wordmark is masked by the person image; the
     mask must sit exactly where the person renders, in the outline's own
     coordinate space. Re-synced on load/resize, during entrance
     animations, and on every parallax frame. */
  var personEl = document.querySelector(".person");
  var outlineEl = document.querySelector(".outline-word");
  function syncOutlineMask() {
    if (!personEl || !outlineEl) return;
    var p = personEl.getBoundingClientRect();
    var o = outlineEl.getBoundingClientRect();
    var pos = (p.left - o.left) + "px " + (p.top - o.top) + "px";
    var size = p.width + "px " + p.height + "px";
    outlineEl.style.webkitMaskPosition = outlineEl.style.maskPosition = pos;
    outlineEl.style.webkitMaskSize = outlineEl.style.maskSize = size;
  }
  syncOutlineMask();
  window.addEventListener("resize", syncOutlineMask);
  // entrance animations move both layers for ~3s — re-sync periodically, then stop
  var syncTicks = 0;
  var syncTimer = setInterval(function () {
    syncOutlineMask();
    if (++syncTicks >= 24) clearInterval(syncTimer); // 24 × 150ms ≈ 3.6s
  }, 150);

  /* ---- hero layer transforms: mouse parallax + scroll-out parallax ----
     Both write the same `translate` property from one place so they never
     fight. data-depth = mouse factor, data-scroll = scroll drift factor
     (higher drift = layer lingers longer while the page scrolls away). */
  var hero = document.querySelector(".hero");
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  if (hero && !reduceMotion) {
    var layers = hero.querySelectorAll("[data-depth]");
    var mx = 0, my = 0, curX = 0, curY = 0, drift = 0, heroH = 1, rafId = null;

    function apply() {
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.dataset.depth) || 0;
        var s = parseFloat(layer.dataset.scroll || depth);
        var x = -curX * depth * 34;
        var y = -curY * depth * 22 + drift * s;
        layer.style.translate = x + "px " + y + "px";
      });
      hero.style.opacity = Math.max(0, 1 - (drift / heroH) * 2.6);
      syncOutlineMask();
    }

    function tick() {
      curX += (mx - curX) * 0.08;
      curY += (my - curY) * 0.08;
      apply();
      if (Math.abs(mx - curX) > 0.001 || Math.abs(my - curY) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
    function kick() { if (rafId === null) rafId = requestAnimationFrame(tick); }

    /* both effects are desktop-only: on touch screens the drifting layers
       collide with in-flow content below (wordmark vs. meta list) */
    if (finePointer) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
        kick();
      });

      var scrollQueued = false;
      window.addEventListener("scroll", function () {
        if (scrollQueued) return;
        scrollQueued = true;
        requestAnimationFrame(function () {
          scrollQueued = false;
          heroH = hero.offsetHeight || 1;
          drift = Math.min(window.scrollY || 0, heroH) * 0.35;
          apply();
        });
      }, { passive: true });
    }
  }

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
