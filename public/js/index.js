document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const ichatError = document.getElementById('ichatError');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      ichatError.textContent = '';
      const name = document.getElementById('nameInput').value.trim();
      const ichat = document.getElementById('ichatInput').value.trim();

      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ichat })
      });

      if (res.ok) {
        // Redirect to OTP page or dashboard
        window.location.href = '/verify-otp';
      } else {
        const text = await res.text();
        if (text.includes('ichat is already in use')) {
          ichatError.textContent = 'This ichat is already in use.';
        } else {
          ichatError.textContent = text;
        }
      }
    });
  }
});
