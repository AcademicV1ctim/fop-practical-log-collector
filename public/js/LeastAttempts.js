document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('tableSelector');
  const tableBody = document.getElementById('attemptsTableBody');

  const loadLeaderboard = (topic) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const safeTopic = encodeURIComponent(topic);
  const url = `/attempts/least-attempts/${safeTopic}`; // <— matches effective path

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(async (res) => {
    if (!res.ok) {
      // helps debug if you ever get HTML back
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}...`);
    }
    return res.json();
  })
  .then(response => {
    tableBody.innerHTML = '';
    if (!response || response.length === 0) {
      tableBody.insertAdjacentHTML('beforeend', `<tr><td colspan="4">No data available</td></tr>`);
      return;
    }
    response.forEach((entry, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${entry.name}</td>
          <td>${entry.class}</td>
          <td>${entry.total_attempts}</td>
        </tr>`;
      tableBody.insertAdjacentHTML('beforeend', row);
    });
  })
  .catch(error => {
    console.error("Error fetching leaderboard:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
  });
};

  dropdown.addEventListener('change', () => {
    loadLeaderboard(dropdown.value);
  });

  loadLeaderboard(dropdown.value); // Initial load
});
