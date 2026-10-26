/* Katha Weekly — renders the issue archive from data/katha.json */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(iso) {
    var d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function load() {
    return fetch('data/katha.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('data ' + r.status);
      return r.json();
    });
  }

  function pickStories(issue) {
    var out = [], seen = {};
    issue.stories.forEach(function (s) {
      if (!s.local_image) return;
      var chCount = seen[s.channel] || 0;
      if (chCount >= 2) return;
      seen[s.channel] = chCount + 1;
      out.push(s);
    });
    return out.slice(0, 9);
  }

  function renderLatest(data) {
    var host = $('#katha-latest');
    if (!host) return;
    var iss = data.issues[0];
    host.innerHTML =
      '<span class="mono">Issue ' + String(iss.issue_no).padStart(2, '0') + ' · ' + esc(iss.label) + '</span>' +
      '<h3><a href="katha.html#' + esc(iss.id) + '">' + esc(iss.headline) + '</a></h3>' +
      '<p>' + esc(iss.dek) + '</p>';
  }

  function storyCard(s) {
    var take = (s.takeaways && s.takeaways[0]) || s.narration || '';
    return '<a class="story" href="' + esc(s.url || '#') + '" target="_blank" rel="noopener">' +
      '<div class="story-media">' +
      '<span class="story-channel"><i style="background:' + esc(s.neon || '#00e5ff') + '"></i>' + esc(s.channel) + '</span>' +
      '<img src="' + esc(s.local_image) + '" alt="" loading="lazy" width="900" height="675">' +
      '</div>' +
      '<div class="story-body">' +
      '<h4>' + esc(s.title) + '</h4>' +
      '<p>' + esc(take.slice(0, 190)) + (take.length > 190 ? '…' : '') + '</p>' +
      '<div class="story-foot"><span>' + fmtDate(s.date) + '</span><span class="go">Watch ↗</span></div>' +
      '</div></a>';
  }

  function renderSample(data) {
    var host = $('#sample-issue');
    if (!host) return;
    var iss = data.issues[0];
    var paras = String(iss.editorial || '').split(/\n{2,}/).filter(Boolean).slice(0, 2)
      .map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');
    host.innerHTML =
      '<div class="mono">Issue ' + String(iss.issue_no).padStart(2, '0') + ' · ' + esc(iss.label) + '</div>' +
      '<h3>' + esc(iss.headline) + '</h3>' +
      '<p><b>' + esc(iss.dek) + '</b></p>' +
      paras +
      '<div class="themes" style="display:flex;gap:.45rem;flex-wrap:wrap;margin-top:1rem">' +
      (iss.themes || []).map(function (t) {
        return '<span style="font-family:var(--f-mono);font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--line);padding:.3rem .55rem;color:var(--paper-dim)">' + esc(t) + '</span>';
      }).join('') + '</div>' +
      '<p class="mono" style="margin-top:1.2rem;color:var(--muted-2)">' + iss.item_count + ' stories · ' +
      (iss.channel_counts || []).length + ' sources · ' + iss.minutes + ' minutes of audio</p>';
  }

  function renderArchive(data) {
    var host = $('#issues-archive');
    if (!host) return;
    host.innerHTML = data.issues.map(function (iss) {
      return '<a class="issue-row" href="katha.html#' + esc(iss.id) + '">' +
        '<span class="no">Nº ' + String(iss.issue_no).padStart(2, '0') + '</span>' +
        '<b>' + esc(iss.headline) + '</b>' +
        '<span class="dek">' + esc(iss.dek) + '</span>' +
        '<span class="date">' + esc(iss.label) + '</span>' +
        '</a>';
    }).join('');
  }

  function renderIssue(data, id) {
    var reader = $('#issue-reader');
    if (!reader) return;
    var iss = data.issues.filter(function (i) { return i.id === id; })[0] || data.issues[0];

    $$('.issue-pick').forEach(function (b) {
      var on = b.getAttribute('data-issue') === iss.id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });

    var paras = String(iss.editorial || '').split(/\n{2,}/).filter(Boolean)
      .map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');

    var bars = (iss.channel_counts || []).map(function (c) {
      var pct = Math.round((c[1] / Math.max(1, iss.item_count)) * 100);
      var neon = ({ 'AI Engineer': '#00e5ff', 'Claude': '#b56cff', 'IBM Technology': '#4cc9f0', 'Caleb Writes Code': '#7cff6b', 'Prompt Engineering': '#ff4dff', 'Nate Herk | AI Automation': '#ffb020', 'Peter Diamandis / Moonshots': '#ffd60a', 'a16z Podcast': '#ff7a32' })[c[0]] || '#00e5ff';
      return '<div class="cbar"><div class="top"><span>' + esc(c[0]) + '</span><b>' + c[1] + '</b></div>' +
        '<div class="track"><div class="fill" data-w="' + pct + '" style="background:' + neon + '"></div></div></div>';
    }).join('');

    var picked = pickStories(iss);
    var stories = picked.map(storyCard).join('');
    var edWords = String(iss.editorial || '').trim().split(/\s+/).length;
    var readMin = Math.max(4, Math.round(edWords / 220) + 2);
    var cover = picked[0] || null;


    reader.innerHTML =
      '<div class="issue-cover">' +
        '<div>' +
          '<h2>' + esc(iss.headline) + '</h2>' +
          '<p class="dek">' + esc(iss.dek) + '</p>' +
          '<div class="themes">' + (iss.themes || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
          '<p class="mono" style="color:var(--paper-dim);margin-top:1rem">Written and edited by Vivek Mukhatyar · ' + readMin + ' min read · published Sunday</p>' +
          '<div class="issue-stats">' +
            '<div><b>' + iss.item_count + '</b>stories read</div>' +
            '<div><b>' + (iss.channel_counts || []).length + '</b>sources</div>' +
            '<div><b>' + iss.day_count + '</b>days</div>' +
            '<div><b>' + iss.minutes + '</b>minutes of audio</div>' +
          '</div>' +
        '</div>' +
        (cover ? '<figure class="cover-media">' +
          '<span class="stamp">Nº ' + String(iss.issue_no).padStart(2, '0') + '</span>' +
          '<img src="' + esc(cover.local_image) + '" alt="Issue cover: ' + esc(cover.title) + '" width="900" height="1125">' +
          '<span class="cap">Cover · ' + esc(cover.channel) + '</span>' +
        '</figure>' : '') +
      '</div>' +
      '<div class="editorial">' +
        '<article class="article-body">' + paras + '</article>' +
        '<aside class="aside-card">' +
          '<h4>Three things that changed</h4>' +
          '<ol>' + (iss.changed || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' +
          '<div class="do"><h4>Do this</h4><p>' + esc(iss.do_this) + '</p></div>' +
          '<div class="do"><h4>Listen instead</h4><p style="color:var(--paper-dim);font-size:.85rem">' + iss.minutes + ' minutes of narrated audio across ' + iss.day_count + ' daily briefings. The written issue is the argument; the audio is the evidence at length.</p></div>' +
        '</aside>' +
      '</div>' +
      '<div style="padding-top:clamp(2rem,4vw,3rem)">' +
        '<div class="kicker mono" style="color:var(--muted)">The evidence · ' + iss.item_count + ' stories, nine shown</div>' +
        '<div class="story-grid">' + stories + '</div>' +
      '</div>' +
      '<div style="padding-top:clamp(2rem,4vw,3rem)">' +
        '<div class="kicker mono" style="color:var(--muted)">Where it came from</div>' +
        '<div class="channel-bars">' + bars + '</div>' +
      '</div>' +
      (iss.outro ?
      '<blockquote class="throughline">' +
        '<span class="mono">The through-line, in the publisher\'s words</span>' +
        '<p>' + esc(iss.outro.split(/(?<=\.)\s/).slice(-3).join(' ').slice(0, 420)) + '</p>' +
      '</blockquote>' : '') +
      '<nav class="issue-nav" aria-label="Issue navigation">' +
        (function () {
          var idx = data.issues.indexOf(iss);
          var prev = data.issues[idx + 1], next = data.issues[idx - 1];
          var h = '';
          if (prev) h += '<a href="#' + prev.id + '" data-jump="' + prev.id + '"><span class="mono">← Older</span><b>' + esc(prev.headline) + '</b></a>';
          if (next) h += '<a class="next" href="#' + next.id + '" data-jump="' + next.id + '"><span class="mono">Newer →</span><b>' + esc(next.headline) + '</b></a>';
          return h;
        })() +
      '</nav>';

    // animate bars after paint
    requestAnimationFrame(function () {
      $$('#issue-reader .fill').forEach(function (f) { f.style.width = f.getAttribute('data-w') + '%'; });
    });

    // internal jump links should not reload
    $$('#issue-reader [data-jump]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = a.getAttribute('data-jump');
        history.replaceState(null, '', '#' + target);
        renderIssue(data, target);
        reader.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });
    });

    reader.setAttribute('data-current', iss.id);
  }

  function renderPicker(data) {
    var host = $('#issue-picker');
    if (!host) return;
    host.innerHTML = data.issues.map(function (iss) {
      return '<button class="issue-pick" role="tab" aria-selected="false" data-issue="' + esc(iss.id) + '">' +
        '<span class="mono">Nº ' + String(iss.issue_no).padStart(2, '0') + ' · ' + esc(iss.label) + '</span>' +
        '<b>' + esc(iss.headline) + '</b>' +
        '<small>' + iss.item_count + ' stories · ' + (iss.channel_counts || []).length + ' sources</small>' +
        '</button>';
    }).join('');
    $$('.issue-pick', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-issue');
        history.replaceState(null, '', '#' + id);
        renderIssue(data, id);
        $('#issue-reader').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  load().then(function (data) {
    window.__KATHA = data;
    renderLatest(data);
    renderSample(data);
    renderArchive(data);
    var count = $('#issue-count');
    if (count) count.textContent = data.issues.length;
    if ($('#issue-reader')) {
      renderPicker(data);
      renderIssue(data, (location.hash || '').replace('#', '') || data.issues[0].id);
      window.addEventListener('hashchange', function () {
        renderIssue(data, (location.hash || '').replace('#', '') || data.issues[0].id);
      });
    }
    // live data stamp
    $$('[data-katha-updated]').forEach(function (el) {
      el.textContent = data.generated.slice(0, 10);
    });
    $$('[data-katha-posts]').forEach(function (el) { el.textContent = Number(data.total_posts).toLocaleString('en-US'); });
  }).catch(function (err) {
    var reader = $('#issue-reader');
    if (reader) reader.innerHTML = '<p class="mono" style="color:var(--muted)">Issue data unavailable. Serve this page over HTTP (python3 -m http.server) rather than opening the file directly.</p>';
    var latest = $('#katha-latest');
    if (latest) latest.innerHTML = '<span class="mono">Latest issue loads from data/katha.json</span>';
    if (window.console) console.warn('Katha data failed', err);
  });
})();
