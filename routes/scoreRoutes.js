import express from 'express';
import { runScoreTest, triggerScoreUpdate, getUserScores, getTotalUserScore } from '../controller/scoreController.js';
import { verifyToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();
router.get('/update-scores', triggerScoreUpdate);
router.get('/test-scores', runScoreTest);

router.get('/get-user-scores',verifyToken , getUserScores);
router.get('/total-score', verifyToken, getTotalUserScore);

export default router;
