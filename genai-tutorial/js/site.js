/* GenAI Chutney — shared interaction layer */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- nav ---------- */
  var nav = $('.nav');
  var progress = $('.scroll-progress');
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-stuck', y > 24);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = $('.nav-toggle');
  var menu = $('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    var closeBtn = $('.close', menu);
    if (closeBtn) closeBtn.addEventListener('click', function () {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  /* ---------- pointer glow ---------- */
  var glow = $('.cursor-glow');
  if (glow && window.matchMedia('(pointer: fine)').matches && !reduce) {
    var gx = 0, gy = 0, cx = 0, cy = 0, active = false;
    window.addEventListener('pointermove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (!active) { active = true; glow.classList.add('is-on'); }
    }, { passive: true });
    (function loop() {
      cx += (gx - cx) * 0.09; cy += (gy - cy) * 0.09;
      glow.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = $$('.reveal, .reveal-img');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = (el.getAttribute('data-dec') || '0') | 0;
    if (isNaN(target)) return;
    var start = performance.now(), dur = 1500;
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- tokenizer lab ---------- */
  var labInput = $('#lab-input');
  var tokenRow = $('#lab-tokens');
  var summary = $('#lab-summary');
  var attn = $('#lab-attention');
  var nextRow = $('#lab-next');

  function tokenize(text) {
    var out = [], re = /([A-Za-z0-9''-]+)|(\s+)|([^\sA-Za-z0-9''-])/g, m;
    while ((m = re.exec(text)) && out.length < 40) {
      if (m[1]) out.push({ t: m[1], k: 'word' });
      else if (m[2]) out.push({ t: m[2].replace(/\n/g, '⏎'), k: 'space' });
      else out.push({ t: m[3], k: 'punct' });
    }
    // wordpiece-ish split for long words
    var split = [];
    out.forEach(function (tk) {
      if (tk.k === 'word' && tk.t.length > 7) {
        var t = tk.t.toLowerCase();
        var cuts = [];
        var i = 0;
        while (i < t.length) {
          var n = t.length - i > 6 ? 5 : t.length - i;
          cuts.push(t.substr(i, n)); i += n;
        }
        cuts.forEach(function (c) { split.push({ t: c, k: 'word frag' }); });
      } else split.push(tk);
    });
    return split;
  }

  var NEXT = {
    'model': [['that', 38], ['is', 26], ['can', 19], ['to', 11]],
    'models': [['that', 31], ['are', 27], ['to', 18], ['and', 12]],
    'agent': [['that', 29], ['to', 24], ['is', 21], ['will', 14]],
    'agents': [['that', 33], ['are', 22], ['can', 18], ['will', 12]],
    'ai': [['is', 34], ['that', 22], ['systems', 16], ['models', 13]],
    'the': [['model', 22], ['same', 17], ['first', 15], ['best', 12]],
    'a': [['model', 24], ['system', 18], ['single', 14], ['real', 11]],
    'context': [['window', 41], ['is', 19], ['the', 12], ['that', 9]],
    'token': [['budget', 33], ['count', 24], ['cost', 16], ['limit', 12]]
  };

  function renderLab() {
    if (!labInput || !tokenRow) return;
    var text = labInput.value || '';
    var toks = tokenize(text);
    tokenRow.innerHTML = '';
    toks.forEach(function (tk, i) {
      var s = document.createElement('span');
      s.className = 'token' + (tk.k === 'space' ? ' space' : tk.k === 'punct' ? ' n-punct' : '');
      s.style.animationDelay = (i * 22) + 'ms';
      s.textContent = tk.k === 'space' ? '␣' : tk.t;
      s.title = tk.k;
      tokenRow.appendChild(s);
    });
    var chars = text.length;
    if (summary) {
      summary.innerHTML = '<span>tokens <b>' + toks.length + '</b></span>' +
        '<span>characters <b>' + chars + '</b></span>' +
        '<span>ratio <b>' + (toks.length ? (chars / toks.length).toFixed(2) : '0') + '</b> chars/token</span>';
    }

    // attention arcs: last token attends back
    if (attn && toks.length > 1) {
      var n = Math.min(toks.length, 12);
      var w = 640, h = 168;
      var step = w / (n - 1);
      var paths = '';
      for (var i = 0; i < n - 1; i++) {
        var x1 = i * step + 12, x2 = (n - 1) * step + 12;
        var lift = 26 + ((i * 13) % 70);
        paths += '<path d="M' + x1 + ',128 C' + x1 + ',' + (128 - lift) + ' ' + x2 + ',' + (128 - lift) + ' ' + x2 + ',128" opacity="' + (0.18 + (i % 3) * 0.14).toFixed(2) + '" style="animation-delay:' + (i * 0.12) + 's"></path>';
      }
      attn.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
        '<defs><linearGradient id="attnGrad" x1="0" x2="1"><stop offset="0" stop-color="#00e5ff"/><stop offset=".5" stop-color="#b56cff"/><stop offset="1" stop-color="#ffb020"/></linearGradient></defs>' +
        paths + '</svg>';
    }

    // next token predictions
    if (nextRow) {
      var words = toks.filter(function (t) { return t.k !== 'space' && t.k !== 'punct'; });
      var last = words.length ? words[words.length - 1].t.toLowerCase().replace(/[^a-z]/g, '') : '';
      var preds = NEXT[last] || NEXT['model'];
      nextRow.innerHTML = preds.map(function (p) {
        return '<div class="next-token"><span>p=' + (p[1] / 100).toFixed(2) + '</span><b>' + p[0] + '</b>' +
          '<div class="bar"><i data-w="' + p[1] + '"></i></div></div>';
      }).join('');
      requestAnimationFrame(function () {
        $$('#lab-next .bar i').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      });
    }
  }

  if (labInput) {
    var deb;
    labInput.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(renderLab, 90);
    });
    renderLab();
  }

  /* ---------- model filters ---------- */
  var chips = $$('[data-filter]');
  var modelRows = $$('.model-row[data-cat]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      var f = chip.getAttribute('data-filter');
      modelRows.forEach(function (row) {
        var cats = (row.getAttribute('data-cat') || '').split(' ');
        row.classList.toggle('is-hidden', f !== 'all' && cats.indexOf(f) === -1);
      });
    });
  });

  /* ---------- benchmark switcher ---------- */
  var BENCH = window.CHUTNEY_BENCH || {};
  var benchTabs = $$('.bench-tab');
  var benchTitle = $('#bench-title');
  var benchDesc = $('#bench-desc');
  var benchBars = $('#bench-bars');
  var benchSource = $('#bench-source');

  /* Benchmarks as a real SVG chart: shared 0-100 axis, gridlines, the top row
     called out, and bars that grow from the axis when the tab is opened. */
  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function cut(t, n) { t = String(t); return t.length > n ? t.slice(0, n - 1) + '…' : t; }

  function benchSvg(b) {
    var W = 1000, padL = 372, padR = 96, rowH = 44, top = 46;
    var rows = b.rows || [];
    var H = top + rows.length * rowH + 30;
    var plotW = W - padL - padR;
    var unit = b.unit || '%';
    var ticks = [0, 25, 50, 75, 100];
    var out = [];
    out.push('<svg class="bench-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(b.name) + ' results">');
    out.push('<defs><linearGradient id="benchCool" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#00e5ff"/><stop offset=".55" stop-color="#b56cff"/><stop offset="1" stop-color="#ff4dff"/></linearGradient>' +
      '<linearGradient id="benchHot" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#ffb020"/><stop offset="1" stop-color="#ff7a32"/></linearGradient></defs>');

    ticks.forEach(function (t) {
      var x = padL + (t / 100) * plotW;
      out.push('<line class="bench-grid' + (t === 0 ? ' bench-base' : '') + '" x1="' + x.toFixed(1) + '" y1="' + (top - 14) + '" x2="' + x.toFixed(1) + '" y2="' + (H - 20) + '"/>');
      out.push('<text class="bench-tick" x="' + x.toFixed(1) + '" y="' + (top - 22) + '" text-anchor="middle">' + t + unit + '</text>');
    });

    rows.forEach(function (r, i) {
      var y = top + i * rowH;
      var v = Math.max(0, Math.min(100, Number(r[1]) || 0));
      var hot = i === 0;
      out.push('<g class="bench-row">');
      out.push('<text class="bench-name' + (hot ? ' is-top' : '') + '" x="0" y="' + (y + 24) + '">' + esc(cut(r[0], 32)) + '</text>');
      out.push('<rect class="bench-slot" x="' + padL + '" y="' + (y + 6) + '" width="' + plotW + '" height="20" rx="1"/>');
      out.push('<rect class="bench-fill' + (hot ? ' is-hot' : '') + '" x="' + padL + '" y="' + (y + 6) + '" width="' + plotW + '" height="20" rx="1" ' +
        'fill="url(#' + (hot ? 'benchHot' : 'benchCool') + ')" style="--v:' + (v / 100).toFixed(4) + ';transition-delay:' + (i * 70) + 'ms"/>');
      out.push('<text class="bench-val' + (hot ? ' is-top' : '') + '" x="' + (padL + (v / 100) * plotW + 12).toFixed(1) + '" y="' + (y + 21) + '">' + r[1] + unit + '</text>');
      out.push('</g>');
    });
    out.push('</svg>');
    requestAnimationFrame(function () {
      $$('#bench-bars .bench-fill').forEach(function (f) { f.classList.add('in'); });
    });
    return out.join('');
  }

  function drawBench(key) {
    var b = BENCH[key];
    if (!b || !benchBars) return;
    if (benchTitle) benchTitle.textContent = b.name;
    if (benchDesc) benchDesc.textContent = b.desc;
    if (benchSource) benchSource.textContent = b.source;
    benchBars.innerHTML = benchSvg(b);
  }
  benchTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      benchTabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      drawBench(tab.getAttribute('data-bench'));
    });
  });
  if (benchTabs.length) drawBench(benchTabs[0].getAttribute('data-bench'));

  /* ---------- timeline ---------- */
  var tl = $('.timeline-scroll');
  var rail = $('.timeline-rail i');
  function tlFill() {
    if (!tl || !rail) return;
    var max = tl.scrollWidth - tl.clientWidth;
    var p = max > 0 ? tl.scrollLeft / max : 1;
    rail.style.width = (p * 100) + '%';
    var edge = tl.scrollLeft + tl.clientWidth - 40;
    $$('.tl-item', tl).forEach(function (it) {
      it.classList.toggle('is-past', it.offsetLeft < edge);
    });
  }
  if (tl) {
    tl.addEventListener('scroll', tlFill, { passive: true });
    window.addEventListener('resize', tlFill);
    tlFill();
    $$('.tl-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var d = btn.getAttribute('data-dir') === 'next' ? 1 : -1;
        tl.scrollBy({ left: d * Math.min(560, tl.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- marquee: duplicate for seamless loop ---------- */
  $$('.marquee').forEach(function (m) {
    m.innerHTML += m.innerHTML;
  });

  /* ---------- modality cards ---------- */
  var mods = $$('.modality');
  mods.forEach(function (m) {
    m.addEventListener('click', function () {
      mods.forEach(function (o) { o.classList.remove('is-active'); o.setAttribute('aria-pressed', 'false'); });
      m.classList.add('is-active');
      m.setAttribute('aria-pressed', 'true');
    });
  });

  /* ---------- edition stamp + year ---------- */
  var stamp = $('[data-edition]');
  if (stamp) {
    var d = new Date();
    stamp.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  /* ---------- price plane (SVG, log-log) ---------- */
  var rows = $$('.model-row[data-cat]');
  var MODELS = rows.map(function (row) {
    var b = row.querySelector('.model-name b');
    if (!b) return null;
    var name = (b.childNodes[0] && b.childNodes[0].textContent || b.textContent).trim();
    var cells = $$('.model-cell.price', row);
    var pin = parseFloat((cells[0] && cells[0].textContent || '').replace(/[^0-9.]/g, ''));
    var pout = parseFloat((cells[1] && cells[1].textContent || '').replace(/[^0-9.]/g, ''));
    return { name: name, in: pin, out: pout, cat: (row.getAttribute('data-cat') || '').split(' ') };
  }).filter(function (m) { return m && isFinite(m.in) && isFinite(m.out) && m.in > 0 && m.out > 0; });

  function logScale(d0, d1, p0, p1) {
    var l0 = Math.log10(d0), l1 = Math.log10(d1);
    return {
      at: function (v) { return p0 + ((Math.log10(v) - l0) / (l1 - l0)) * (p1 - p0); },
      ticks: function (list) {
        return list.map(function (v) {
          return { v: v, x: p0 + ((Math.log10(v) - l0) / (l1 - l0)) * (p1 - p0) };
        });
      }
    };
  }

  function catColor(m) {
    if (m.cat.indexOf('open') >= 0) return '#7cff6b';
    if (m.cat.indexOf('efficient') >= 0) return '#ffb020';
    if (m.cat.indexOf('frontier') >= 0) return '#00e5ff';
    return '#b56cff';
  }

  function buildPriceMap() {
    var host = $('#price-map');
    if (!host || !MODELS.length) return;
    var MOBILE = window.innerWidth < 660;
    if (MOBILE) {
      // Small screens get a sorted bar list, not a shrunken scatter: a 1000-unit
      // viewBox at 360px turns every label into a smudge.
      var lede = document.querySelector('.pricemap-head p');
      if (lede) lede.textContent = 'Sorted by output price, because the cheapest model here is a hundred times cheaper than the dearest. Bar length is that output price on a log scale — the input price sits in the same row.';
      var sorted = MODELS.slice().sort(function (a, b) { return b.out - a.out; });
      var money = function (v) { return '$' + (v < 1 ? v.toFixed(2) : v.toFixed(0)); };
      var maxOut = sorted[0].out;
      var rowsHtml = sorted.map(function (m, i) {
        var w = Math.max(4, (Math.log10(m.out / 0.4) / Math.log10(maxOut / 0.4)) * 100);
        return '<li' + (m.name.indexOf('Fable 5.2') >= 0 ? ' class="is-hot"' : '') + '>' +
          '<span class="pm-rank">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="pm-mname">' + m.name.replace(/\s*\(.*$/, '') + '</span>' +
          '<span class="pm-price">' + money(m.in) + ' / ' + money(m.out) + '</span>' +
          '<span class="pm-bar" style="--w:' + w.toFixed(1) + '%"></span></li>';
      }).join('');
      host.innerHTML = '<div class="pm-mobile"><div class="pm-mhead"><span>Model</span><span>In / out per 1M</span></div><ol>' + rowsHtml + '</ol>' +
        '<p class="pm-mnote">Sorted by output price. Bar length is log-scaled output price; input price sits in the same row.</p></div>';
      return;
    }
    var W = 1000, H = 486, padL = 88, padR = 132, padT = 26, padB = 60;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var X = logScale(0.08, 10, padL, padL + plotW);
    var Y = logScale(0.1, 60, padT + plotH, padT);
    var out = [];
    out.push('<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Input and output price of every model on the map, log scales">');

    X.ticks([0.1, 1, 10]).forEach(function (t) {
      out.push('<line class="pm-grid" x1="' + t.x.toFixed(1) + '" y1="' + padT + '" x2="' + t.x.toFixed(1) + '" y2="' + (padT + plotH) + '"/>');
      out.push('<text class="pm-tick" x="' + t.x.toFixed(1) + '" y="' + (H - 38) + '" text-anchor="middle">$' + (t.v < 1 ? t.v.toFixed(2) : t.v) + '</text>');
    });
    Y.ticks([0.1, 1, 10]).forEach(function (t) {
      out.push('<line class="pm-grid" x1="' + padL + '" y1="' + t.x.toFixed(1) + '" x2="' + (padL + plotW) + '" y2="' + t.x.toFixed(1) + '"/>');
      out.push('<text class="pm-tick" x="' + (padL - 14) + '" y="' + (t.x + 4).toFixed(1) + '" text-anchor="end">$' + (t.v < 1 ? t.v.toFixed(2) : t.v) + '</text>');
    });

    out.push('<line class="pm-axis" x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '"/>');
    out.push('<line class="pm-axis" x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '"/>');
    out.push('<text class="pm-axis-label" x="' + (padL + plotW / 2) + '" y="' + (H - 10) + '" text-anchor="middle">Input price per 1M tokens</text>');
    out.push('<text class="pm-axis-label" x="0" y="' + (padT + plotH / 2) + '" text-anchor="middle" transform="rotate(-90 14 ' + (padT + plotH / 2) + ')">Output price</text>');

    out.push('<line class="pm-diag" x1="' + X.at(0.1).toFixed(1) + '" y1="' + Y.at(0.1).toFixed(1) + '" x2="' + X.at(10).toFixed(1) + '" y2="' + Y.at(10).toFixed(1) + '"/>');
    out.push('<text class="pm-diag-label" x="' + (X.at(6) + 9).toFixed(1) + '" y="' + (Y.at(8) - 7).toFixed(1) + '">read = write</text>');

    // Greedy label placement: every point gets a name, nudged to the first
    // candidate slot that clears the labels already placed.
    var placed = [];
    var order = MODELS.slice().sort(function (a, b) {
      var ha = a.name.indexOf('Fable 5.2') >= 0 ? -2 : 0;
      var hb = b.name.indexOf('Fable 5.2') >= 0 ? -2 : 0;
      return ha - hb;
    });
    function hits(box) {
      if (box.x1 < padL + 2 || box.x2 > W - 6) return true;
      for (var k = 0; k < placed.length; k++) {
        var o = placed[k];
        if (!(box.x2 < o.x1 || box.x1 > o.x2 || box.y2 < o.y1 || box.y1 > o.y2)) return true;
      }
      return false;
    }

    var taken = [];
    order.forEach(function (m) {
      var x = X.at(m.in), y = Y.at(m.out);
      // two models can share a price point exactly; nudge so both stay visible
      for (var guard = 0; guard < 8; guard++) {
        var clash = taken.some(function (t) { return Math.abs(t.x - x) < 7 && Math.abs(t.y - y) < 7; });
        if (!clash) break;
        y -= 10; x += 4;
      }
      taken.push({ x: x, y: y });
      var hot = m.name.indexOf('Fable 5.2') >= 0;
      var shortName = m.name.replace(/\s*\(.*$/, '');
      var tw = Math.min(168, shortName.length * 5.6), th = 12;
      var cands = [
        [x + 11, y + 4, 'start'], [x - 11, y + 4, 'end'],
        [x - 11, y - 7, 'end'], [x + 11, y - 7, 'start'],
        [x - 11, y + 19, 'end'], [x + 11, y + 19, 'start'],
        [x + 11, y + 31, 'start'], [x - 11, y + 31, 'end'],
        [x + 11, y - 19, 'start'], [x - 11, y - 19, 'end'],
        [x + 11, y - 31, 'start'], [x - 11, y - 31, 'end']
      ];
      var pick = null;
      for (var c = 0; c < cands.length; c++) {
        var cx = cands[c][0], cy = cands[c][1], anchor = cands[c][2];
        var bx1 = anchor === 'start' ? cx : cx - tw;
        var box = { x1: bx1, x2: bx1 + tw, y1: cy - th, y2: cy + 3 };
        if (!hits(box)) { pick = { x: cx, y: cy, anchor: anchor }; placed.push(box); break; }
      }
      if (!pick) {
        pick = { x: x - 11, y: y - 7, anchor: 'end' };
        placed.push({ x1: x - 11 - tw, x2: x - 11, y1: y - 19, y2: y - 4 });
      }
      m._label = pick;
      m._short = shortName;
      m._x = x; m._y = y; m._hot = hot;
    });

    MODELS.forEach(function (m) {
      out.push('<g class="pm-point" data-name="' + m.name.replace(/"/g, '') + '">');
      out.push('<circle class="pm-dot" cx="' + m._x.toFixed(1) + '" cy="' + m._y.toFixed(1) + '" r="' + (m._hot ? 8 : 5.5) + '" fill="' + catColor(m) + '" fill-opacity="' + (m._hot ? 1 : 0.85) + '"/>');
      if (MOBILE) {
        out.push('<text class="pm-index" x="' + m._x.toFixed(1) + '" y="' + (m._y + 3.2).toFixed(1) + '" text-anchor="middle">' + (MODELS.indexOf(m) + 1) + '</text>');
      } else if (m._label) {
        out.push('<text class="pm-name' + (m._hot ? ' is-hot' : '') + '" x="' + m._label.x.toFixed(1) + '" y="' + m._label.y.toFixed(1) + '" text-anchor="' + m._label.anchor + '">' + m._short + '</text>');
      }
      out.push('</g>');
    });
    out.push('</svg>');
    host.innerHTML = out.join('');
    if (MOBILE) {
      var key = '<ol class="pm-key">';
      MODELS.forEach(function (m, i) {
        key += '<li' + (m._hot ? ' class="is-hot"' : '') + '><i>' + (i + 1) + '</i><b>' + m.name.replace(/\s*\(.*$/, '') + '</b><span>$' + m.in + ' / $' + m.out + '</span></li>';
      });
      key += '</ol>';
      host.insertAdjacentHTML('beforeend', key);
      var hint = document.querySelector('.pm-hint');
      if (hint) hint.textContent = 'Tap a dot for prices';
    }
    host.insertAdjacentHTML('beforeend', '<div class="pm-tip" id="pm-tip" role="status"></div>');

    var tip = $('#pm-tip');
    $$('.pm-point', host).forEach(function (g) {
      var m = null;
      for (var i = 0; i < MODELS.length; i++) if (MODELS[i].name === g.getAttribute('data-name')) m = MODELS[i];
      if (!m) return;
      g.addEventListener('mouseenter', function () {
        tip.innerHTML = '<b>' + m.name + '</b><span>$' + m.in.toFixed(2) + ' in · $' + m.out.toFixed(2) + ' out</span>';
        tip.classList.add('is-on');
      });
      g.addEventListener('mousemove', function (e) {
        var box = host.getBoundingClientRect();
        tip.style.left = Math.min(box.width - 160, Math.max(0, e.clientX - box.left + 14)) + 'px';
        tip.style.top = Math.max(0, e.clientY - box.top - 18) + 'px';
      });
      g.addEventListener('mouseleave', function () { tip.classList.remove('is-on'); });
    });
  }
  buildPriceMap();

  /* ---------- run-the-bill estimator ---------- */
  var estModel = $('#est-model');
  if (estModel && MODELS.length) {
    MODELS.forEach(function (m, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = m.name + ' — $' + m.in + ' in / $' + m.out + ' out';
      estModel.appendChild(o);
    });
    var fi = -1;
    MODELS.forEach(function (m, i) { if (m.name.indexOf('Fable 5.2') >= 0) fi = i; });
    estModel.value = fi >= 0 ? fi : 0;

    var sIn = $('#est-in'), sOut = $('#est-out');
    var oIn = $('#est-in-out'), oOut = $('#est-out-out');
    var costEl = $('#est-cost'), perEl = $('#est-per');

    function fmtTok(n) {
      if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
      if (n >= 1e3) return Math.round(n / 1e3) + 'k';
      return String(Math.round(n));
    }
    function fmtMoney(v) {
      if (v >= 1000) return '$' + Math.round(v).toLocaleString('en-US');
      if (v >= 100) return '$' + v.toFixed(0);
      if (v >= 10) return '$' + v.toFixed(1);
      if (v >= 0.1) return '$' + v.toFixed(2);
      if (v >= 0.01) return '$' + v.toFixed(3);
      return '$' + v.toFixed(4);
    }
    function update() {
      var m = MODELS[Number(estModel.value)] || MODELS[0];
      var tin = Math.round(Math.pow(10, Number(sIn.value)) / 1000) * 1000;
      var tout = Math.round(Math.pow(10, Number(sOut.value)) / 1000) * 1000;
      oIn.textContent = fmtTok(tin);
      oOut.textContent = fmtTok(tout);
      var cin = (tin / 1e6) * m.in;
      var cout = (tout / 1e6) * m.out;
      var c = cin + cout;
      costEl.textContent = fmtMoney(c);
      perEl.textContent = fmtMoney(c * 1000);
      var split = document.getElementById('est-split');
      if (split) split.textContent = 'in ' + fmtMoney(cin) + ' · out ' + fmtMoney(cout);
    }
    [estModel, sIn, sOut].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  /* ---------- harness loop ---------- */
  var hItems = $$('.harness-item');
  hItems.forEach(function (el, i) { el.setAttribute('data-step', String(i + 1)); });
  $$('.loop-node').forEach(function (node) {
    var step = node.getAttribute('data-step');
    var on = function () {
      node.classList.add('is-hot');
      hItems.forEach(function (li) { li.classList.toggle('is-hot', li.getAttribute('data-step') === step); });
    };
    var off = function () {
      node.classList.remove('is-hot');
      hItems.forEach(function (li) { li.classList.remove('is-hot'); });
    };
    node.addEventListener('mouseenter', on);
    node.addEventListener('focus', on);
    node.addEventListener('mouseleave', off);
    node.addEventListener('blur', off);
  });

})();
