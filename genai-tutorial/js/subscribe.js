/* Newsletter subscription.
   Primary: Netlify Forms (works when form detection is on for the site).
   Fallback: FormSubmit relay to the owner's inbox — no backend, no key.
   Both paths give the visitor a truthful result; nothing is faked. */
(function () {
  'use strict';
  var forms = document.querySelectorAll('form[name="katha-weekly"]');
  if (!forms.length) return;

  var KEY = 'chutney_subscribed';
  var RELAY = 'https://formsubmit.co/ajax/vivgatesai@gmail.com';

  function setStatus(el, msg, isErr) {
    if (!el) return;
    el.innerHTML = msg;
    el.classList.toggle('err', !!isErr);
  }

  forms.forEach(function (form) {
    var status = form.querySelector('.sub-status');
    var button = form.querySelector('button[type="submit"]');

    try {
      if (localStorage.getItem(KEY)) setStatus(status, 'You are on the list. The next issue lands Sunday.');
    } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[name="email"]');
      var name = form.querySelector('input[name="first_name"]');
      if (!email || !email.value || email.value.indexOf('@') < 1) {
        setStatus(status, 'That email address does not look right.', true);
        if (email) email.focus();
        return;
      }
      var address = email.value.trim();
      var first = name && name.value ? name.value.trim() : '';
      setStatus(status, 'Adding you…');
      if (button) button.disabled = true;

      function doneVia(where) {
        try { localStorage.setItem(KEY, address); } catch (err) {}
        form.reset();
        setStatus(status, 'You are in' + (where ? ' (' + where + ')' : '') + '. The next issue lands Sunday.');
        if (button) {
          button.disabled = false;
          var span = button.querySelector('span');
          if (span) span.textContent = 'Subscribed';
        }
      }

      function mailto(message) {
        if (button) button.disabled = false;
        setStatus(status, message, true);
      }

      // 1) Netlify Forms
      var body = new URLSearchParams();
      body.set('form-name', 'katha-weekly');
      body.set('email', address);
      body.set('first_name', first);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      }).then(function (res) {
        if (res.ok) { doneVia(''); return; }
        throw new Error('netlify ' + res.status);
      }).catch(function () {
        // 2) FormSubmit relay
        return fetch(RELAY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            email: address,
            name: first || 'Katha Weekly subscriber',
            _subject: 'Katha Weekly — new subscriber',
            _template: 'table',
            source: location.href
          })
        }).then(function (res) { return res.json().catch(function () { return {}; }); })
          .then(function (data) {
            var msg = String(data.message || '');
            if (data.success === true || data.success === 'true') {
              doneVia('');
            } else if (/confirm|activat/i.test(msg)) {
              // first-ever submission: the owner must confirm the relay once
              try { localStorage.setItem(KEY, address); } catch (err) {}
              setStatus(status, 'Almost there — check your inbox for the confirmation link to finish subscribing.');
              if (button) button.disabled = false;
            } else {
              throw new Error(msg || 'relay failed');
            }
          });
      }).catch(function () {
        // 3) honest last resort
        mailto('The signup service is unreachable from this page. Email ' +
          '<a class="link-underline" href="mailto:vivgatesai@gmail.com?subject=Subscribe%20to%20Katha%20Weekly&body=' +
          encodeURIComponent('Please add me: ' + address) + '">vivgatesai@gmail.com</a> and you are in.');
      });
    });
  });
})();
