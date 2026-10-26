/* Newsletter subscription — Netlify Forms with a graceful fallback. */
(function () {
  'use strict';
  var forms = document.querySelectorAll('form[name="katha-weekly"]');
  if (!forms.length) return;

  var KEY = 'chutney_subscribed';

  forms.forEach(function (form) {
    var status = form.querySelector('.sub-status');
    var button = form.querySelector('button[type="submit"]');

    try {
      if (localStorage.getItem(KEY)) {
        if (status) status.textContent = 'You are on the list. Check your inbox on Sunday.';
      }
    } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[name="email"]');
      var name = form.querySelector('input[name="first_name"]');
      if (!email || !email.value || email.value.indexOf('@') < 1) {
        if (status) { status.textContent = 'That email address does not look right.'; status.classList.add('err'); }
        if (email) email.focus();
        return;
      }
      if (status) { status.textContent = 'Adding you…'; status.classList.remove('err'); }
      if (button) button.disabled = true;

      var body = new URLSearchParams();
      body.set('form-name', 'katha-weekly');
      body.set('email', email.value.trim());
      body.set('first_name', name && name.value ? name.value.trim() : '');

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        done();
      }).catch(function () {
        // Local preview or non-Netlify host: keep the intent, say so plainly.
        try { localStorage.setItem(KEY, email.value.trim()); } catch (e) {}
        if (status) {
          status.classList.add('err');
          status.innerHTML = 'Could not reach the signup service from here. ' +
            'Email <a class="link-underline" href="mailto:vivgatesai@gmail.com?subject=Subscribe%20to%20Katha%20Weekly&body=Please%20add%20me%3A%20' +
            encodeURIComponent(email.value.trim()) + '">vivgatesai@gmail.com</a> and you are in.';
        }
        if (button) button.disabled = false;
      });

      function done() {
        try { localStorage.setItem(KEY, email.value.trim()); } catch (e) {}
        form.reset();
        if (status) {
          status.classList.remove('err');
          status.textContent = 'You are in. Issue ' + (window.__KATHA ? 'Nº ' + String(window.__KATHA.issues[0].issue_no).padStart(2, '0') : '') + ' lands Sunday.';
        }
        if (button) {
          button.disabled = false;
          var span = button.querySelector('span');
          if (span) span.textContent = 'Subscribed';
        }
      }
    });
  });
})();
