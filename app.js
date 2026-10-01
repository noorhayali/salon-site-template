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

  // Every Book button opens the booking sheet (see below); the tel: href is the no-JS fallback.
  var bookLinks = [].slice.call(d.querySelectorAll(".book-link"));
  bookLinks.forEach(function (a) { a.href = "tel:" + digits; });

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
  function guessIcon(name) {
    var n = String(name || "").toLowerCase();
    if (/lash/.test(n)) return "lash";
    if (/wax|thread|hair/.test(n)) return "wax";
    if (/pedi|foot|spa/.test(n)) return "foot";
    if (/gel|dip|shellac/.test(n)) return "gel";
    if (/nail|acrylic|mani|polish/.test(n)) return "polish";
    return "sparkle";
  }
  // `icon` is a built-in name or the config's own inline SVG string.
  function iconBox(icon, name) {
    var box = el("span", "ico-box");
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = typeof icon === "string" && /^\s*<svg/i.test(icon)
      ? icon
      : '<svg viewBox="0 0 48 48">' + ICONS[ICONS[icon] ? icon : guessIcon(name)] + "</svg>";
    return box;
  }

  // One source of truth: s.serviceCategories drives both the cards below and the picker.
  var cats = (s.serviceCategories || []).filter(function (c) { return c && c.services && c.services.length; });
  var list = $("service-list");
  cats.forEach(function (cat, i) {
    var li = el("li", "card reveal");
    li.style.setProperty("--d", (i % 2) * 0.08 + "s");
    var inner = el("div", "card-inner");
    var ico = el("div", "card-ico");
    ico.appendChild(iconBox(cat.icon, cat.name));
    inner.appendChild(ico);
    inner.appendChild(el("h3", null, cat.name));
    var menu = el("ul", "menu");
    cat.services.forEach(function (sv) {
      var row = el("li");
      row.appendChild(el("span", null, sv.name));
      row.appendChild(el("span", null, sv.price));
      menu.appendChild(row);
    });
    inner.appendChild(menu);
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

  /* ---------- Service picker ---------- */
  var selected = null; // { name, price }
  var activeCat = 0;
  var tabsEl = $("tabs"), panel = $("panel"), picked = $("picked");
  var tabBtns = [];

  function renderPicked() {
    picked.classList.toggle("has", !!selected);
    $("pickedName").textContent = selected
      ? selected.name + (selected.price ? " · " + selected.price : "")
      : "Tap a service to select it";
  }
  function renderPanel() {
    panel.textContent = "";
    var cat = cats[activeCat];
    if (!cat) return;
    cat.services.forEach(function (sv, i) {
      var b = el("button", "svc");
      b.type = "button";
      b.style.setProperty("--i", Math.min(i, 14));
      b.appendChild(el("span", null, sv.name));
      b.appendChild(el("span", "svc-price", sv.price));
      b.setAttribute("aria-pressed", selected && selected.name === sv.name && selected.cat === cat.name ? "true" : "false");
      b.addEventListener("click", function () {
        var already = b.getAttribute("aria-pressed") === "true";
        selected = already ? null : { name: sv.name, price: sv.price, cat: cat.name };
        panel.querySelectorAll(".svc").forEach(function (o) { o.setAttribute("aria-pressed", o === b && !already ? "true" : "false"); });
        renderPicked();
      });
      panel.appendChild(b);
    });
  }
  function selectCat(i, focus) {
    activeCat = i;
    tabBtns.forEach(function (t, j) {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      t.tabIndex = j === i ? 0 : -1;
    });
    if (focus) tabBtns[i].focus();
    panel.setAttribute("aria-labelledby", "tab-" + i);
    renderPanel();
  }
  cats.forEach(function (cat, i) {
    var t = el("button", "tab");
    t.type = "button"; t.id = "tab-" + i;
    t.setAttribute("role", "tab");
    t.appendChild(iconBox(cat.icon, cat.name));
    t.appendChild(el("span", null, cat.name));
    t.addEventListener("click", function () { if (i !== activeCat) selectCat(i); });
    t.addEventListener("keydown", function (e) {
      var n = cats.length, k = e.key;
      if (k === "ArrowRight") { e.preventDefault(); selectCat((activeCat + 1) % n, true); }
      else if (k === "ArrowLeft") { e.preventDefault(); selectCat((activeCat + n - 1) % n, true); }
    });
    tabsEl.appendChild(t); tabBtns.push(t);
  });
  if (cats.length) selectCat(0); else $("choose").hidden = true;
  renderPicked();

  /* ---------- Booking sheet ---------- */
  var sheet = $("sheet"), sheetPanel = sheet.querySelector(".sheet");
  var OPT = {
    online: '<path d="M4 7.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 3v4M16 3v4M4 11h16M9 16l2 2 4-4"/>',
    call: '<path d="M5 4h4l2 5-2.5 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    text: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M8 10h8M8 13h5"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.500 6 8.500-6"/>'
  };
  var GO = '<svg class="opt-go" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  var opener = null, closeTimer = 0;

  function message() {
    return selected
      ? "Hi! I'd like to book a " + selected.name + ". When are you available?"
      : "Hi! I'd like to book an appointment. When are you available?";
  }
  function addOpt(i, o) {
    var li = el("li");
    var n = el(o.href ? "a" : "div", "opt" + (o.primary ? " primary" : ""));
    n.style.setProperty("--i", i);
    if (o.href) {
      n.href = o.href;
      if (o.external) { n.target = "_blank"; n.rel = "noopener"; }
    }
    n.innerHTML = '<span class="opt-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + OPT[o.icon] + "</svg></span>";
    var t = el("span", "opt-text");
    t.appendChild(el("strong", null, o.label));
    t.appendChild(el("span", null, o.sub));
    n.appendChild(t);
    if (o.copy) {
      var cb = el("button", "opt-copy", "Copy number");
      cb.type = "button";
      cb.addEventListener("click", function () {
        copyText(s.phone, function () {
          cb.textContent = "Copied ✓";
          setTimeout(function () { cb.textContent = "Copy number"; }, 1800);
        });
      });
      n.appendChild(cb);
    } else {
      n.insertAdjacentHTML("beforeend", GO);
    }
    li.appendChild(n);
    $("sheetOpts").appendChild(li);
  }
  function copyText(text, done) {
    function fallback() {
      var ta = d.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;opacity:0";
      d.body.appendChild(ta); ta.select();
      try { d.execCommand("copy"); done(); } catch (e) {}
      d.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  function buildSheet() {
    $("sheetTitle").textContent = selected ? selected.name : "Book an appointment";
    $("sheetSub").textContent = selected
      ? [selected.cat, selected.price].filter(Boolean).join(" · ")
      : "No service selected. Tell us what you have in mind.";
    var box = $("sheetOpts"); box.textContent = "";
    var msg = message(), enc = encodeURIComponent(msg), i = 0;
    var touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (s.bookingLink) addOpt(i++, { icon: "online", label: "Book online", sub: "Pick a time on our booking page", href: s.bookingLink, external: true, primary: true });
    if (s.phone) {
      if (touch) {
        addOpt(i++, { icon: "call", label: "Call", sub: s.phone, href: "tel:" + digits });
        addOpt(i++, { icon: "text", label: "Text", sub: "Opens a pre-filled message", href: "sms:" + digits + "?&body=" + enc });
      } else {
        addOpt(i++, { icon: "call", label: s.phone, sub: "Call or text us", copy: true });
      }
    }
    if (s.email) {
      var subj = selected ? "Booking request: " + selected.name : "Booking request";
      addOpt(i++, { icon: "email", label: "Email", sub: s.email, href: "mailto:" + s.email + "?subject=" + encodeURIComponent(subj) + "&body=" + enc });
    }
    if (!i) box.appendChild(el("li", "sheet-empty", "Booking details are coming soon."));
  }
  function openSheet(from) {
    clearTimeout(closeTimer);
    opener = from || null;
    buildSheet();
    sheet.hidden = false;
    void sheet.offsetWidth;
    sheet.classList.add("open");
    d.documentElement.classList.add("sheet-open");
    sheetPanel.focus({ preventScroll: true });
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove("open");
    d.documentElement.classList.remove("sheet-open");
    closeTimer = setTimeout(function () { sheet.hidden = true; }, reduce ? 0 : 520);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  bookLinks.forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); openSheet(a); });
  });
  $("bookThis").addEventListener("click", function () { openSheet($("bookThis")); });
  sheet.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeSheet(); });
  d.addEventListener("keydown", function (e) {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    else if (e.key === "Tab") { // keep focus inside the sheet
      var f = [].slice.call(sheetPanel.querySelectorAll("a[href], button")).filter(function (n) { return n.offsetParent; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (d.activeElement === first || d.activeElement === sheetPanel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Gallery ---------- */
  var mas = $("masonry");
  var ratios = ["4 / 5", "1 / 1", "3 / 4", "5 / 4", "4 / 6", "1 / 1", "4 / 5", "5 / 4"];
  var photos = (s.photos || []).filter(Boolean);
  function placeholder(i) {
    var ph = el("div", "ph g" + (i % 6));
    ph.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7c1.500 10 5 14 15 17-10 3-13.5 7-15 17-1.500-10-5-14-15-17 10-3 13.500-7 15-17Z"/></svg>';
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
