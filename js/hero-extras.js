/* Extras: magnetic links, 3D tilt cards */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  if (!finePointer || reduceMotion) return;

  /* ---- magnetic links: pull gently toward the cursor ---- */
  document.querySelectorAll(".contact-links a, .contact a").forEach(function (link) {
    link.classList.add("magnetic");
    link.addEventListener("mousemove", function (e) {
      var r = link.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      link.style.translate = dx * 0.25 + "px " + dy * 0.35 + "px";
    });
    link.addEventListener("mouseleave", function () {
      link.style.translate = "0px 0px";
    });
  });

  /* ---- focus cards: 3D tilt following the cursor ----
     Tilt uses `transform`; the hover lift uses `translate` in CSS, so the
     two compose instead of overwriting each other. */
  document.querySelectorAll(".focus-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(700px) rotateX(" + (-py * 6).toFixed(2) + "deg)" +
        " rotateY(" + (px * 8).toFixed(2) + "deg)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
})();
