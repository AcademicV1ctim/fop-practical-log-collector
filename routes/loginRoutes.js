// routes/loginRoutes.js
import express from 'express';
import { handleLogin } from '../controller/loginController.js';
import { generateToken, sendToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();

// GET /login 
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './views' });
});

// POST /login
router.post('/login', handleLogin, generateToken, sendToken);

export default router;
