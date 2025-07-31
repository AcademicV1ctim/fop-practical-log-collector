import express from 'express';
import usersRoutes from './usersRoutes.js';
import pointsRoutes from './pointsRoutes.js';
import classRoutes from './classRoutes.js';
import questionsRoutes from './questionsRoutes.js';
import badgesRoutes from './badgesRoutes.js';
import fastestRoutes from './fastestRoutes.js'
import attemptsRoutes from './attemptsRoutes.js';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';
import verifyRoutes from './verifyRoutes.js';
import userInfoRoutes from './userInfoRoutes.js';
import { generateToken, sendToken, verifyToken } from '../middleware/jwtMiddleware.js';
import scoreRoutes from './scoreRoutes.js';


const router = express.Router();

// Public routes (no authentication required)
router.use('/', signupRoutes);
router.use('/', loginRoutes);
router.use('/', verifyRoutes);

// Protected routes (require authentication)
router.use('/users', verifyToken, usersRoutes);
router.use('/points', verifyToken, pointsRoutes);
router.use('/class', verifyToken, classRoutes);
router.use('/questions', verifyToken, questionsRoutes);
router.use('/badges', verifyToken, badgesRoutes);
router.use('/attempts', verifyToken, attemptsRoutes);
router.use('/fastest', verifyToken, fastestRoutes);
router.use('/', verifyToken, userInfoRoutes);
router.use('/', verifyToken, scoreRoutes);

export default router;
