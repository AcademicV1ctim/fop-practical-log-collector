document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const ichatError = document.getElementById('ichatError');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    ichatError.textContent = '';

    const name = document.getElementById('nameInput').value.trim();
    const ichat = document.getElementById('ichatInput').value.trim();

    if (!name || !ichat) {
      ichatError.textContent = 'Please fill in all fields.';
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ichat })
      });

      if (res.ok) {
        const data = await res.json();

        //  Store tempUserId for OTP matching
        localStorage.setItem('tempUserId', data.user_id);

        //  OPTIONAL: Clean up any old data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        //  Redirect to OTP input
        window.location.href = '/verify-otp';
      } else {
        const errorText = await res.text();
        if (errorText.includes('ichat is already in use')) {
          ichatError.textContent = 'This ichat is already in use.';
        } else {
          ichatError.textContent = errorText || 'Login failed.';
        }
      }
    } catch (err) {
      console.error('Login request failed:', err);
      ichatError.textContent = 'Network error. Please try again.';
    }
  });
});
