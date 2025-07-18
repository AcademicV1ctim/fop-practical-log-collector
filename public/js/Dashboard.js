fetch('/api/user-info')
  .then(res => {
    if (!res.ok) throw new Error('User not logged in or session expired');
    return res.json();
  })
  .then(data => {
    document.getElementById('user-name').textContent = data.name || 'Guest';
    document.getElementById('user-class').textContent = data.class || 'N/A';
  })
  .catch(err => {
    console.warn('Fallback triggered:', err.message);
    document.getElementById('user-name').textContent = 'Guest';
    document.getElementById('user-class').textContent = 'N/A';
  });
