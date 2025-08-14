import pool from '../db.js';

import { calculateAllUserScores, updateUserScores } from '../services/scoreSystem.js';

export const runScoreTest = async (req, res) => {
  try {
    const scores = await calculateAllUserScores();
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate scores' });
  }
};


export const triggerScoreUpdate = async (req, res) => {
  try {
    await updateUserScores();
    res.status(200).json({ message: 'Scores updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Score update failed' });
  }
};

export const getUserScores = async (req, res) => {
  try {
    const userId = res.locals.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const result = await pool.query(
      'SELECT question_id, score FROM user_scores WHERE user_id = $1',
      [userId]
    );
    
    res.setHeader('Content-Type', 'application/json');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user scores:', err);
    res.status(500).json({ error: 'Failed to fetch user scores' });
  }
};


export const getTotalUserScore = async (req, res) => {
  try {
    const userId = res.locals.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID' });
    }

    const result = await pool.query(`
      SELECT SUM(score) AS total
      FROM user_scores
      WHERE user_id = $1
    `, [userId]);

    const totalScore = result.rows[0].total || 0;

    // Send valid JSON with Content-Type
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ totalScore });
  } catch (err) {
    console.error('Error fetching total score:', err);
    // Always return JSON even on error
    res.status(500).json({ error: 'Failed to fetch total score' });
  }
};
