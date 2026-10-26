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

  function drawBench(key) {
    var b = BENCH[key];
    if (!b || !benchBars) return;
    if (benchTitle) benchTitle.textContent = b.name;
    if (benchDesc) benchDesc.textContent = b.desc;
    if (benchSource) benchSource.textContent = b.source;
    benchBars.innerHTML = b.rows.map(function (r) {
      return '<div class="bar-row"><div><div class="bar-label"><span>' + r[0] + '</span><i>' + (b.note || '') + '</i></div>' +
        '<div class="bar-track"><span class="bar-fill" data-w="' + r[1] + '"></span></div></div>' +
        '<div class="val">' + r[1] + (b.unit || '%') + '</div></div>';
    }).join('');
    requestAnimationFrame(function () {
      $$('#bench-bars .bar-fill').forEach(function (f, i) {
        setTimeout(function () { f.style.width = f.getAttribute('data-w') + '%'; }, i * 90);
      });
    });
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
})();
