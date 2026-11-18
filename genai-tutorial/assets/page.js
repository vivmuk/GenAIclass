/* Shared behaviour for the document pages (everything except the home page).
   The home page's home.js trains the retina and drives the scroll acts; it assumes
   elements that only exist there, so the other pages load this instead. */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  onReady(function () {
    var doc = document;

    // Contents sheet: the same dialog the home page uses, minus the chapter machinery.
    var sheet = doc.querySelector('[data-contents-sheet]');
    var opener = doc.querySelector('[data-contents-open]');
    if (sheet && opener && typeof sheet.showModal === 'function') {
      opener.addEventListener('click', function () { sheet.showModal(); });
      var closer = sheet.querySelector('[data-contents-close]');
      if (closer) closer.addEventListener('click', function () { sheet.close(); });
      sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
      sheet.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function () { sheet.close(); });
      });
    }

    // Folio head: show the section you are reading, the way the home page does.
    var dateEl = doc.querySelector('[data-folio-date]');
    var titleEl = doc.querySelector('[data-folio-title]');
    var sections = Array.prototype.slice.call(doc.querySelectorAll('[data-section]'));
    if (sections.length && titleEl && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (titleEl.textContent !== el.getAttribute('data-title')) {
            titleEl.textContent = el.getAttribute('data-title') || '';
          }
          if (dateEl) dateEl.textContent = el.getAttribute('data-date') || '';
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }

    // Sortable tables: click a header, sort by the cell's data-value when present.
    doc.querySelectorAll('table[data-sortable]').forEach(function (table) {
      var body = table.tBodies[0];
      if (!body) return;
      var dir = {};
      table.querySelectorAll('thead th').forEach(function (th, index) {
        if (th.hasAttribute('data-nosort')) return;
        th.style.cursor = 'pointer';
        th.setAttribute('role', 'button');
        th.setAttribute('tabindex', '0');
        function sort() {
          var asc = !dir[index];
          dir = {}; dir[index] = asc;
          var rows = Array.prototype.slice.call(body.rows);
          var numeric = th.getAttribute('data-type') === 'num';
          rows.sort(function (a, b) {
            var av = a.cells[index] ? (a.cells[index].getAttribute('data-value') || a.cells[index].textContent) : '';
            var bv = b.cells[index] ? (b.cells[index].getAttribute('data-value') || b.cells[index].textContent) : '';
            if (numeric) {
              var an = parseFloat(String(av).replace(/[^0-9.+-]/g, ''));
              var bn = parseFloat(String(bv).replace(/[^0-9.+-]/g, ''));
              return ((isNaN(an) ? -Infinity : an) - (isNaN(bn) ? -Infinity : bn)) * (asc ? 1 : -1);
            }
            return String(av).localeCompare(String(bv), undefined, { numeric: true }) * (asc ? 1 : -1);
          });
          rows.forEach(function (r) { body.appendChild(r); });
          table.querySelectorAll('thead th').forEach(function (h) { h.removeAttribute('aria-sort'); });
          th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
        }
        th.addEventListener('click', sort);
        th.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); }
        });
      });
    });
  });
})();
