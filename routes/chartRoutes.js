// routes/chartRoutes.js
import express from 'express';
import { getAllWeeklyRanking } from '../controller/chartController.js';

const router = express.Router();

router.get('/student-ranking', getAllWeeklyRanking);

export default router;
