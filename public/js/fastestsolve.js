document.addEventListener("DOMContentLoaded", function () {
    const callbackForFastestSolve = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const tableBody = document.querySelector("#leaderboard-body");
        tableBody.innerHTML = ""; // Clear existing rows

        responseData.forEach(entry => {
            const totalSeconds = Math.floor(entry.time_seconds);
            const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            const formattedTime = `${minutes}:${seconds}`;

            const row = document.createElement("tr");

            const rankCell = document.createElement("td");
            rankCell.textContent = entry.rank;

            const nameCell = document.createElement("td");
            nameCell.textContent = entry.name;

            const classCell = document.createElement("td");
            classCell.textContent = entry.class;

            const timeCell = document.createElement("td");
            timeCell.textContent = formattedTime;

            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(classCell);
            row.appendChild(timeCell);

            tableBody.appendChild(row);
        });

        const podiumData = [];
        const seenRanks = new Set();

        for (let i = 0; i < responseData.length && podiumData.length < 3; i++) {
            const entry = responseData[i];
            const rank = entry.rank;

            if (!seenRanks.has(rank)) {
                seenRanks.add(rank);

                let imageSrc = "";
                let imageAlt = "";
                if (rank === 1) {
                    imageSrc = "/pics/gold.png";
                    imageAlt = "1st Place";
                } else if (rank === 2) {
                    imageSrc = "/pics/silver.png";
                    imageAlt = "2nd Place";
                } else if (rank === 3) {
                    imageSrc = "/pics/bronze.png";
                    imageAlt = "3rd Place";
                }

                podiumData.push({
                    class: entry.class,
                    name: entry.name,
                    time: Math.floor(entry.time_seconds),
                    imgSrc: imageSrc,
                    imgAlt: imageAlt,
                    rank: rank
                });
            }
        }

        // Sort for display: 2nd, 1st, 3rd
        const podiumDisplayOrder = [2, 1, 3];
        podiumDisplayOrder.forEach(desiredRank => {
            const card = document.querySelector(`.podium-card.${getRankClass(desiredRank)}`);
            const entry = podiumData.find(p => p.rank === desiredRank);

            if (card && entry) {
                card.querySelector(".team-name").textContent = entry.class;
                card.querySelector(".student-name").textContent = entry.name;
                const minutes = String(Math.floor(entry.time / 60)).padStart(2, '0');
                const seconds = String(entry.time % 60).padStart(2, '0');
                card.querySelector(".time").textContent = `${minutes}:${seconds}`;
                const img = card.querySelector("img");
                img.src = entry.imgSrc;
                img.alt = entry.imgAlt;
            } else if (card) {
                // Clear if not present (e.g. no 3rd place due to tie at 2nd)
                card.querySelector(".team-name").textContent = "-";
                card.querySelector(".student-name").textContent = "-";
                card.querySelector(".time").textContent = "-";
                const img = card.querySelector("img");
                img.src = "";
                img.alt = "";
            }
        });

        function getRankClass(rank) {
            if (rank === 1) return "first";
            if (rank === 2) return "second";
            if (rank === 3) return "third";
            return "";
        }
    };

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token found, redirecting to login');
      window.location.href = '/login';
    } else {
      fetchMethod("http://localhost:3000/fastest", callbackForFastestSolve, 'GET', null, token);
    }
});
