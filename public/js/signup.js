// Check if user is already logged in
const token = localStorage.getItem('token');
if (token) {
  fetch('/userData', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    if (res.ok) {
      window.location.href = "/dashboard";
    }
  });
}