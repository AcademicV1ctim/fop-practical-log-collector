import pool from '../db.js';
import { sendOTPEmail } from '../services/mailService.js';

export const handleLogin = async (req, res, next) => {
  const { name, ichat } = req.body;

  if (!name || !ichat) {
    return res.status(400).json({ error: 'Please fill all fields.' });
  }

  const client = await pool.connect();

  try {
    // Check if user exists with given ichat and name
    const result = await pool.query(
      'SELECT * FROM users WHERE ichat = $1 AND name = $2',
      [ichat, name]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Username or Email is Invalid.' });
    }

    const user = result.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in database or temporary storage
    // For now, we'll store it in res.locals for the next middleware
    res.locals.userId = user.id;
    res.locals.userName = user.name;
    res.locals.userIchat = user.ichat;
    res.locals.otp = otp;
    res.locals.otpExpiry = expiry;
    res.locals.message = 'OTP sent successfully';

    // Send OTP email
    await sendOTPEmail(ichat, otp);

    // Continue to next middleware (generateToken, sendToken)
    next();

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

