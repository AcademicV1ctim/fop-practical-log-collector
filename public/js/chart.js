document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('No token found, redirecting to login');
    window.location.href = '/login';
    return;
  }

  const callbackForStudentRanking = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const container = document.getElementById('line-chart');
    container.innerHTML = `
      <h2>Weekly Class Ranking</h2>
      <canvas id="rankingChart" width="600" height="400"></canvas>
    `;

    if (responseStatus !== 200 || !Array.isArray(responseData)) {
      console.error("Unexpected response or format:", responseStatus, responseData);
      return;
    }

    const weeks = [...new Set(responseData.map(row => row.week))].sort();
    const students = [...new Set(responseData.map(row => row.student_name))];

    const datasets = students.map(student => {
      const studentData = weeks.map(week => {
        const record = responseData.find(row => row.student_name === student && row.week === week);
        return record ? record.rank : null;
      });
      return {
        label: student,
        data: studentData,
        borderColor: getRandomColor(),
        tension: 0.3,
        fill: false
      };
    });

    const ctx = document.getElementById('rankingChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeks,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Weekly Class Ranking'
          }
        },
        scales: {
          y: {
            reverse: true,
            beginAtZero: false,
            title: {
              display: true,
              text: 'Rank (1st = Best)'
            },
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    function getRandomColor() {
      return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    }
  };

  fetchMethod('/student-ranking', callbackForStudentRanking, 'GET', null, token);
});
