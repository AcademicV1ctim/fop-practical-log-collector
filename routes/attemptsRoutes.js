// leastAttemptsRoutes.js
import express from 'express';
import { getLeastAttemptsByTopic } from '../controller/attemptsController.js';

const router = express.Router();

router.get('/least-attempts/:topic', getLeastAttemptsByTopic);

export default router;
