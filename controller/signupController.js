import pool from '../db.js';

export const handleSignup = async (req, res, next) => {
    const { name, ichat, className } = req.body;

    if (!name || !ichat || !className) {
        return res.status(400).json({ error: 'Please fill all fields.' });
    }

    try {
        // 1. Check if class exists
        const classResult = await pool.query('SELECT id FROM class WHERE class = $1', [className]);

        let classId;
        if (classResult.rows.length > 0) {
            classId = classResult.rows[0].id;
        } else {
            // 2. Insert class if it doesn't exist
            const insertClass = await pool.query(
                'INSERT INTO class(class) VALUES($1) RETURNING id',
                [className]
            );
            classId = insertClass.rows[0].id;
        }

        // 3. Insert user with class_id
        const userResult = await pool.query(
            'INSERT INTO users (name, ichat, class_id) VALUES ($1, $2, $3) RETURNING id, name, ichat',
            [name, ichat, classId]
        );

        // 4. Set user data for JWT generation
        res.locals.userId = userResult.rows[0].id;
        res.locals.message = 'Signup successful';

        // 5. Continue to next middleware (generateToken, sendToken)
        next();

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};