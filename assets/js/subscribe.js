(function () {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxnMGBQcVHfy1rdh7G3RewSHW6Ut934lCFWomqb1V4vpMC4_92lBP6WqUr8qCjUemRN/exec'; // <-- paste the Apps Script Web App URL

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  async function submitEmail(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = $('#email', form).value.trim();
    const msg = $('#sub-msg', form);
    const hp  = $('#hp', form).value; // honeypot

    msg.textContent = 'Submitting...';

    if (!validateEmail(email)) {
      msg.textContent = 'Please enter a valid email.';
      return;
    }

    try {
      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          email,
          page: location.href,
          ua: navigator.userAgent,
          origin: location.origin,
          hp // honeypot (should be empty)
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        msg.textContent = 'Thanks! You are subscribed.';
        form.reset();
      } else if (data.duplicate) {
        msg.textContent = 'You are already subscribed.';
      } else {
        msg.textContent = data.error || 'Something went wrong. Please try again.';
      }
    } catch (err) {
      msg.textContent = 'Network error. Please try again.';
    }
  }

  // attach on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscribe-form');
    if (form) form.addEventListener('submit', submitEmail);
  });
})();
