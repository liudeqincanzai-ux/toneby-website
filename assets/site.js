// Toneby 官网渲染 + 轮播（含后层灰图景深）
(function () {
  var DATA;
  try {
    var s = JSON.parse(localStorage.getItem("lut_web_edits_v1"));
    DATA = (s && s.site) ? s.site : window.SITE_WEB;
  } catch (e) { DATA = window.SITE_WEB; }
  if (!DATA) return;

  var IMG_V = "?v=1";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function h(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.firstChild;
  }
  function set(id, text) { var e = document.getElementById(id); if (e) e.textContent = text; }

  function storeBtn(href) {
    var a = el("a", "store-btn");
    a.href = DATA.hero.playUrl || "#";
    a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 2.5v19l11-9.5L3 2.5z"/><path d="M14 12l4.5-3.9 2.6 1.5c.8.5.8 1.7 0 2.2l-2.6 1.5L14 12z" opacity=".8"/></svg>' +
      '<span>' + (DATA.hero.playLabel || "GET IT ON") + '<small>' + (DATA.hero.playStore || "GOOGLE PLAY") + '</small></span>';
    return a;
  }

  // ---------- nav ----------
  var brand = document.getElementById("navBrand");
  brand.innerHTML = '<span class="mark">T</span>' + DATA.nav.brand;
  var nl = document.getElementById("navLinks");
  (DATA.nav.links || []).forEach(function (l) {
    var a = el("a", l.hideM ? "hide-m" : "", l.label);
    a.href = l.href || "#";
    if (l.ext) { a.target = "_blank"; a.rel = "noopener"; }
    nl.appendChild(a);
  });
  var dl = el("a", "btn-nav", DATA.nav.downloadLabel || "DOWNLOAD");
  dl.href = DATA.nav.downloadHref || "#download";
  nl.appendChild(dl);

  // ---------- hero ----------
  set("heroIntro", DATA.hero.intro);
  var hb = document.getElementById("heroBtns");
  hb.appendChild(storeBtn());
  set("heroMeta", DATA.hero.meta);
  document.getElementById("heroTitle").innerHTML = DATA.hero.title;

  var groupsBox = document.getElementById("heroGroups");
  var groupBtns = [];
  (DATA.hero.groups || []).forEach(function (g, gi) {
    var b = el("button", "grp" + (gi === 0 ? " active" : ""));
    b.innerHTML = '<span class="no">' + g.no + "</span>" + g.label;
    b.onclick = function () {
      var idx = slides.findIndex(function (s) { return s.g === gi; });
      show(idx >= 0 ? idx : 0);
    };
    groupBtns.push(b);
    groupsBox.appendChild(b);
  });

  // ---------- carousel（后层灰图景深） ----------
  var slides = (DATA.hero.slides || []).map(function (s) {
    return { src: s.src + IMG_V, cap: s.cap, g: s.g || 0 };
  });
  var cur = 0;
  var img = document.getElementById("shotImg");
  var back = document.getElementById("shotBack");
  var cap = document.getElementById("shotCaption");

  function render() {
    var s = slides[cur];
    img.src = s.src;
    back.src = slides[(cur + 1) % slides.length].src; // 后层：下一张灰图
    cap.textContent = s.cap;
    var g = s.g;
    groupBtns.forEach(function (b, bi) { b.classList.toggle("active", bi === g); });
  }
  function show(i) {
    cur = (i + slides.length) % slides.length;
    img.style.opacity = 0;
    setTimeout(render, 130);
    setTimeout(function () { img.style.opacity = 1; }, 260);
  }
  document.getElementById("prevBtn").onclick = function () { show(cur - 1); };
  document.getElementById("nextBtn").onclick = function () { show(cur + 1); };
  var tx = null;
  img.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  img.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    tx = null;
  }, { passive: true });
  render();

  // ---------- numbers ----------
  var ng = document.getElementById("numbersGrid");
  (DATA.numbers || []).forEach(function (n) {
    var c = el("div", "cell");
    c.appendChild(el("div", "big", n.no));
    var h3 = el("h3", "", n.title);
    c.appendChild(h3);
    c.appendChild(el("p", "", n.desc));
    ng.appendChild(c);
  });

  // ---------- features intro ----------
  set("featTag", DATA.intro2.tag);
  set("featTitle", DATA.intro2.title);
  set("featDesc", DATA.intro2.desc);

  // ---------- modules ----------
  var mg = document.getElementById("modulesGrid");
  (DATA.modules || []).forEach(function (m, i) {
    var d = el("div", "module" + (i % 2 === 1 ? " flip" : ""));
    var shot = el("div", "mod-shot");
    var img = el("img");
    img.src = m.src + IMG_V;
    img.alt = m.title;
    shot.appendChild(img);
    var t = el("div", "mod-txt");
    t.appendChild(el("div", "fig", m.fig));
    t.appendChild(el("div", "mod", m.mod));
    t.appendChild(el("h3", "", m.title));
    t.appendChild(el("p", "", m.desc));
    if (i % 2 === 1) { d.appendChild(t); d.appendChild(shot); }
    else { d.appendChild(shot); d.appendChild(t); }
    mg.appendChild(d);
  });

  // ---------- gallery ----------
  set("galTitle", DATA.gallery.title);
  set("galDesc", DATA.gallery.desc);
  var gc = document.getElementById("galCards");
  (DATA.gallery.cards || []).forEach(function (card) {
    var c = el("div", "card");
    c.appendChild(el("span", "", card.name));
    c.appendChild(el("small", "", card.sub));
    gc.appendChild(c);
  });
  var gl = document.getElementById("galLink");
  gl.textContent = DATA.gallery.linkLabel;
  gl.href = DATA.gallery.linkUrl || "#";

  // ---------- faq ----------
  var fl = document.getElementById("faqList");
  (DATA.faq || []).forEach(function (f) {
    var d = el("details");
    var s = el("summary", "", f.q);
    d.appendChild(s);
    d.appendChild(el("div", "a", f.a));
    fl.appendChild(d);
  });

  // ---------- cta ----------
  set("ctaTitle", DATA.cta.title);
  var cb = document.getElementById("ctaBtns");
  cb.appendChild(storeBtn());

  // ---------- footer ----------
  set("footBrand", DATA.footer.brand);
  var fl2 = document.getElementById("footLinks");
  var p = el("a", "", DATA.footer.privacyLabel); p.href = DATA.footer.privacyHref;
  var t = el("a", "", DATA.footer.termsLabel); t.href = DATA.footer.termsHref;
  fl2.appendChild(p); fl2.appendChild(t);
  set("footCopy", DATA.footer.copy);
})();
