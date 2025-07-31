import express from 'express';
import pool from '../db.js';
import { verifyToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();

// GET /api/user-info 
router.get('/api/user-info', verifyToken, async (req, res) => {
  const userId = res.locals.userId;

  try {
    const result = await pool.query(`
      SELECT users.name, class.class
      FROM users
      JOIN class ON users.class_id = class.id
      WHERE users.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
