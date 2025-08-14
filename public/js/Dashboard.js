// Get token from localStorage
const token = localStorage.getItem('token');

function fetchMethod(url, callback, method = 'GET', body = null, token = '') {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  fetch(url, options)
    .then(res => {
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response');
      }
      return res.json().then(data => callback(res.status, data));
    })
    .catch(err => {
      console.error('Fetch failed:', err);
      callback(500, { error: err.message });
    });
}


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

  
async function fetchUserScores() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/get-user-scores', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const scores = await res.json();

    const container = document.getElementById('score-display');
    if (!container) return;

    container.innerHTML = '';

    if (scores.length === 0) {
      container.innerText = '0';
      return;
    }

    scores.forEach(({ question_id, score }) => {
      const div = document.createElement('div');
      div.textContent = `Question ${question_id}: ${score}`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Failed to fetch user scores:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  fetch('/total-score', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response');
      }
      return res.json();
    })
    .then(data => {
      const el = document.getElementById('total-score');
      if (el) {
        el.innerHTML = `${data.totalScore} `;
      }
    })
    .catch(err => {
      console.error('Failed to load total score:', err.message);
      const el = document.getElementById('total-score');
      if (el) {
        el.innerHTML = `0`;
      }
    });
});



window.addEventListener('DOMContentLoaded', fetchUserScores);
