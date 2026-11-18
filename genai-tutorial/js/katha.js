/* Katha Weekly — renders the issue archive from data/katha.json into the doc
   design system (assets/doc.css, plus the few rules in assets/katha.css). */
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
  function no(iss) { return String(iss.issue_no).padStart(2, '0'); }

  function load() {
    return fetch('data/katha.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('data ' + r.status);
      return r.json();
    });
  }

  function findIssue(data, id) {
    return data.issues.filter(function (i) { return i.id === id; })[0] || null;
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

  function storyCard(s) {
    var take = (s.takeaways && s.takeaways[0]) || s.narration || '';
    return '<article class="doc__card">' +
      '<img src="' + esc(s.local_image) + '" alt="" loading="lazy" width="900" height="675">' +
      '<p><strong><a href="' + esc(s.url || '#') + '" target="_blank" rel="noopener">' + esc(s.title) + '</a></strong></p>' +
      '<p>' + esc(take.slice(0, 190)) + (take.length > 190 ? '…' : '') + '</p>' +
      '<p>' + esc(s.channel) + ' · ' + fmtDate(s.date) + ' · <a href="' + esc(s.url || '#') + '" target="_blank" rel="noopener">Watch ↗</a></p>' +
      '</article>';
  }

  function renderArchive(data) {
    var host = $('#issues-archive');
    if (!host) return;
    host.innerHTML = data.issues.map(function (iss) {
      return '<tr>' +
        '<td>' + esc(iss.label) + '</td>' +
        '<td class="num">' + no(iss) + '</td>' +
        '<td>' + esc(iss.headline) + '</td>' +
        '<td><a href="#' + esc(iss.id) + '" data-jump="' + esc(iss.id) + '">Read Nº ' + no(iss) + '</a></td>' +
        '</tr>';
    }).join('');
  }

  function renderPicker(data) {
    var host = $('#issue-picker');
    if (!host) return;
    host.innerHTML = data.issues.map(function (iss) {
      return '<button type="button" aria-pressed="false" aria-controls="issue-reader" data-issue="' + esc(iss.id) + '"' +
        ' title="' + esc(iss.headline) + ' · ' + iss.item_count + ' stories · ' + (iss.channel_counts || []).length + ' sources">' +
        'Nº ' + no(iss) + ' · ' + esc(iss.label) + '</button>';
    }).join('');
  }

  function renderIssue(data, id) {
    var reader = $('#issue-reader');
    if (!reader) return;
    var iss = findIssue(data, id) || data.issues[0];

    $$('#issue-picker [data-issue]').forEach(function (b) {
      var on = b.getAttribute('data-issue') === iss.id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    var paras = String(iss.editorial || '').split(/\n{2,}/).filter(Boolean)
      .map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');

    var sources = (iss.channel_counts || []).map(function (c) {
      var pct = Math.round((c[1] / Math.max(1, iss.item_count)) * 100);
      return '<tr><td>' + esc(c[0]) + '</td><td class="num">' + c[1] + '</td><td class="num">' + pct + '%</td></tr>';
    }).join('');

    var picked = pickStories(iss);
    var edWords = String(iss.editorial || '').trim().split(/\s+/).length;
    var readMin = Math.max(4, Math.round(edWords / 220) + 2);
    var cover = picked[0] || null;
    var idx = data.issues.indexOf(iss);
    var prev = data.issues[idx + 1], next = data.issues[idx - 1];

    reader.innerHTML =
      '<p class="doc__kicker">Issue ' + no(iss) + ' · ' + esc(iss.label) + '</p>' +
      '<h3 class="doc__h2">' + esc(iss.headline) + '</h3>' +
      '<p class="doc__standfirst">' + esc(iss.dek) + '</p>' +
      '<p class="doc__meta">' +
        '<span>Written and edited by <strong>Vivek Mukhatyar</strong></span>' +
        '<span><strong>' + readMin + '</strong> min read, published Sunday</span>' +
        '<span><strong>' + iss.item_count + '</strong> stories read</span>' +
        '<span><strong>' + (iss.channel_counts || []).length + '</strong> sources</span>' +
        '<span><strong>' + iss.day_count + '</strong> days</span>' +
        '<span><strong>' + iss.minutes + '</strong> minutes of audio</span>' +
        ((iss.themes || []).length ? '<span>Themes: <strong>' + iss.themes.map(esc).join(', ') + '</strong></span>' : '') +
      '</p>' +
      (cover ?
        '<figure>' +
          '<img src="' + esc(cover.local_image) + '" alt="Issue cover: ' + esc(cover.title) + '" width="900" height="1125">' +
          '<figcaption>Cover, Nº ' + no(iss) + ' · ' + esc(cover.channel) + '</figcaption>' +
        '</figure>' : '') +
      paras +
      '<h4 class="doc__h3">Three things that changed</h4>' +
      '<ol>' + (iss.changed || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' +
      '<div class="doc__note">' +
        '<p><strong>Do this.</strong> ' + esc(iss.do_this) + '</p>' +
        '<p><strong>Listen instead.</strong> ' + iss.minutes + ' minutes of narrated audio across ' + iss.day_count + ' daily briefings. The written issue is the argument; the audio is the evidence at length.</p>' +
      '</div>' +
      '<h4 class="doc__h3">The evidence · ' + iss.item_count + ' stories, ' + picked.length + ' shown</h4>' +
      '<div class="doc__grid">' + picked.map(storyCard).join('') + '</div>' +
      '<h4 class="doc__h3">Where it came from</h4>' +
      '<div class="table-scroll"><table class="table">' +
        '<caption>Stories per channel in issue Nº ' + no(iss) + ', ' + iss.item_count + ' in total.</caption>' +
        '<thead><tr><th scope="col">Channel</th><th scope="col" class="num">Stories</th><th scope="col" class="num">Share</th></tr></thead>' +
        '<tbody>' + sources + '</tbody>' +
      '</table></div>' +
      (iss.outro ?
        '<blockquote class="doc__quote">' +
          '<p>' + esc(iss.outro.split(/(?<=\.)\s/).slice(-3).join(' ').slice(0, 420)) + '</p>' +
          '<cite>The through-line, in the publisher\'s words</cite>' +
        '</blockquote>' : '') +
      ((prev || next) ?
        '<nav class="doc__meta" aria-label="Issue navigation">' +
          (prev ? '<span>← Older: <a href="#' + esc(prev.id) + '" data-jump="' + esc(prev.id) + '">' + esc(prev.headline) + '</a></span>' : '') +
          (next ? '<span>Newer →: <a href="#' + esc(next.id) + '" data-jump="' + esc(next.id) + '">' + esc(next.headline) + '</a></span>' : '') +
        '</nav>' : '');

    reader.setAttribute('data-current', iss.id);
  }

  function show(data, id, scroll) {
    history.replaceState(null, '', '#' + id);
    renderIssue(data, id);
    if (scroll) $('#issue-reader').scrollIntoView({ block: 'start' });
  }

  load().then(function (data) {
    window.__KATHA = data;
    renderArchive(data);
    var count = $('#issue-count');
    if (count) count.textContent = data.issues.length;
    if ($('#issue-reader')) {
      renderPicker(data);
      var initial = findIssue(data, (location.hash || '').replace('#', ''));
      renderIssue(data, initial ? initial.id : data.issues[0].id);
      if (initial) $('#issue-reader').scrollIntoView({ block: 'start' });

      document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('[data-issue], [data-jump]');
        if (!el) return;
        var id = el.getAttribute('data-issue') || el.getAttribute('data-jump');
        if (!findIssue(data, id)) return;
        e.preventDefault();
        show(data, id, true);
      });
      window.addEventListener('hashchange', function () {
        var iss = findIssue(data, (location.hash || '').replace('#', ''));
        if (iss) show(data, iss.id, true);
      });
    }
    $$('[data-katha-updated]').forEach(function (el) {
      el.textContent = data.generated.slice(0, 10);
    });
    $$('[data-katha-posts]').forEach(function (el) { el.textContent = Number(data.total_posts).toLocaleString('en-US'); });
  }).catch(function (err) {
    var reader = $('#issue-reader');
    if (reader) reader.innerHTML = '<div class="doc__note"><p>Issue data unavailable. Serve this page over HTTP (python3 -m http.server) rather than opening the file directly.</p></div>';
    var picker = $('#issue-picker');
    if (picker) picker.innerHTML = '';
    if (window.console) console.warn('Katha data failed', err);
  });
})();
