/* GenAI Chutney — apps index: group filter, group tiles, grid/table switch */
(function () {
  'use strict';
  var grid = document.getElementById('appGrid');
  var table = document.getElementById('appTable');
  if (!grid || !table) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.app-card'));
  var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filters .chip[data-group]'));
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.group-tile[data-jump]'));
  var views = Array.prototype.slice.call(document.querySelectorAll('.view-toggle .chip'));

  function apply(group) {
    cards.forEach(function (card) {
      card.hidden = group !== 'all' && card.getAttribute('data-group') !== group;
    });
    rows.forEach(function (row, i) {
      var card = cards[i];
      row.hidden = card ? card.hidden : false;
    });
    chips.forEach(function (c) {
      var on = c.getAttribute('data-group') === group;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    tiles.forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-jump') === group);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      apply(chip.getAttribute('data-group'));
    });
  });

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      var group = tile.getAttribute('data-jump');
      apply(group);
      document.getElementById('all-apps').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  views.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var view = btn.getAttribute('data-view');
      views.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      grid.classList.toggle('is-off', view === 'table');
      table.classList.toggle('is-on', view === 'table');
    });
  });

  /* deep link: apps.html#all-apps?group=health is not used, but ?group= is */
  var m = location.search.match(/[?&]group=([a-z]+)/);
  if (m && (m[1] === 'all' || document.querySelector('.group-tile[data-jump="' + m[1] + '"]'))) {
    apply(m[1]);
  }
})();
