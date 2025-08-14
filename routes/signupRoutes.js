import express from 'express';
import { handleSignup } from '../controller/signupController.js';
import { generateToken, sendToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();

// GET /signup 
router.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: './views' });
});

// POST /signup 
router.post('/signup', handleSignup, generateToken, sendToken);

export default router;
