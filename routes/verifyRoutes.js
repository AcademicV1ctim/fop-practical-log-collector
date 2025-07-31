import express from 'express';
import { handleOTPVerification } from '../controller/verifyController.js';
import { generateToken, sendToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();

router.get('/verify-otp', (req, res) => {
  res.sendFile('otpVerification.html', { root: './views' }); 
});

router.post('/verify-otp', handleOTPVerification, generateToken, sendToken);

export default router;
