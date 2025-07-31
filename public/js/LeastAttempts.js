document.addEventListener('DOMContentLoaded', () => {
  const topicSelector = document.getElementById('tableSelector');
  const tableBody = document.getElementById('attemptsTableBody');
  let rawData = [];

  // Helper: Group by userId and questionId to find first correct attempt
  function getFirstCorrectAttempts(attempts) {
    const attemptMap = new Map();

    attempts.forEach(({ userId, questionId, attemptNumber, isCorrect }) => {
      const key = `${userId}-${questionId}`;
      if (!attemptMap.has(key)) {
        if (isCorrect) {
          attemptMap.set(key, attemptNumber);
        } else {
          attemptMap.set(key, Infinity); // in case they never got it correct
        }
      } else if (isCorrect && attemptNumber < attemptMap.get(key)) {
        attemptMap.set(key, attemptNumber);
      }
    });

    return attemptMap;
  }

  function calculateLeastAttempts(data) {
    const grouped = {};
    const questionCountPerTopic = {};

    data.forEach(({ topic, questionId }) => {
      if (!questionCountPerTopic[topic]) questionCountPerTopic[topic] = new Set();
      questionCountPerTopic[topic].add(questionId);
    });

    const firstCorrect = getFirstCorrectAttempts(data);
    const userTopicAttempts = {};

    data.forEach(({ userId, userName, userClass, topic, questionId, attemptNumber }) => {
      const key = `${userId}-${topic}`;
      const qKey = `${userId}-${questionId}`;
      const cutoff = firstCorrect.get(qKey);
      if (!cutoff || attemptNumber > cutoff) return;

      if (!userTopicAttempts[key]) {
        userTopicAttempts[key] = {
          userId,
          name: userName,
          class: userClass,
          topic,
          completedQuestions: new Set(),
          totalAttempts: 0
        };
      }

      userTopicAttempts[key].totalAttempts++;
      userTopicAttempts[key].completedQuestions.add(questionId);
    });

    // Filter users who completed all questions in the topic
    const results = Object.values(userTopicAttempts).filter(entry => {
      return entry.completedQuestions.size === questionCountPerTopic[entry.topic].size;
    });

    // Rank within topic
    const ranked = {};
    results.forEach(entry => {
      if (!ranked[entry.topic]) ranked[entry.topic] = [];
      ranked[entry.topic].push(entry);
    });

    Object.keys(ranked).forEach(topic => {
      ranked[topic].sort((a, b) => a.totalAttempts - b.totalAttempts);
      ranked[topic].forEach((entry, index) => {
        entry.rank = index + 1;
      });
    });

    return results;
  }

  function renderTable(topic) {
    const filtered = rawData.filter(row => row.topic === topic);
    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No data available</td></tr>`;
    } else {
      filtered.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${entry.rank}</td>
          <td>${entry.name}</td>
          <td>${entry.class}</td>
          <td>${entry.least_attempts}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('No token found, redirecting to login');
    window.location.href = '/login';
  } else {
    fetchMethod('/attempts/least-attempts', (status, data) => {
      if (status === 200) {
        rawData = data;
        renderTable(topicSelector.value);
        topicSelector.addEventListener('change', () => {
          renderTable(topicSelector.value);
        });
      } else if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('Error loading attempts:', data);
        tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
      }
    }, 'GET', null, token);
  }
});