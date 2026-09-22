/* Effects: progressive reveal, shared motion preference, hero motion
   lifecycle (IO-gated, one RAF scheduler), outline mask sync, footer year.
   No framework — plain DOM + rAF, structured for cheap idle. */
(function () {
  "use strict";

  var root = document.documentElement;
  var mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function onMotionChange(fn) {
    if (mqlReduce.addEventListener) mqlReduce.addEventListener("change", fn);
    else if (mqlReduce.addListener) mqlReduce.addListener(fn);
  }

  /* ============ opening curtain (home) ============
     The inline body script injects the ink panel and `html.curtain-active`,
     which pauses every hero entrance animation at its first frame
     (hero.css). We lift it on a fixed clock: the class comes off as the
     panel starts rising, so the hero entrance plays through the lift,
     then the panel leaves the DOM. The inline script's own 2.6s timeout
     clears everything if this file never runs. */
  var liftCurtain = null;
  var curtainEl = document.querySelector(".curtain");
  if (curtainEl && root.classList.contains("curtain-active")) {
    var curtainLifted = false;
    liftCurtain = function () {
      if (curtainLifted) return;
      curtainLifted = true;
      root.classList.remove("curtain-active");
      curtainEl.classList.add("lift");
      setTimeout(function () {
        if (curtainEl.parentNode) curtainEl.parentNode.removeChild(curtainEl);
      }, 850);
    };
    setTimeout(liftCurtain, Math.max(0, 620 - performance.now()));
  }

  /* ============ reveal on scroll (progressive enhancement) ============
     Default state in CSS/HTML: visible. The head inline script adds .js;
     the controller adds .reveal-ready to <html> only after successful
     initialization — the CSS hidden state keys on both, so a failed load
     or a thrown error leaves every [data-reveal] readable. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var groupEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal-group]"));
  var revealIO = null;

  /* Set each group's child index once; the shared reveal observer below
     applies visibility per row, while CSS uses --i for the stagger delay. */
  groupEls.forEach(function (group) {
    var kids = [];
    for (var i = 0; i < group.children.length; i++) {
      if (group.children[i].hasAttribute("data-reveal")) kids.push(group.children[i]);
    }
    kids.forEach(function (kid, i) {
      kid.style.setProperty("--i", String(Math.min(i, 5)));
    });
  });

  function showAllReveals() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window) || mqlReduce.matches) { showAllReveals(); return; }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        revealIO.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
    root.classList.add("reveal-ready");
  }

  try { initReveal(); } catch (err) { root.classList.remove("js", "reveal-ready"); showAllReveals(); }

  onMotionChange(function (e) {
    if (e.matches) { // user switched to reduce mid-session
      if (revealIO) { revealIO.disconnect(); revealIO = null; }
      showAllReveals();
      if (liftCurtain) liftCurtain();
    }
  });

  /* ============ hero-only motion ============
     Runs only on routes that have a hero. IntersectionObserver gates all
     work: when the hero leaves the viewport there are no layout reads,
     no mask writes, no scheduled frames. Mouse parallax and scroll drift
     share a single RAF scheduler. */
  var hero = document.querySelector(".hero");
  if (hero) (function () {
    var person = hero.querySelector(".person");
    var outline = hero.querySelector(".outline-word");
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    // parse depth coefficients once, not per frame
    var layers = Array.prototype.map.call(hero.querySelectorAll("[data-depth]"), function (el) {
      return {
        el: el,
        depth: parseFloat(el.dataset.depth) || 0,
        scroll: parseFloat(el.dataset.scroll || el.dataset.depth) || 0
      };
    });

    var motionOK = !mqlReduce.matches;
    var heroVisible = true;
    var mx = 0, my = 0, curX = 0, curY = 0;
    var drift = 0, heroH = hero.offsetHeight || 1;
    var rafId = null;

    /* ---- outline mask sync ---- */
    function syncMask() {
      if (!person || !outline) return;
      var p = person.getBoundingClientRect();
      var o = outline.getBoundingClientRect();
      var pos = (p.left - o.left) + "px " + (p.top - o.top) + "px";
      var size = p.width + "px " + p.height + "px";
      outline.style.webkitMaskPosition = outline.style.maskPosition = pos;
      outline.style.webkitMaskSize = outline.style.maskSize = size;
    }
    syncMask();

    // image decode + fonts can shift the person's rendered rect late
    if (person && person.decode) person.decode().then(syncMask, syncMask);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncMask, syncMask);

    /* entrance animations move both layers for ~3s: re-sync on a
       throttled, finite loop (~10Hz), pausable when the hero goes
       offscreen, and guaranteed to stop when the entrance ends */
    var ENTRANCE_MS = 3400;
    var entranceStartedAt = -1, entranceRAF = null, lastSync = 0;
    function entranceLoop(now) {
      entranceRAF = null;
      if (now - lastSync > 90) { lastSync = now; syncMask(); }
      if (now - entranceStartedAt < ENTRANCE_MS) entranceRAF = requestAnimationFrame(entranceLoop);
    }
    function startEntrance() {
      if (entranceRAF !== null || mqlReduce.matches) return;
      if (entranceStartedAt < 0) entranceStartedAt = performance.now();
      if (performance.now() - entranceStartedAt < ENTRANCE_MS) {
        entranceRAF = requestAnimationFrame(entranceLoop);
      }
    }
    function stopEntrance() {
      if (entranceRAF !== null) { cancelAnimationFrame(entranceRAF); entranceRAF = null; }
    }
    if (!mqlReduce.matches) startEntrance();

    var resizeQueued = false;
    window.addEventListener("resize", function () {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(function () {
        resizeQueued = false;
        heroH = hero.offsetHeight || 1;
        syncMask();
      });
    });

    /* ---- one RAF scheduler for mouse + scroll ---- */
    function frame() {
      rafId = null;
      if (!heroVisible || !motionOK) return;
      curX += (mx - curX) * 0.08;
      curY += (my - curY) * 0.08;
      render();
      if (Math.abs(mx - curX) > 0.001 || Math.abs(my - curY) > 0.001) {
        rafId = requestAnimationFrame(frame); // eased motion only — finite
      }
    }
    function kick() { if (rafId === null && heroVisible && motionOK) rafId = requestAnimationFrame(frame); }

    function render() {
      layers.forEach(function (layer) {
        var x = -curX * layer.depth * 34;
        var y = -curY * layer.depth * 22 + drift * layer.scroll;
        layer.el.style.translate = x + "px " + y + "px";
      });
      hero.style.opacity = Math.max(0, 1 - (drift / heroH) * 2.6);
      syncMask();
    }

    if (finePointer) {
      hero.addEventListener("mousemove", function (e) {
        if (!motionOK) return;
        var r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
        kick();
      });
      // pointer leaves: ease offsets back to neutral with the same finite loop
      hero.addEventListener("mouseleave", function () { mx = 0; my = 0; kick(); });
    }

    function applyDrift() {
      drift = Math.min(window.scrollY || 0, heroH) * 0.35;
    }

    /* scroll drift — one passive listener, queued through the scheduler.
       Desktop-only like mouse parallax: on touch screens the drifting
       layers collide with the in-flow content below the hero. */
    if (finePointer) {
      window.addEventListener("scroll", function () {
        if (!heroVisible || !motionOK) return;
        applyDrift();
        kick();
      }, { passive: true });
    }

    /* IO gate: no scroll reads/writes while the hero is offscreen */
    if ("IntersectionObserver" in window) {
      var heroIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          heroVisible = entry.isIntersecting;
          if (heroVisible) {
            heroH = hero.offsetHeight || 1;
            applyDrift();
            startEntrance(); // resume the bounded entrance sync if still in window
            kick();
          } else {
            stopEntrance();
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
          }
        });
      }, { threshold: 0 });
      heroIO.observe(hero);
    } else {
      heroH = hero.offsetHeight || 1;
      applyDrift();
    }

    /* ---- motion preference switched mid-session: reset everything ---- */
    onMotionChange(function (e) {
      motionOK = !e.matches;
      if (!motionOK) {
        stopEntrance();
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        layers.forEach(function (layer) { layer.el.style.translate = ""; });
        hero.style.opacity = "";
        curX = curY = mx = my = drift = 0;
        syncMask();
      } else {
        heroH = hero.offsetHeight || 1;
        startEntrance(); // motion is back: re-sync the mask through the entrance window
        kick();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        stopEntrance();
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      } else if (heroVisible && motionOK) {
        startEntrance();
        kick();
      }
    });
  })();

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
