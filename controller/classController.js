// controller/classController.js
import pool from '../db.js';

export const getAllClass = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM class');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

export const getAllClassRank = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
WITH user_total_scores AS (
  SELECT
    user_id,
    SUM(score) AS total_score
  FROM
    user_scores
  GROUP BY
    user_id
),
user_scores_with_class AS (
  SELECT
    uts.total_score,
    u.class_id
  FROM
    user_total_scores uts
  JOIN
    users u ON u.id = uts.user_id
)
SELECT
  c.class,
  SUM(COALESCE(uswc.total_score, 0)) AS total_class_score
FROM
  user_scores_with_class uswc
JOIN
  class c ON c.id = uswc.class_id
GROUP BY
  c.class
HAVING
  SUM(COALESCE(uswc.total_score, 0)) > 0
ORDER BY
  total_class_score DESC;

      `);
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

// export const addUserWithPoints = async (req, res) => {
//   const { name, class_id, question_id } = req.body;
//   const client = await pool.connect();
//   try {
//     const userResult = await client.query(
//       'INSERT INTO users (name, class_id) VALUES ($1, $2) RETURNING id',
//       [name, class_id]
//     );
//     const userId = userResult.rows[0].id;

//     await client.query(
//       'INSERT INTO points (user_id, question_id) VALUES ($1, $2)',
//       [userId, question_id]
//     );

//     res.status(201).json({ message: 'User and points added successfully.' });
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     client.release();
//   }
// };
