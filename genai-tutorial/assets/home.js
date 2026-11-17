/* GenAI Chutney home page script. DESIGN.md §3 (folio), §5 (acts), §7 (the Retina), §12 (data).
   Loaded synchronously in <head> so the .js class lands before first paint; DOM work waits for
   readyState "interactive", which runs before the deferred engine script.
   The training code at the top is pure and is also run by scripts/make-mark.mjs, which is how
   assets/mark.svg and assets/favicon.svg come from the same Teach-phase weights as the live plate. */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------ training -- */
  var Retina = (function () {
    var N = 20, CELLS = N * N;
    var K = 120;            /* perceptron steps, Teach and XOR */
    var E = 200;            /* backprop epochs, Divide */
    var SEED_TEACH = 1958;
    var SEED_XOR = 1969;
    var SEED_DIVIDE = 1986;

    function prng(seed) {
      var a = seed >>> 0;
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    function jitter(rand) { return Math.floor(rand() * 3) - 1; }

    function glyph(kind, rand) {
      var x = new Uint8Array(CELLS);
      var cx = N / 2 + jitter(rand), cy = N / 2 + jitter(rand);
      for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
          var dx = c + 0.5 - cx, dy = r + 0.5 - cy, on;
          if (kind === 'cross') {
            on = (Math.abs(dx) < 1 && Math.abs(dy) < 5.5) || (Math.abs(dy) < 1 && Math.abs(dx) < 5.5);
          } else {
            on = Math.abs(Math.sqrt(dx * dx + dy * dy) - 6.5) < 0.9;
          }
          if (rand() < 0.03) on = !on;
          x[r * N + c] = on ? 1 : 0;
        }
      }
      return x;
    }

    function blob(side, rand) {
      var x = new Uint8Array(CELLS);
      var cx = (side === 'left' ? 3.5 : 13.5) + rand() * 3;
      var cy = 4.5 + rand() * 11;
      for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
          var dx = c + 0.5 - cx, dy = r + 0.5 - cy;
          if (dx * dx + dy * dy < 6.25) x[r * N + c] = 1;
        }
      }
      return x;
    }

    function teachData() {
      var rand = prng(SEED_TEACH), data = [];
      for (var i = 0; i < 20; i++) {
        data.push({ x: glyph('cross', rand), y: 1 });
        data.push({ x: glyph('ring', rand), y: -1 });
      }
      return { data: data, rand: rand };
    }

    function xorData() {
      var rand = prng(SEED_XOR), data = [];
      for (var i = 0; i < 8; i++) {
        var left = blob('left', rand), right = blob('right', rand), both = new Uint8Array(CELLS);
        for (var k = 0; k < CELLS; k++) both[k] = left[k] | right[k];
        data.push({ x: left, y: 1 }, { x: right, y: 1 }, { x: both, y: -1 }, { x: new Uint8Array(CELLS), y: -1 });
      }
      return { data: data, rand: rand };
    }

    function shuffledOrder(n, rand) {
      var order = [];
      for (var i = 0; i < n; i++) order.push(i);
      for (var j = n - 1; j > 0; j--) {
        var k = Math.floor(rand() * (j + 1)), t = order[j];
        order[j] = order[k]; order[k] = t;
      }
      return order;
    }

    /* Rosenblatt's rule, one example per step: on a mistake, w += y·x and b += y. */
    function perceptron(set) {
      var data = set.data, rand = set.rand;
      var w = new Float32Array(CELLS), b = 0;
      var snaps = [new Float32Array(w)], errors = [];
      var order = [], solvedAt = -1;
      function trainingErrors() {
        var e = 0;
        for (var i = 0; i < data.length; i++) {
          var s = b, x = data[i].x;
          for (var k = 0; k < CELLS; k++) if (x[k]) s += w[k];
          if (data[i].y * s <= 0) e++;
        }
        return e;
      }
      errors.push(trainingErrors());
      for (var step = 1; step <= K; step++) {
        if (!order.length) order = shuffledOrder(data.length, rand);
        var ex = data[order.shift()], s = b;
        for (var k = 0; k < CELLS; k++) if (ex.x[k]) s += w[k];
        if (ex.y * s <= 0) {
          for (var m = 0; m < CELLS; m++) if (ex.x[m]) w[m] += ex.y;
          b += ex.y;
        }
        snaps.push(new Float32Array(w));
        var e = trainingErrors();
        errors.push(e);
        if (e === 0 && solvedAt < 0) solvedAt = step;
      }
      return { snaps: snaps, errors: errors, solvedAt: solvedAt, bias: b };
    }

    function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

    /* 400 → 2 sigmoid hidden → 1 sigmoid output, cross-entropy, full-batch backpropagation.
       Momentum 0.9 is what makes two hidden units enough: plain gradient descent on this
       XOR set stalls around 16 of 160 errors and never leaves; with momentum it clears
       them by epoch ~50, which is the shape the Divide phase needs to show. */
    function backprop(set) {
      var data = set.data, rand = prng(SEED_DIVIDE), H = 2, lr = 4, mom = 0.9;
      var W = [new Float32Array(CELLS), new Float32Array(CELLS)], bh = [0, 0];
      var v = [(rand() - 0.5), (rand() - 0.5)], bo = 0;
      var mW = [new Float32Array(CELLS), new Float32Array(CELLS)], mbh = [0, 0], mv = [0, 0], mbo = 0;
      for (var j0 = 0; j0 < H; j0++) for (var k0 = 0; k0 < CELLS; k0++) W[j0][k0] = (rand() - 0.5) * 0.2;
      var snaps = [], errors = [], solvedAt = -1, n = data.length;
      function snap() { var s = new Float32Array(2 * CELLS); s.set(W[0], 0); s.set(W[1], CELLS); snaps.push(s); }
      function forward(x) {
        var h = [bh[0], bh[1]];
        for (var j = 0; j < H; j++) { var w = W[j]; for (var k = 0; k < CELLS; k++) if (x[k]) h[j] += w[k]; h[j] = sigmoid(h[j]); }
        return { h: h, o: sigmoid(bo + v[0] * h[0] + v[1] * h[1]) };
      }
      function trainingErrors() {
        var e = 0;
        for (var i = 0; i < n; i++) { var f = forward(data[i].x); if ((f.o > 0.5) !== (data[i].y > 0)) e++; }
        return e;
      }
      snap(); errors.push(trainingErrors());
      for (var epoch = 1; epoch <= E; epoch++) {
        var gW = [new Float32Array(CELLS), new Float32Array(CELLS)], gbh = [0, 0], gv = [0, 0], gbo = 0;
        for (var i = 0; i < n; i++) {
          var x = data[i].x, t = data[i].y > 0 ? 1 : 0, f = forward(x), d = f.o - t;
          gbo += d;
          for (var j = 0; j < H; j++) {
            gv[j] += d * f.h[j];
            var dh = d * v[j] * f.h[j] * (1 - f.h[j]);
            gbh[j] += dh;
            var g = gW[j];
            for (var k = 0; k < CELLS; k++) if (x[k]) g[k] += dh;
          }
        }
        mbo = mom * mbo - lr * gbo / n;
        bo += mbo;
        for (var q = 0; q < H; q++) {
          mv[q] = mom * mv[q] - lr * gv[q] / n;
          v[q] += mv[q];
          mbh[q] = mom * mbh[q] - lr * gbh[q] / n;
          bh[q] += mbh[q];
          for (var m = 0; m < CELLS; m++) {
            mW[q][m] = mom * mW[q][m] - lr * gW[q][m] / n;
            W[q][m] += mW[q][m];
          }
        }
        snap();
        var e = trainingErrors();
        errors.push(e);
        if (e === 0 && solvedAt < 0) solvedAt = epoch;
      }
      return { snaps: snaps, errors: errors, solvedAt: solvedAt };
    }

    function trainAll() {
      var teach = perceptron(teachData());
      var xorSet = xorData();
      var xor = perceptron({ data: xorSet.data, rand: prng(SEED_XOR + 1) });
      var divide = backprop(xorSet);
      var checks = {
        teachSolved: teach.solvedAt > 0 && teach.errors[K] === 0,
        xorNeverSolved: xor.errors.every(function (e) { return e > 0; }),
        divideSolved: divide.solvedAt > 0 && divide.errors[E] === 0
      };
      checks.ok = checks.teachSolved && checks.xorNeverSolved && checks.divideSolved;
      return { N: N, K: K, E: E, teach: teach, xor: xor, divide: divide, checks: checks };
    }

    return { N: N, K: K, E: E, trainAll: trainAll };
  })();

  root.GCRetina = Retina;
  if (typeof document === 'undefined') return;

  var doc = document, html = doc.documentElement;
  html.classList.add('js');

  var reduced = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var phone = root.matchMedia ? root.matchMedia('(max-width: 699px)') : { matches: false };

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function window01(p, a, b) { return clamp01((p - a) / (b - a)); }

  /* Per-chapter progress. Pinned acts: share of the pin travelled. Flow acts: share of the
     section the viewport's midline has passed. Works whether or not the engine is running. */
  function progressOf(el) {
    var r = el.getBoundingClientRect(), vh = root.innerHeight || 1;
    if (el.hasAttribute('data-sc-pin') || el.hasAttribute('data-sc-pan') || el.hasAttribute('data-sc-scrub')) {
      var travel = r.height - vh;
      if (travel > vh * 0.1) return clamp01(-r.top / travel);
    }
    return clamp01((vh / 2 - r.top) / (r.height || 1));
  }

  function onReady(fn) {
    if (doc.readyState !== 'loading') { fn(); return; }
    doc.addEventListener('readystatechange', function handler() {
      if (doc.readyState === 'loading') return;
      doc.removeEventListener('readystatechange', handler);
      fn();
    });
  }

  onReady(function () {
    /* The engine drives every data-sc-* device: pin heights, cues, pans, the scrub
       video and the counters. It is loaded with defer, so it does not exist yet when
       readyState first turns "interactive": deferred scripts run after that and
       before DOMContentLoaded. Mount there, before anything measures the page. */
    function mountEngine() {
      if (!root.ScrollCraft || root.ScrollCraft.instances.length) return;
      try { root.scrollCraft = root.ScrollCraft.mount(doc); }
      catch (err) { if (root.console) console.warn('[home] scrollcraft mount failed', err); }
    }
    if (root.ScrollCraft) mountEngine();
    else doc.addEventListener('DOMContentLoaded', mountEngine, { once: true });
    swapPhoneSources();
    var chapters = Array.prototype.slice.call(doc.querySelectorAll('[data-chapter]'));
    var folio = doc.querySelector('[data-folio]');
    var plate = initRetina(folio);
    var head = initRunningHead(folio, chapters);
    initContents();
    initClips();
    initPlane();
    initTable();
    initPrint(plate);

    var queued = false;
    function frame() {
      queued = false;
      var active = activeChapter(chapters);
      head.update(active);
      if (plate) plate.update(active);
      clipsTick();
    }
    function queue() { if (!queued) { queued = true; root.requestAnimationFrame(frame); } }
    root.addEventListener('scroll', queue, { passive: true });
    root.addEventListener('resize', function () { if (plate) plate.resize(); queue(); });
    if (reduced.addEventListener) reduced.addEventListener('change', queue);
    frame();
  });

  function activeChapter(chapters) {
    var mid = (root.innerHeight || 0) / 2, found = null;
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].getBoundingClientRect().top <= mid) found = chapters[i];
      else break;
    }
    return found || chapters[0];
  }

  /* -------------------------------------------------- phone media cuts -- */
  function swapPhoneSources() {
    if (!phone.matches) return;
    doc.querySelectorAll('video[data-src-m], video[data-poster-m]').forEach(function (v) {
      if (v.dataset.posterM) v.poster = v.dataset.posterM;
      if (v.dataset.srcM) {
        if (v.dataset.src) v.dataset.src = v.dataset.srcM;
        else if (v.getAttribute('src')) v.setAttribute('src', v.dataset.srcM);
      }
    });
  }

  /* --------------------------------------------------------- the Retina -- */
  var CAPTIONS = {
    zero: 'Untrained. One weight for each of 400 inputs, all zero.',
    teach: 'Learning to tell a cross from a ring.',
    learned: 'Learned. Orange weights excite, blue inhibit.',
    xor: 'Asked for XOR: one half lit, not both. A single layer cannot learn this.',
    divide: 'Two layers, trained by backpropagation.',
    solved: 'Two layers, trained by backpropagation. Solved.',
    peak: 'This plate: one weight for each of 400 inputs.',
    rest: ''
  };

  function colourResolver(host) {
    var probe = doc.createElement('span'), px = doc.createElement('canvas').getContext('2d');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.position = 'absolute';
    probe.style.width = '0';
    probe.style.height = '0';
    probe.style.overflow = 'hidden';
    host.appendChild(probe);
    return function (name, fallback) {
      probe.style.color = 'var(' + name + ')';
      var css = getComputedStyle(probe).color;
      if (!px || !css) return fallback;
      px.clearRect(0, 0, 1, 1);
      px.fillStyle = fallback;
      px.fillStyle = css;
      px.fillRect(0, 0, 1, 1);
      var d = px.getImageData(0, 0, 1, 1).data;
      return 'rgba(' + d[0] + ',' + d[1] + ',' + d[2] + ',' + (d[3] / 255).toFixed(3) + ')';
    };
  }

  function drawMaps(ctx, width, height, maps, colours) {
    ctx.clearRect(0, 0, width, height);
    var max = 0, n = maps.length;
    maps.forEach(function (m) { for (var i = 0; i < m.length; i++) { var a = Math.abs(m[i]); if (a > max) max = a; } });
    var gapMaps = n > 1 ? Math.round(width * 0.05) : 0;
    var side = Math.min(height, (width - gapMaps * (n - 1)) / n);
    var pitch = side / 20, inset = pitch >= 5 ? Math.max(1, Math.round(pitch / 9)) : 0;
    var top = (height - side) / 2;
    for (var j = 0; j < n; j++) {
      var left = j * (side + gapMaps) + (width - (side * n + gapMaps * (n - 1))) / 2;
      for (var r = 0; r < 20; r++) {
        for (var c = 0; c < 20; c++) {
          var x = left + c * pitch, y = top + r * pitch, s = pitch - inset;
          var w = maps[j][r * 20 + c];
          ctx.globalAlpha = 1;
          ctx.fillStyle = colours.zero;
          ctx.fillRect(x, y, s, s);
          if (max > 0 && w !== 0) {
            ctx.globalAlpha = Math.abs(w) / max;
            ctx.fillStyle = w > 0 ? colours.pos : colours.neg;
            ctx.fillRect(x, y, s, s);
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function splitDivide(snap) { return [snap.subarray(0, 400), snap.subarray(400, 800)]; }

  function initRetina(folio) {
    var fig = folio && folio.querySelector('[data-retina]');
    var canvas = fig && fig.querySelector('canvas');
    if (!canvas || !canvas.getContext) return null;
    var cap = fig.querySelector('figcaption');
    var t0 = (root.performance || Date).now();
    var model = Retina.trainAll();
    fig.dataset.trainMs = String(Math.round((root.performance || Date).now() - t0));
    if (!model.checks.ok) {
      fig.dataset.trainCheck = 'fail';
      if (root.console) console.error('Retina training check failed', model.checks);
    } else {
      fig.dataset.trainCheck = 'ok';
    }
    canvas.hidden = false;
    var ctx = canvas.getContext('2d');
    var resolve = colourResolver(folio);
    var colours = null, lastKey = '', lastCap = null, lastGround = '';
    var K = model.K, E = model.E, zero = new Float32Array(400);

    function resize() {
      var dpr = root.devicePixelRatio || 1;
      var w = canvas.clientWidth || 176, h = canvas.clientHeight || 176;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      lastKey = '';
    }
    resize();

    function state(active) {
      var phase = active ? active.getAttribute('data-retina-phase') : null;
      var p = active ? progressOf(active) : 0, rm = reduced.matches;
      if (!phase) return { phase: 'zero', index: 0, caption: CAPTIONS.zero };
      if (phase === 'teach') {
        var ti = rm ? K : Math.round(window01(p, 0.10, 0.85) * K);
        return { phase: 'teach', index: ti, caption: model.teach.solvedAt > 0 && ti >= model.teach.solvedAt ? CAPTIONS.learned : CAPTIONS.teach };
      }
      if (phase === 'xor') {
        return { phase: 'xor', index: rm ? K : Math.round(window01(p, 0.15, 0.9) * K), caption: CAPTIONS.xor };
      }
      if (phase === 'divide') {
        if (!rm && p < 0.55) return { phase: 'xor', index: K, caption: CAPTIONS.xor };
        var di = rm ? E : Math.round(window01(p, 0.55, 0.95) * E);
        return { phase: 'divide', index: di, caption: model.divide.solvedAt > 0 && di >= model.divide.solvedAt ? CAPTIONS.solved : CAPTIONS.divide };
      }
      var peak = active.hasAttribute('data-peak') && (rm || p >= 0.36);
      return { phase: 'rest', index: K, caption: peak ? CAPTIONS.peak : CAPTIONS.rest };
    }

    function mapsFor(s) {
      if (s.phase === 'zero') return [zero];
      if (s.phase === 'teach' || s.phase === 'rest') return [model.teach.snaps[s.index]];
      if (s.phase === 'xor') return [model.xor.snaps[s.index]];
      return splitDivide(model.divide.snaps[s.index]);
    }

    function update(active) {
      var ground = folio.getAttribute('data-ground') || 'paper';
      if (ground !== lastGround || !colours) {
        lastGround = ground;
        colours = {
          pos: resolve('--retina-pos', '#D9530F'),
          neg: resolve('--retina-neg', '#1D4ED0'),
          zero: resolve('--retina-zero', 'rgba(18,23,34,0.09)')
        };
        lastKey = '';
      }
      var s = state(active), key = s.phase + ':' + s.index;
      if (key !== lastKey) {
        lastKey = key;
        drawMaps(ctx, canvas.width, canvas.height, mapsFor(s), colours);
        fig.setAttribute('data-sc-verify-state', key);
      }
      if (s.caption !== lastCap) { lastCap = s.caption; cap.textContent = s.caption; }
    }

    return {
      update: update,
      resize: resize,
      model: model,
      paint: function (canvasEl, phase) {
        var c = canvasEl.getContext('2d');
        var light = { pos: '#D9530F', neg: '#1D4ED0', zero: 'rgba(18,23,34,0.09)' };
        var maps = phase === 'teach' ? [model.teach.snaps[K]] : phase === 'xor' ? [model.xor.snaps[K]] : splitDivide(model.divide.snaps[E]);
        drawMaps(c, canvasEl.width, canvasEl.height, maps, light);
      }
    };
  }

  /* ----------------------------------------------------- running head -- */
  function initRunningHead(folio, chapters) {
    var dateEl = folio.querySelector('[data-folio-date]'), titleEl = folio.querySelector('[data-folio-title]');
    var links = Array.prototype.slice.call(doc.querySelectorAll('[data-toc] a, .sheet__list a'));
    var anchorFor = new Map(), lastId = null;
    chapters.forEach(function (c) { if (c.id) lastId = c.id; anchorFor.set(c, lastId); });
    var current = null;
    return {
      update: function (active) {
        if (active === current) return;
        current = active;
        folio.setAttribute('data-ground', active.getAttribute('data-ground') || 'paper');
        dateEl.textContent = active.getAttribute('data-date') || '';
        titleEl.textContent = active.getAttribute('data-title') || '';
        var id = anchorFor.get(active);
        links.forEach(function (a) {
          if (id && id !== 'title' && a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }
    };
  }

  /* ---------------------------------------------------- Contents sheet -- */
  function initContents() {
    var sheet = doc.querySelector('[data-contents-sheet]'), opener = doc.querySelector('[data-contents-open]');
    if (!sheet || !opener || typeof sheet.showModal !== 'function') return;
    var closer = sheet.querySelector('[data-contents-close]');
    opener.addEventListener('click', function () {
      sheet.showModal();
      opener.setAttribute('aria-expanded', 'true');
      var first = sheet.querySelector('.sheet__list a');
      if (first) first.focus();
    });
    closer.addEventListener('click', function () { sheet.close(); });
    sheet.addEventListener('close', function () {
      opener.setAttribute('aria-expanded', 'false');
      if (!sheet.dataset.navigating) opener.focus({ preventScroll: true });
      delete sheet.dataset.navigating;
    });
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) { sheet.close(); return; }
      var link = e.target.closest && e.target.closest('a[href^="#"]');
      if (link) {
        sheet.dataset.navigating = '1';
        sheet.close();
        var target = doc.getElementById(link.getAttribute('href').slice(1));
        if (target) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          root.setTimeout(function () { target.focus({ preventScroll: true }); }, 0);
        }
      }
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = Array.prototype.slice.call(sheet.querySelectorAll('a[href], button:not([disabled])'));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------- clips --
     once: loads within one viewport, plays once at its trigger, holds the last frame;
           under reduced motion the end frame is shown and nothing plays.
     loop: plays only while in view, pauses out of view; the caption button pauses it;
           under reduced motion it waits for the button. */
  var clips = [];

  function initClips() {
    doc.querySelectorAll('video[data-clip]').forEach(function (video) {
      var fig = video.closest('figure');
      var clip = {
        video: video, fig: fig, kind: video.getAttribute('data-clip'),
        toggle: fig && fig.querySelector('[data-clip-toggle]'),
        loaded: false, played: false, inView: false, userPaused: false,
        playAt: parseFloat(video.getAttribute('data-play-at') || '0'),
        scope: video.closest('[data-sc-pin], [data-sc-pan]') ? video.closest('[data-chapter]') : fig
      };
      video.muted = true;
      clips.push(clip);
      setState(clip, 'idle');
      if (clip.kind === 'once' && reduced.matches) {
        if (video.dataset.end) video.poster = video.dataset.end;
        setState(clip, 'still');
        return;
      }
      if (clip.toggle) {
        clip.toggle.addEventListener('click', function () {
          if (video.paused) { clip.userPaused = false; load(clip); playClip(clip); }
          else { clip.userPaused = true; video.pause(); }
        });
      }
      if (clip.kind === 'loop') {
        clip.userPaused = reduced.matches;
        showToggle(clip, true);
      }
      video.addEventListener('play', function () { setToggle(clip, true); setState(clip, 'playing'); });
      video.addEventListener('pause', function () { setToggle(clip, false); if (!video.ended) setState(clip, 'paused'); });
      video.addEventListener('ended', function () {
        if (clip.kind === 'once') { showToggle(clip, false); setState(clip, 'ended'); }
      });
    });

    if (!('IntersectionObserver' in root)) {
      clips.forEach(function (c) { c.inView = true; load(c); });
      return;
    }
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var c = clipFor(e.target);
        if (c && !(c.kind === 'once' && reduced.matches)) load(c);
        near.unobserve(e.target);
      });
    }, { rootMargin: '100% 0px' });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var c = clipFor(e.target);
        if (!c) return;
        c.inView = e.isIntersecting;
        if (c.kind === 'loop') {
          if (c.inView && !c.userPaused) { load(c); playClip(c); }
          else if (!c.inView && !c.video.paused) c.video.pause();
        }
      });
      clipsTick();
    }, { threshold: 0.35 });
    clips.forEach(function (c) { near.observe(c.video); seen.observe(c.video); });
  }

  function clipFor(video) { for (var i = 0; i < clips.length; i++) if (clips[i].video === video) return clips[i]; return null; }

  function load(clip) {
    if (clip.loaded || !clip.video.dataset.src) return;
    clip.loaded = true;
    clip.video.preload = 'auto';
    clip.video.src = clip.video.dataset.src;
  }

  function playClip(clip) {
    var p = clip.video.play();
    if (p && p.catch) p.catch(function () { setToggle(clip, false); });
  }

  function clipsTick() {
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      if (c.kind !== 'once' || c.played || !c.inView || reduced.matches) continue;
      if (c.playAt > 0 && progressOf(c.scope) < c.playAt) continue;
      c.played = true;
      load(c);
      showToggle(c, true);
      playClip(c);
    }
  }

  function showToggle(clip, on) { if (clip.toggle) clip.toggle.hidden = !on; }
  function setToggle(clip, playing) {
    if (!clip.toggle) return;
    clip.toggle.querySelector('span').textContent = playing ? 'Pause' : 'Play';
    var use = clip.toggle.querySelector('use');
    if (use) use.setAttribute('href', 'assets/icons.svg#' + (playing ? 'i-pause' : 'i-play'));
  }
  function setState(clip, s) { if (clip.fig) clip.fig.setAttribute('data-sc-verify-state', 'clip:' + clip.kind + ':' + s); }

  /* ------------------------------------------------- the model plane --
     The plot and table are set in markup from assets/model-economy.json. This reads the file
     again, recomputes every printed count and every dot position, and fails loudly on any
     mismatch. No ratio, average or derived figure is printed. */
  var PLANE = { X0: 72, X1: 620, Y0: 28, Y1: 356 };
  function planeX(price) { return PLANE.X0 + (Math.log10(price) + 1) / 3 * (PLANE.X1 - PLANE.X0); }
  function planeY(ctx) { return PLANE.Y1 - Math.log2(ctx / 200000) / Math.log2(12.5) * (PLANE.Y1 - PLANE.Y0); }
  function fmtInt(n) { return Number(n).toLocaleString('en-US'); }
  function fmtUsd(n) { return '$' + String(n); }

  function initPlane() {
    var fig = doc.querySelector('[data-plane]'), notice = doc.querySelector('[data-plane-notice]');
    if (!fig || !root.fetch) return;
    fig.setAttribute('data-sc-verify-state', 'plane:loading');
    root.fetch('assets/model-economy.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { checkPlane(data, fig, notice); })
      .catch(function () {
        fig.setAttribute('data-sc-verify-state', 'plane:unavailable');
        notice.hidden = false;
        notice.textContent = 'The model data could not be loaded here. ';
        var a = doc.createElement('a');
        a.href = 'assets/model-economy.json';
        a.textContent = 'Open the data file';
        notice.appendChild(a);
        notice.appendChild(doc.createTextNode('.'));
      });
  }

  function checkPlane(data, fig, notice) {
    var models = data.models || [], bad = [];
    var vendors = {}, inWindow = [];
    models.forEach(function (m) {
      vendors[m.vendor] = true;
      if (m.context_tokens >= 1000000 && m.context_tokens <= 1050000) inWindow.push(m.context_tokens);
    });
    var outs = models.map(function (m) { return m.output_usd_per_mtok; });
    var expected = {
      'models': String(models.length),
      'models-total': String(models.length),
      'vendors': String(Object.keys(vendors).length),
      'window': String(inWindow.length),
      'window-min': fmtInt(Math.min.apply(null, inWindow)),
      'window-max': fmtInt(Math.max.apply(null, inWindow)),
      'price-min': fmtUsd(Math.min.apply(null, outs)),
      'price-max': fmtUsd(Math.max.apply(null, outs))
    };
    Object.keys(expected).forEach(function (key) {
      doc.querySelectorAll('[data-count-key="' + key + '"]').forEach(function (el) {
        var count = el.getAttribute('data-sc-count');
        if (count) {
          var end = count.trim().split(/\s+/).pop();
          if (end !== expected[key]) bad.push(key + ' count');
        } else if (el.textContent.trim() !== expected[key]) {
          bad.push(key);
        }
      });
    });
    var byId = {};
    models.forEach(function (m) { byId[m.id] = m; });
    var dots = fig.querySelectorAll('[data-plane-dots] [data-id]');
    if (dots.length !== models.length) bad.push('dot total');
    Array.prototype.forEach.call(dots, function (dot) {
      var m = byId[dot.getAttribute('data-id')];
      if (!m) { bad.push('dot ' + dot.getAttribute('data-id')); return; }
      if (Math.abs(parseFloat(dot.getAttribute('cx')) - planeX(m.output_usd_per_mtok)) > 0.6 ||
          Math.abs(parseFloat(dot.getAttribute('cy')) - planeY(m.context_tokens)) > 0.6) bad.push('dot ' + m.id);
      if (dot.classList.contains('p-dot--mark') !== (m.id === 'claude-opus-5-5')) bad.push('mark ' + m.id);
    });
    var rows = doc.querySelectorAll('[data-catalogue-table] tbody tr');
    if (rows.length !== models.length) bad.push('row total');
    Array.prototype.forEach.call(rows, function (row) {
      var m = byId[row.getAttribute('data-id')], cells = row.querySelectorAll('td.num');
      if (!m || cells.length !== 3 ||
          Number(cells[0].dataset.value) !== m.context_tokens ||
          Number(cells[1].dataset.value) !== m.input_usd_per_mtok ||
          Number(cells[2].dataset.value) !== m.output_usd_per_mtok) bad.push('row ' + row.getAttribute('data-id'));
    });
    var src = fig.querySelector('[data-plane-source]');
    if (src) src.textContent = 'Source: ' + data.source + ', retrieved ' + data.retrieved + '. ' + data.note;

    if (bad.length) {
      fig.setAttribute('data-sc-verify-state', 'plane:mismatch:' + bad.join(','));
      notice.hidden = false;
      notice.classList.add('notice--fail');
      notice.textContent = 'Figure check failed against model-economy.json: ' + bad.join(', ') + '.';
      if (root.console) console.error('Model plane mismatch', bad);
    } else {
      fig.setAttribute('data-sc-verify-state', 'plane:ok:' + models.length);
    }
  }

  /* --------------------------------------------------- catalogue sort -- */
  function initTable() {
    var table = doc.querySelector('[data-catalogue-table]');
    if (!table) return;
    var ths = Array.prototype.slice.call(table.querySelectorAll('thead th'));
    var body = table.tBodies[0];
    ths.forEach(function (th, col) {
      var btn = th.querySelector('.sort');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        var numeric = btn.getAttribute('data-sort') === 'num';
        var rows = Array.prototype.slice.call(body.rows);
        rows.sort(function (a, b) {
          var ca = a.cells[col], cb = b.cells[col], r;
          if (numeric) r = Number(ca.dataset.value) - Number(cb.dataset.value);
          else r = ca.textContent.trim().localeCompare(cb.textContent.trim());
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach(function (r) { body.appendChild(r); });
        ths.forEach(function (h) { h.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
      });
    });
  }

  /* ------------------------------------------------------------- print -- */
  function initPrint(plate) {
    var added = [];
    root.addEventListener('beforeprint', function () {
      if (plate) {
        doc.querySelectorAll('[data-plate-print]').forEach(function (fig) {
          var c = fig.querySelector('canvas');
          if (c) plate.paint(c, fig.getAttribute('data-plate-print'));
        });
      }
      doc.querySelectorAll('.frame > video, .peak__frame > video').forEach(function (v) {
        var frame = v.parentNode;
        if (frame.querySelector('img')) return;
        var img = doc.createElement('img');
        img.src = v.dataset.end || v.poster;
        img.alt = '';
        img.width = v.width;
        img.height = v.height;
        frame.appendChild(img);
        added.push(img);
      });
    });
    root.addEventListener('afterprint', function () {
      added.forEach(function (img) { img.remove(); });
      added = [];
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
