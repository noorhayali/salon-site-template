// Renders the page from the SALON config (salon.js) and drives the animations.
// Only transform and opacity are ever animated.
(function () {
  var s = SALON;
  var d = document;
  var $ = function (id) { return d.getElementById(id); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var digits = s.phone.replace(/[^\d+]/g, "");

  // Bare file names are looked up in /media; anything with a path or URL is used as-is.
  function media(p) {
    p = String(p || "").trim();
    return /\/|^[a-z]+:/i.test(p) ? p : "media/" + p;
  }
  function el(tag, cls, text) {
    var n = d.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Basics ---------- */
  d.title = s.name + " — " + s.tagline;
  d.documentElement.style.setProperty("--accent", s.accent);

  if (s.demoBanner) {
    $("banner").textContent = s.demoBanner;
    $("banner").hidden = false;
  }
  $("brand").textContent = s.name;
  $("hero-name").textContent = s.name;
  $("hero-tagline").textContent = s.tagline;

  d.querySelectorAll(".book-link").forEach(function (a) {
    if (s.bookingLink) { a.href = s.bookingLink; a.target = "_blank"; a.rel = "noopener"; }
    else { a.href = "tel:" + digits; }
  });

  /* ---------- About: statement lights up word by word ---------- */
  var aboutEl = $("about-text");
  (s.about || "").split(/\s+/).forEach(function (w, i, all) {
    var span = el("span", "word reveal", w);
    span.style.setProperty("--d", Math.min(i, 24) * 0.03 + "s");
    aboutEl.appendChild(span);
    if (i < all.length - 1) aboutEl.appendChild(d.createTextNode(" "));
  });

  /* ---------- Services ---------- */
  var ICONS = {
    polish: '<rect class="f" x="14" y="20" width="20" height="22" rx="7"/><rect x="20" y="12" width="8" height="8"/><rect class="f" x="18" y="4" width="12" height="9" rx="3"/>',
    gel: '<path class="f" d="M7 31C7 17 15 10 24 10s17 7 17 21Z"/><rect class="f" x="5" y="31" width="38" height="9" rx="4.5"/><path d="M24 2v3M12 5l2 3M36 5l-2 3"/>',
    foot: '<path class="f" d="M6 24h36l-4 16H10Z"/><path d="M12 24q3-5 6 0t6 0 6 0 6 0"/><circle cx="16" cy="13" r="3"/><circle cx="26" cy="8" r="2"/><circle cx="33" cy="14" r="3.5"/>',
    wax: '<path class="f" d="M10 22h28v14a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6Z"/><path d="M10 22c0-7 28-7 28 0"/><path d="M31 4l-7 16"/><circle cx="24" cy="31" r="2.5"/>',
    lash: '<path class="f" d="M5 29Q24 13 43 29Q24 41 5 29Z"/><circle cx="24" cy="28" r="5"/><path d="M10 25l-4-8M17 21l-3-9M24 19V9M31 21l3-9M38 25l4-8"/>',
    sparkle: '<path class="f" d="M24 5c1.5 11 5 15 17 19-12 4-15.500 8-17 19-1.500-11-5-15-17-19 12-4 15.500-8 17-19Z"/>'
  };
  function pickIcon(sv) {
    if (sv.icon && ICONS[sv.icon]) return sv.icon;
    var n = sv.name.toLowerCase();
    if (/lash/.test(n)) return "lash";
    if (/wax|thread|hair/.test(n)) return "wax";
    if (/pedi|foot|spa/.test(n)) return "foot";
    if (/gel|dip|shellac/.test(n)) return "gel";
    if (/nail|acrylic|mani|polish|nail art/.test(n)) return "polish";
    return "sparkle";
  }
  var list = $("service-list");
  s.services.forEach(function (sv, i) {
    var li = el("li", "card reveal");
    li.style.setProperty("--d", (i % 3) * 0.08 + "s");
    var inner = el("div", "card-inner");
    var ico = el("div", "card-ico");
    ico.innerHTML = '<svg class="ico" viewBox="0 0 48 48" aria-hidden="true">' + ICONS[pickIcon(sv)] + "</svg>";
    inner.appendChild(ico);
    inner.appendChild(el("h3", null, sv.name));
    if (sv.description) inner.appendChild(el("p", null, sv.description));
    inner.appendChild(el("span", "price", sv.price));
    li.appendChild(inner);
    list.appendChild(li);
  });

  /* Card tilt (desktop pointer) + press/bounce (touch and mouse) */
  var canTilt = !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  list.querySelectorAll(".card").forEach(function (card) {
    var raf = 0, rx = 0, ry = 0;
    function apply() { raf = 0; card.style.setProperty("--rx", rx + "deg"); card.style.setProperty("--ry", ry + "deg"); }
    if (canTilt) {
      card.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = card.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
        rx = -((e.clientY - r.top) / r.height - 0.5) * 12;
        card.classList.add("tilting");
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener("pointerleave", function () {
        rx = 0; ry = 0; card.classList.remove("tilting");
        if (!raf) raf = requestAnimationFrame(apply);
      });
    }
    card.addEventListener("pointerdown", function () { card.classList.remove("bounce"); card.classList.add("pressed"); });
    function release() {
      if (!card.classList.contains("pressed")) return;
      card.classList.remove("pressed");
      if (!reduce) {
        void card.offsetWidth;
        card.classList.add("bounce");
      }
    }
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);
    card.addEventListener("pointerleave", release);
    card.addEventListener("animationend", function () { card.classList.remove("bounce"); });
  });

  /* ---------- How it works: titles, then scroll-driven scenes ---------- */
  var steps = [].slice.call(d.querySelectorAll(".step"));
  steps.forEach(function (st, i) {
    var cfg = (s.steps && s.steps[i]) || {};
    st.querySelector("h3").textContent = cfg.title || "";
    st.querySelector(".step-text p").textContent = cfg.text || "";
  });
  var how = $("how");
  var dots = [].slice.call($("howDots").children);
  var lastActive = -1;

  function updateHow() {
    var r = how.getBoundingClientRect();
    var range = how.offsetHeight - window.innerHeight;
    var p = clamp(-r.top / Math.max(1, range), 0, 1);
    var pos = p * 3;
    steps.forEach(function (st, i) {
      var u = pos - i;
      var fadeIn = i === 0 ? 1 : clamp(u / 0.14, 0, 1);
      var fadeOut = i === 2 ? 1 : clamp((1 - u) / 0.14, 0, 1);
      var o = Math.min(fadeIn, fadeOut);
      st.style.setProperty("--o", o.toFixed(3));
      st.style.setProperty("--q", clamp(u / 0.85, 0, 1).toFixed(3));
      st.style.visibility = o <= 0 ? "hidden" : "visible";
    });
    var active = Math.min(2, Math.floor(pos));
    if (active !== lastActive) {
      lastActive = active;
      dots.forEach(function (dot, i) { dot.classList.toggle("on", i <= active); });
    }
  }

  /* ---------- Pick your colour ---------- */
  var colours = (s.colours && s.colours.length ? s.colours : [{ name: "Rose Gold", hex: s.accent }]).map(function (c, i) {
    return typeof c === "string" ? { name: c, hex: c } : { name: c.name || "Shade " + (i + 1), hex: c.hex };
  });

  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) {
    var n = d.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  var skin = $("handSkin");
  var fingers = [
    { x: 118, top: 122 }, { x: 166, top: 92 }, { x: 214, top: 118 }, { x: 262, top: 170 }
  ];
  var nails = [];
  function addNail(parent, x, y) {
    var g = svgEl("g", { "class": "nail" });
    var base = svgEl("rect", { x: x, y: y, width: 32, height: 46, rx: 15, "class": "n-base" });
    var over = svgEl("rect", { x: x, y: y, width: 32, height: 46, rx: 15, "class": "n-over" });
    var gloss = svgEl("rect", { x: x + 6, y: y + 6, width: 5, height: 22, rx: 2.5, fill: "#fff", opacity: ".55" });
    g.appendChild(base); g.appendChild(over); g.appendChild(gloss);
    parent.appendChild(g);
    nails.push({ g: g, base: base, over: over, timer: 0, pending: null });
  }
  var thumb = svgEl("g", { transform: "translate(124 352) rotate(-52)" });
  thumb.appendChild(svgEl("rect", { x: -24, y: -150, width: 48, height: 170, rx: 24, fill: "url(#gSkin)" }));
  fingers.forEach(function (f) {
    skin.appendChild(svgEl("rect", { x: f.x, y: f.top, width: 46, height: 300 - f.top, rx: 23, fill: "url(#gSkin)" }));
  });
  skin.appendChild(thumb);
  skin.appendChild(svgEl("rect", { x: 108, y: 230, width: 206, height: 190, rx: 70, fill: "url(#gSkin)" }));
  skin.appendChild(svgEl("path", { d: "M150 300 q60 22 120 0", fill: "none", stroke: "#e0b09a", "stroke-width": 2.5, "stroke-linecap": "round", opacity: ".5" }));
  fingers.forEach(function (f) { addNail(skin, f.x + 7, f.top + 9); });
  addNail(thumb, -17, -141);

  var current = colours[0];
  function paintNails(hex, animate) {
    nails.forEach(function (n, i) {
      clearTimeout(n.timer);
      if (n.pending) n.base.setAttribute("fill", n.pending);
      n.over.style.transition = "none";
      n.over.style.opacity = "0";
      if (!animate || reduce) {
        n.base.setAttribute("fill", hex); n.pending = null; return;
      }
      n.pending = hex;
      n.over.setAttribute("fill", hex);
      n.timer = setTimeout(function () {
        n.over.style.transition = "";
        n.over.style.opacity = "1";
        n.g.classList.remove("pop"); void n.g.getBoundingClientRect(); n.g.classList.add("pop");
        n.timer = setTimeout(function () {
          n.base.setAttribute("fill", hex); n.pending = null;
          n.over.style.transition = "none"; n.over.style.opacity = "0";
        }, 650);
      }, i * 70);
    });
  }
  var swWrap = $("swatches");
  var swName = $("swatchName");
  colours.forEach(function (c, i) {
    var b = el("button", "swatch");
    b.type = "button";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-label", c.name);
    b.style.setProperty("--c", c.hex);
    b.setAttribute("aria-checked", i === 0 ? "true" : "false");
    b.addEventListener("click", function () {
      if (current === c) return;
      current = c;
      swWrap.querySelectorAll(".swatch").forEach(function (o) { o.setAttribute("aria-checked", o === b ? "true" : "false"); });
      swName.classList.remove("swap"); void swName.offsetWidth; swName.classList.add("swap");
      swName.textContent = c.name;
      paintNails(c.hex, true);
    });
    swWrap.appendChild(b);
  });
  swName.textContent = current.name;
  paintNails(current.hex, false);

  /* ---------- Gallery ---------- */
  var mas = $("masonry");
  var ratios = ["4 / 5", "1 / 1", "3 / 4", "5 / 4", "4 / 6", "1 / 1", "4 / 5", "5 / 4"];
  var photos = (s.photos || []).filter(Boolean);
  function placeholder(i) {
    var ph = el("div", "ph g" + (i % 6));
    ph.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7c1.500 10 5 14 15 17-10 3-13.500 7-15 17-1.500-10-5-14-15-17 10-3 13.500-7 15-17Z"/></svg>';
    return ph;
  }
  var count = photos.length || 8;
  for (var gi = 0; gi < count; gi++) {
    (function (i) {
      var tile = el("figure", "tile reveal");
      tile.style.setProperty("--d", (i % 3) * 0.08 + "s");
      if (photos.length) {
        var p = typeof photos[i] === "string" ? { src: photos[i] } : photos[i];
        var img = el("img");
        img.src = media(p.src);
        img.alt = p.alt || s.name + " nail art " + (i + 1);
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", function () {
          img.replaceWith(placeholder(i));
          tile.style.aspectRatio = ratios[i % ratios.length];
        });
        tile.appendChild(img);
      } else {
        tile.style.aspectRatio = ratios[i % ratios.length];
        tile.appendChild(placeholder(i));
        tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", "Photo placeholder " + (i + 1));
      }
      mas.appendChild(tile);
    })(gi);
  }

  /* ---------- Visit, contact, footer ---------- */
  s.hours.forEach(function (h) { $("hours").appendChild(el("li", null, h)); });
  $("address").textContent = s.address;
  $("map").src = "https://www.google.com/maps?q=" + encodeURIComponent(s.name + ", " + s.address) + "&output=embed";
  $("phone").href = "tel:" + digits;
  $("phone").textContent = s.phone;
  if (s.instagram) {
    var handle = s.instagram.replace(/^@/, "");
    $("instagram").href = "https://instagram.com/" + handle;
    $("instagram").textContent = "@" + handle;
  } else {
    $("instagram").parentNode.hidden = true;
  }
  $("footer").textContent = "© " + new Date().getFullYear() + " " + s.name + " · " + s.address;

  /* ---------- Hero video (illustration is the fallback) ---------- */
  var hero = $("top");
  function dropVideo() {
    hero.classList.remove("has-video");
    $("heroVideo").textContent = "";
  }
  if (s.heroVideo && !reduce) {
    var v = d.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    v.preload = "auto";
    if (s.heroPoster) v.poster = media(s.heroPoster);
    v.addEventListener("error", dropVideo);
    v.src = media(s.heroVideo);
    $("heroVideo").appendChild(v);
    hero.classList.add("has-video");
    var pr = v.play();
    if (pr && pr.catch) pr.catch(dropVideo);
  }

  /* ---------- Scroll reveals ---------- */
  var reveals = [].slice.call(d.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (n) { n.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Scroll handler (header + pinned section) ---------- */
  var header = $("siteHeader");
  var ticking = false;
  function onScroll() {
    ticking = false;
    header.classList.toggle("scrolled", window.scrollY > 24);
    var hr = how.getBoundingClientRect(), cr = $("contact").getBoundingClientRect();
    header.classList.toggle("dark", (hr.top <= 32 && hr.bottom > 32) || (cr.top <= 32 && cr.bottom > 32));
    if (!reduce) updateHow();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  if (reduce) {
    steps.forEach(function (st) { st.style.setProperty("--o", "1"); st.style.setProperty("--q", "1"); });
    dots.forEach(function (dot) { dot.classList.add("on"); });
  }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  onScroll();
})();
