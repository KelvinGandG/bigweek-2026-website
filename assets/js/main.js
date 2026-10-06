(function () {
  "use strict";

  var cfg = window.BW_CONFIG || { links: {}, dates: {} };
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sales state ----------
     prereg  : pre-registration open (until 4 Oct 23:59)
     closed  : pre-reg closed, waiting for loyalty on-sale (8 Oct 10:00)
     loyalty : on sale to pre-registered customers (8 Oct 10:00 → 9 Oct 10:00)
     onsale  : on sale to the public
     Preview any state with ?state=closed etc. */
  function t(key) { return new Date(cfg.dates[key]).getTime(); }

  function currentState(now) {
    var forced = new URLSearchParams(location.search).get("state");
    if (forced) return forced;
    if (now <= t("preRegCloses")) return "prereg";
    if (now < t("loyaltyOnSale")) return "closed";
    if (now < t("publicOnSale")) return "loyalty";
    return "onsale";
  }

  var countdownTargets = {
    prereg: { key: "preRegCloses", label: "Pre-registration closes in" },
    closed: { key: "loyaltyOnSale", label: "Loyalty tickets on sale in" },
    loyalty: { key: "publicOnSale", label: "Public sale opens in" },
    onsale: { key: "festivalStart", label: "The Homecoming starts in" }
  };

  var state = currentState(Date.now());
  body.dataset.state = state;
  document.querySelectorAll("[data-show]").forEach(function (el) {
    el.hidden = el.dataset.show.split(" ").indexOf(state) === -1;
  });

  /* ---------- Links from config ----------
     Before sales open, every Howler button becomes a non-clickable "Coming soon". */
  var live = cfg.links.ticketsLive;
  var salesOpen = live === true ? true : live === false ? false : (state === "loyalty" || state === "onsale");
  body.classList.toggle("sales-open", salesOpen);
  var ticketHref = cfg.links.tickets || "tickets.html";
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.dataset.link;
    if (!salesOpen) {
      var soon = document.createElement("span");
      soon.className = el.className + (el.classList.contains("btn") ? " btn--soon" : " link--soon");
      soon.textContent = el.dataset.soon || "Coming soon";
      if (el.hasAttribute("data-show")) soon.setAttribute("data-show", el.getAttribute("data-show"));
      soon.hidden = el.hidden;
      soon.setAttribute("aria-disabled", "true");
      el.replaceWith(soon);
      return;
    }
    var href = key.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, cfg.links);
    if (!href && key !== "preRegister") href = cfg.links.tickets; // fall back to the main Howler page
    if (!href) return;
    el.href = href;
    if (/^https?:/.test(href)) { el.target = "_blank"; el.rel = "noopener"; }
  });

  /* ---------- Countdowns ----------
     [data-countdown]                 → follows the sales state (hero)
     [data-countdown-to="dateKey"]    → fixed target from config.dates */
  var forcedState = new URLSearchParams(location.search).get("state");
  var pad = function (n) { return String(n).padStart(2, "0"); };
  document.querySelectorAll("[data-countdown]").forEach(function (cd) {
    var fixed = cd.dataset.countdownTo;
    var target = fixed ? { key: fixed } : (countdownTargets[state] || countdownTargets.onsale);
    var end = t(target.key);
    if (!fixed) {
      var label = document.querySelector("[data-countdown-label]");
      if (label) label.textContent = target.label;
    }
    var parts = {
      d: cd.querySelector("[data-d]"), h: cd.querySelector("[data-h]"),
      m: cd.querySelector("[data-m]"), s: cd.querySelector("[data-s]")
    };
    var timer;
    var tick = function () {
      var diff = Math.max(0, end - Date.now());
      var sec = Math.floor(diff / 1000);
      parts.d.textContent = pad(Math.floor(sec / 86400));
      parts.h.textContent = pad(Math.floor((sec % 86400) / 3600));
      parts.m.textContent = pad(Math.floor((sec % 3600) / 60));
      parts.s.textContent = pad(sec % 60);
      if (diff === 0) {
        clearInterval(timer);
      }
    };
    timer = setInterval(tick, 1000);
    tick();
  });

  /* Switch-over: if a sale date passes while someone has a page open, refresh that page
     once so every button updates. Only dates still in the future on load are scheduled,
     so a page can never reload itself in a loop. */
  if (!forcedState) {
    var now0 = Date.now();
    var upcoming = ["preRegCloses", "loyaltyOnSale", "publicOnSale"]
      .map(t).filter(function (ts) { return ts > now0; });
    if (upcoming.length) {
      var wait = Math.min.apply(null, upcoming) - now0 + 1000;
      if (wait < 2147483647) setTimeout(function () { location.reload(); }, wait);
    }
  }

  /* Inline countdowns, e.g. "04d 19h 28m 12s" inside a button */
  var inline = document.querySelectorAll("[data-countdown-inline]");
  if (inline.length) {
    var tickInline = function () {
      inline.forEach(function (el) {
        var sec = Math.max(0, Math.floor((t(el.dataset.countdownInline) - Date.now()) / 1000));
        el.textContent = pad(Math.floor(sec / 86400)) + "d " + pad(Math.floor((sec % 86400) / 3600)) + "h " +
          pad(Math.floor((sec % 3600) / 60)) + "m " + pad(sec % 60) + "s";
      });
    };
    tickInline();
    setInterval(tickInline, 1000);
  }

  /* Highlight the key date that is live now */
  document.querySelectorAll("[data-keydate]").forEach(function (el) {
    if (el.dataset.keydate === state) el.classList.add("is-now");
  });

  /* ---------- Navigation ---------- */
  var nav = document.querySelector(".nav");
  var menu = document.querySelector(".mobile-menu");
  var toggle = document.querySelector(".nav__toggle");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Scroll: parallax + atmosphere ---------- */
  var sky = document.querySelector(".atmosphere__sky");
  var shade = document.querySelector(".atmosphere");
  var layers = document.querySelectorAll("[data-depth]");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var p = Math.min(1, y / vh);
    body.classList.toggle("is-scrolled", y > vh * 0.6);
    shade.style.setProperty("--shade", (p * 0.82).toFixed(3));
    if (!reduceMotion) {
      sky.style.transform = "scale(1.06) translate3d(0," + (y * -0.08).toFixed(1) + "px,0)";
      sky.style.filter = "blur(" + (p * 6).toFixed(1) + "px)";
      if (y < vh * 1.2) {
        layers.forEach(function (el) {
          el.style.translate = "0 " + (y * parseFloat(el.dataset.depth)).toFixed(1) + "px";
        });
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Chapter cards: tint the atmosphere orbs on hover ---------- */
  var orbA = document.querySelector(".orb--a");
  var orbB = document.querySelector(".orb--b");
  document.querySelectorAll(".chapter").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      var c = getComputedStyle(card).getPropertyValue("--c");
      orbA.style.background = c; orbB.style.background = c;
    });
    card.addEventListener("mouseleave", function () {
      orbA.style.background = ""; orbB.style.background = "";
    });
  });

  /* ---------- Chapters page: active chapter tints the sky + sub-nav ---------- */
  var nights = document.querySelectorAll("[data-chapter]");
  if (nights.length && "IntersectionObserver" in window) {
    var links = {};
    document.querySelectorAll("[data-subnav]").forEach(function (a) { links[a.dataset.subnav] = a; });
    var setActive = function (el) {
      var c = getComputedStyle(el).getPropertyValue("--c");
      orbA.style.background = c; orbB.style.background = c;
      Object.keys(links).forEach(function (k) { links[k].classList.toggle("is-active", k === el.dataset.chapter); });
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    nights.forEach(function (n) { cio.observe(n); });
  }

  /* ---------- Lineup (names in config.lineup.nights) ---------- */
  var lu = cfg.lineup;
  if (lu) {
    var esc = function (str) {
      return String(str).replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
      });
    };
    var slot = function (text, idx, cls) {
      return '<div class="slot' + (cls ? " slot--" + cls : "") + '">' + text + "<small>" + String(idx).padStart(2, "0") + "</small></div>";
    };
    var renderNight = function (slug) {
      var names = (lu.nights && lu.nights[slug]) || [];
      var html = names.map(function (nm, i) { return slot(esc(nm), i + 1, "name"); }).join("");
      for (var k = names.length; k < 3; k++) html += slot("Coming soon", k + 1, "");
      if (names.length >= 3 && !lu.complete) html += slot("More to be announced", names.length + 1, "more");
      return html;
    };
    var total = 0;
    Object.keys(lu.nights || {}).forEach(function (k) { total += lu.nights[k].length; });

    document.querySelectorAll("[data-lineup-night], [data-lineup-teaser]").forEach(function (box) {
      box.innerHTML = renderNight(box.dataset.lineupNight || box.dataset.lineupTeaser);
    });
    document.querySelectorAll("[data-lineup-status]").forEach(function (el) {
      var slug = el.dataset.lineupStatus;
      var n = slug ? ((lu.nights && lu.nights[slug]) || []).length : total;
      el.textContent = lu.complete ? "Out now" : n ? "More coming soon" : "Coming soon";
    });
  }

  /* ---------- Partners page: brand gallery ---------- */
  var pg = document.querySelector("[data-partner-gallery]");
  var brands = (cfg.partnerGallery || []).filter(function (b) { return b.photos && b.photos.length; });
  if (pg && brands.length) {
    var escG = function (str) {
      return String(str).replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
      });
    };
    var DIR = "assets/img/partners/";
    var arrowSvg = function (dir) {
      return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="' +
        (dir < 0 ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5") + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    };
    pg.innerHTML =
      '<div class="ptabs" role="tablist" aria-label="Partner brands">' +
      brands.map(function (b, i) {
        return '<button class="ptab" role="tab" type="button" aria-selected="' + (i === 0) + '" data-i="' + i + '">' +
          escG(b.brand) + "<small>" + b.photos.length + "</small></button>";
      }).join("") + "</div>" +
      '<div class="prow-wrap"><div class="prow" tabindex="0" aria-live="polite"></div>' +
      '<button class="prow__nav prow__nav--prev" type="button" aria-label="Previous photos">' + arrowSvg(-1) + "</button>" +
      '<button class="prow__nav prow__nav--next" type="button" aria-label="Next photos">' + arrowSvg(1) + "</button></div>";

    var row = pg.querySelector(".prow");
    var current = 0;
    var show = function (i) {
      current = i;
      var b = brands[i], tag = "BIG WEEK x " + escG(b.brand);
      row.innerHTML = b.photos.map(function (ph, k) {
        return '<button class="pcard" type="button" data-k="' + k + '" style="aspect-ratio:' + ph[2] + "/" + ph[3] + '">' +
          '<img src="' + DIR + ph[1] + '" alt="' + tag + ", photo " + (k + 1) + '" width="' + ph[2] + '" height="' + ph[3] + '" loading="' + (k < 4 ? "eager" : "lazy") + '">' +
          '<span class="pgallery__tag">' + tag + "</span></button>";
      }).join("");
      row.scrollLeft = 0;
      pg.querySelectorAll(".ptab").forEach(function (t) { t.setAttribute("aria-selected", String(+t.dataset.i === i)); });
    };
    pg.querySelectorAll(".ptab").forEach(function (t) {
      t.addEventListener("click", function () { show(+t.dataset.i); });
    });
    pg.querySelector(".prow__nav--prev").addEventListener("click", function () { row.scrollBy({ left: -row.clientWidth * 0.8, behavior: "smooth" }); });
    pg.querySelector(".prow__nav--next").addEventListener("click", function () { row.scrollBy({ left: row.clientWidth * 0.8, behavior: "smooth" }); });
    show(0);

    /* lightbox */
    var lb = document.createElement("dialog");
    lb.className = "lightbox";
    lb.innerHTML = '<figure><img alt=""><figcaption class="pgallery__tag"></figcaption></figure>' +
      '<button class="lightbox__close" type="button" aria-label="Close">✕</button>' +
      '<button class="prow__nav prow__nav--prev" type="button" aria-label="Previous photo">' + arrowSvg(-1) + "</button>" +
      '<button class="prow__nav prow__nav--next" type="button" aria-label="Next photo">' + arrowSvg(1) + "</button>";
    document.body.appendChild(lb);
    var lbK = 0;
    var lbShow = function (k) {
      var ph = brands[current].photos;
      lbK = (k + ph.length) % ph.length;
      var img = lb.querySelector("img");
      img.src = DIR + ph[lbK][0];
      img.alt = "BIG WEEK x " + brands[current].brand + ", photo " + (lbK + 1);
      lb.querySelector("figcaption").textContent = "BIG WEEK x " + brands[current].brand + "  ·  " + (lbK + 1) + " / " + ph.length;
    };
    row.addEventListener("click", function (e) {
      var card = e.target.closest(".pcard");
      if (!card) return;
      lbShow(+card.dataset.k);
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    });
    lb.querySelector(".lightbox__close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".prow__nav--prev").addEventListener("click", function () { lbShow(lbK - 1); });
    lb.querySelector(".prow__nav--next").addEventListener("click", function () { lbShow(lbK + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") lbShow(lbK - 1);
      if (e.key === "ArrowRight") lbShow(lbK + 1);
    });

    document.querySelector("[data-partner-gallery-section]").hidden = false;
  }

  /* ---------- Partners page: enquiry form → email ---------- */
  var form = document.querySelector("[data-enquiry]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".enquire__status");
      var bad = Array.prototype.filter.call(form.querySelectorAll("[required]"), function (f) { return !f.value.trim(); });
      form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("is-invalid"); });
      var email = form.elements.email;
      if (email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) bad.push(email);
      if (bad.length) {
        bad.forEach(function (f) { f.closest(".field").classList.add("is-invalid"); });
        status.textContent = "Please fill in your name, brand and a valid email.";
        bad[0].focus();
        return;
      }
      var v = function (n) { return form.elements[n].value.trim(); };
      var subject = "BIG WEEK 2026 partnership enquiry — " + v("company");
      var body = [
        "Name: " + v("name"),
        "Brand / company: " + v("company"),
        "Email: " + v("email"),
        "Phone: " + (v("phone") || "—"),
        "Interested in: " + v("interest"),
        "",
        v("message")
      ].join("\n");
      window.location.href = "mailto:" + ((cfg.contact && cfg.contact.email) || "info@gandgpro.com") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "Your email app should open with your enquiry ready to send.";
    });
  }

  /* ---------- Floating 3D gold elements ----------
     [section selector, element, desktop placement, mobile placement or null]
     placement: l/r (left/right %), t (top %), w (width px), z ("b" = behind glass, "f" = in front),
                d (parallax depth; + drifts down, − drifts up), r (rotation deg) */
  var FLOAT = {
    "index.html": [
      [".hero", "cross", { r: 3, t: 11, w: 150, z: "b", d: -0.14, r0: -8 }, null],
      [".hero", "dots", { l: 43, t: 72, w: 86, z: "f", d: 0.16, r0: 6 }, null],
      [".hero", "triangle-scribble", { l: 3, t: 86, w: 190, z: "f", d: 0.1, r0: -4 }, null],
      ["#story", "circles", { l: -4, t: 16, w: 230, z: "b", d: -0.1, r0: 8 }, { l: -12, t: 22, w: 100 }],
      ["#story", "triangle", { r: 3, t: 56, w: 140, z: "b", d: 0.1, r0: 12 }, null],
      ["#chapters", "square", { r: 4, t: -5, w: 190, z: "b", d: -0.08, r0: -6 }, { r: 0, t: -2, w: 96 }],
      ["#pre-register", "cross", { l: 1, t: 6, w: 170, z: "b", d: -0.12, r0: 14 }, { l: -6, t: 4, w: 96 }],
      ["#pre-register", "arrow", { r: 2, t: 58, w: 120, z: "f", d: 0.14, r0: -10 }, null],
      ["#tickets", "path-dots", { r: -2, t: 34, w: 200, z: "b", d: -0.08, r0: -6 }, null],
      ["#lineup", "dots", { r: 6, t: 0, w: 104, z: "b", d: 0.12, r0: -8 }, { r: 2, t: 1, w: 70 }],
      [".statement", "circles", { l: 9, t: -8, w: 170, z: "b", d: 0.12, r0: -10 }, null],
      [".statement", "triangle", { r: 10, t: -6, w: 130, z: "b", d: -0.1, r0: 16 }, null],
      ["#partners", "arrow", { r: 3, t: -8, w: 110, z: "b", d: 0.1, r0: 18 }, null]
    ],
    "chapters.html": [
      [".cintro", "circles", { r: 12, t: 18, w: 260, z: "b", d: -0.16, r0: 6 }, { r: -6, t: 14, w: 104 }],
      [".cintro", "cross", { r: 25, t: 60, w: 110, z: "f", d: 0.12, r0: -12 }, null],
      [".cintro", "dots", { r: 4, t: 62, w: 88, z: "f", d: 0.18, r0: 8 }, null],
      ["#yanoz-club", "triangle", { r: -1, t: 8, w: 140, z: "b", d: -0.1, r0: 10 }, null],
      ["#shimza", "arrow", { l: -1, t: 12, w: 120, z: "b", d: 0.1, r0: -14 }, null],
      ["#aklalwa-ekhaya", "square", { r: -1, t: 72, w: 160, z: "b", d: -0.08, r0: 8 }, null],
      ["#maziwe-ke", "path-dots", { l: 0, t: 84, w: 200, z: "b", d: 0.1, r0: -5 }, null],
      ["#big-pass", "cross", { r: 6, t: 2, w: 130, z: "b", d: -0.1, r0: 12 }, { r: -4, t: 4, w: 80 }]
    ],
    "lineup.html": [
      [".cintro", "square", { r: 12, t: 22, w: 240, z: "b", d: -0.14, r0: -8 }, { r: -6, t: 14, w: 104 }],
      [".cintro", "triangle-scribble", { r: 36, t: 64, w: 200, z: "f", d: 0.12, r0: 4 }, null],
      [".cintro", "dots", { r: 4, t: 12, w: 88, z: "f", d: 0.16, r0: -6 }, null],
      ["#secure", "circles", { l: 1, t: 8, w: 200, z: "b", d: -0.1, r0: 10 }, { l: -8, t: 4, w: 96 }],
      ["#secure", "cross", { r: 2, t: 56, w: 130, z: "b", d: 0.12, r0: -12 }, null]
    ],
    "tickets.html": [
      [".cintro", "cross", { r: 10, t: 16, w: 220, z: "b", d: -0.14, r0: 10 }, { r: -6, t: 14, w: 100 }],
      [".cintro", "dots", { r: 31, t: 10, w: 90, z: "f", d: 0.16, r0: -8 }, null],
      [".cintro", "triangle", { r: 4, t: 58, w: 150, z: "f", d: 0.1, r0: 14 }, null],
      ["[aria-label='Ticket types']", "arrow", { l: -1, t: 22, w: 130, z: "b", d: 0.1, r0: -12 }, null],
      ["[aria-label='Ticket types']", "path-dots", { r: -1, t: 46, w: 220, z: "b", d: -0.08, r0: 6 }, null],
      ["#secure", "circles", { r: 2, t: 4, w: 200, z: "b", d: -0.1, r0: -8 }, { r: -8, t: 4, w: 96 }]
    ],
    "info.html": [
      [".cintro", "circles", { r: 9, t: 6, w: 240, z: "b", d: -0.14, r0: 8 }, { r: -6, t: 14, w: 104 }],
      [".cintro", "triangle-scribble", { r: 30, t: 62, w: 210, z: "f", d: 0.12, r0: -4 }, null],
      [".cintro", "cross", { r: 3, t: 64, w: 110, z: "f", d: 0.16, r0: 12 }, null],
      ["#faq", "dots", { l: 3, t: 34, w: 104, z: "b", d: 0.12, r0: -8 }, null],
      ["#faq", "square", { l: 2, t: 64, w: 170, z: "b", d: -0.08, r0: 6 }, null],
      ["[aria-labelledby='contact-title']", "triangle", { r: 3, t: -6, w: 140, z: "b", d: 0.1, r0: 14 }, { r: -4, t: 0, w: 80 }]
    ],
    "partners.html": [
      [".cintro", "square", { r: 8, t: 8, w: 250, z: "b", d: -0.14, r0: -6 }, { r: -6, t: 10, w: 100 }],
      [".cintro", "dots", { r: 30, t: 32, w: 90, z: "f", d: 0.16, r0: 8 }, null],
      [".cintro", "arrow", { r: 4, t: 62, w: 130, z: "f", d: 0.1, r0: -14 }, null],
      ["[aria-label='Title partner']", "cross", { r: 2, t: -40, w: 120, z: "b", d: -0.1, r0: 10 }, null],
      ["#enquire", "circles", { l: -2, t: 14, w: 220, z: "b", d: -0.1, r0: -8 }, { l: -10, t: 3, w: 100 }],
      ["#enquire", "triangle", { r: -1, t: 72, w: 140, z: "b", d: 0.12, r0: 12 }, null]
    ]
  };
  var pageKey = (location.pathname.split("/").pop() || "index.html");
  var floaters = [];
  var mqMobile = window.matchMedia("(max-width: 760px)");
  var mqTablet = window.matchMedia("(max-width: 1100px)");
  (FLOAT[pageKey] || []).forEach(function (f, i) {
    var host = document.querySelector(f[0]);
    if (!host) return;
    host.classList.add("has-floaters");
    var el = document.createElement("span");
    el.className = "floater floater--" + (f[2].z === "f" ? "front" : "back");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<img src="assets/img/elements/' + f[1] + '.webp" alt="" loading="lazy" decoding="async">';
    el.style.setProperty("--fr", (f[2].r0 || 0) + "deg");
    el.style.setProperty("--fdur", (7 + (i % 5) * 1.3).toFixed(1) + "s");
    el.style.setProperty("--fdel", (-(i % 4) * 1.7).toFixed(1) + "s");
    host.insertBefore(el, host.firstChild);
    floaters.push({ el: el, img: el.firstChild, desk: f[2], mob: f[3] });
  });
  var placeFloaters = function () {
    var mobile = mqMobile.matches, scale = mqTablet.matches ? 0.75 : 1;
    floaters.forEach(function (o) {
      var p = mobile ? o.mob : o.desk;
      o.el.hidden = !p;
      if (!p) return;
      var w = mobile ? p.w : p.w * scale;
      o.el.style.width = w + "px";
      o.el.style.top = p.t + "%";
      o.el.style.left = p.l != null ? p.l + "%" : "auto";
      o.el.style.right = p.r != null ? p.r + "%" : "auto";
    });
  };
  placeFloaters();
  mqMobile.addEventListener("change", placeFloaters);
  mqTablet.addEventListener("change", placeFloaters);
  var floatParallax = function () {
    if (reduceMotion || !floaters.length) return;
    var vh = window.innerHeight;
    floaters.forEach(function (o) {
      if (o.el.hidden) return;
      var r = o.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var off = (r.top + r.height / 2 - vh / 2) * o.desk.d;
      o.img.style.translate = "0 " + off.toFixed(1) + "px";
    });
  };
  var fTick = false;
  window.addEventListener("scroll", function () {
    if (!fTick) { fTick = true; requestAnimationFrame(function () { floatParallax(); fTick = false; }); }
  }, { passive: true });
  floatParallax();

  /* Footer year */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
