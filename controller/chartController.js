// controller/chartController.js
import pool from '../db.js';

export const getAllWeeklyRanking = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM student_rankings');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching student ranking:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};