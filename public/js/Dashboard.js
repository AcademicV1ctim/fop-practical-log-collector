// Get token from localStorage
const token = localStorage.getItem('token');

if (!token) {
  console.warn('No token found, redirecting to login');
  window.location.href = '/login';
} else {
  fetchMethod('/api/user-info', (status, data) => {
    if (status === 200) {
      document.getElementById('user-name').textContent = data.name || 'Guest';
      document.getElementById('user-class').textContent = data.class || 'N/A';
    } else if (status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      console.warn('Error fetching user info:', data);
      document.getElementById('user-name').textContent = 'Guest';
      document.getElementById('user-class').textContent = 'N/A';
    }
  }, 'GET', null, token);
}
