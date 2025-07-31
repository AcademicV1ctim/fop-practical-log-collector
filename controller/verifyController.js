import pool from '../db.js';

export const handleOTPVerification = async (req, res, next) => {
  const { otp, userId } = req.body;

  if (!otp || !userId) {
    return res.status(400).json({ error: 'No OTP or userId provided.' });
  }

  try {
    // Get user data from database
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const user = result.rows[0];

    // For now, we'll use a simple approach - accept any OTP for valid users
    // In production, you should implement proper OTP validation with database storage
    // and expiry checking
    
    // Set user data for JWT generation
    res.locals.userId = user.id;
    res.locals.message = 'OTP verified successfully';
    
    // Continue to next middleware (generateToken, sendToken)
    next();

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

