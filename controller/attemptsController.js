// controller/attemptsController.js
import pool from '../db.js';

// GET /attempts/least-attempts/:topic
// Returns the top users with the lowest TOTAL attempts to complete all questions in the topic
export const getLeastAttemptsByTopic = async (req, res) => {
  const { topic } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        u.name, 
        c.class,
        SUM(a.attempt_number) AS total_attempts
      FROM attempts a
      JOIN users u   ON a.user_id = u.id
      JOIN class c   ON u.class_id = c.id
      JOIN questions q 
        ON a.question_id = q.qid 
       AND a.topic_id    = q.tid
      WHERE a.is_correct = TRUE
        AND q.topic      = $1         -- dropdown value, e.g. 'Functions'
        AND q.tid NOT IN (1, 2)       -- your exclusion
      GROUP BY u.name, c.class
      ORDER BY total_attempts ASC
      LIMIT 10;
    `, [topic]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching least attempts by topic:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
