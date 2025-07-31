// services/pointsSystem.js

import pool from '../db.js';


function calculateScoreFromAttempts(attempts, difficulty) {
  let base = 0;

  if (difficulty === 'Easy') base = 20;
  else if (difficulty === 'Medium') base = 35;
  else if (difficulty === 'Hard') base = 50;

  const firstCorrectIndex = attempts.findIndex(a => a.is_correct);
  if (firstCorrectIndex === -1) return 0;

  const wrongAttempts = firstCorrectIndex; // wrong attempts before first correct
  const score = Math.max(base - wrongAttempts, 1); // minimum 1 point

  return score;
}

export async function calculateAllUserScores() {
  const res = await pool.query(`
    SELECT 
      a.user_id, 
      a.question_id, 
      a.attempt_number, 
      a.is_correct,
      q.difficulty
    FROM attempts a
    JOIN questions q ON a.question_id = q.id
    ORDER BY a.user_id, a.question_id, a.attempt_number
  `);

  const grouped = {};
  for (const row of res.rows) {
    const key = `${row.user_id}-${row.question_id}`;
    if (!grouped[key]) {
      grouped[key] = {
        userId: row.user_id,
        questionId: row.question_id,
        difficulty: row.difficulty,
        attempts: []
      };
    }
    grouped[key].attempts.push(row);
  }

  return Object.values(grouped).map(({ userId, questionId, difficulty, attempts }) => {
    const score = calculateScoreFromAttempts(attempts, difficulty);
    return { userId, questionId, score };
  });
}

export async function updateUserScores() {
  const scores = await calculateAllUserScores();

  for (const { userId, questionId, score } of scores) {
    await pool.query(`
      INSERT INTO user_scores (user_id, question_id, score)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, question_id)
      DO UPDATE SET score = EXCLUDED.score;
    `, [userId, questionId, score]);
  }

  console.log('Scores successfully updated.');
}

// 5. Optional standalone testing (node services/pointsSystem.js)
// if (import.meta.url === process.argv[1]) {
//   const scores = await calculateAllUserScores();
//   console.log('📊 Calculated Scores:', scores);
// }
