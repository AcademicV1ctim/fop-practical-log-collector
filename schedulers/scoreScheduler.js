import cron from 'node-cron';
import { updateUserScores } from '../services/scoreSystem.js';

cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('⏰ Running scheduled score update...');
    await updateUserScores();
    console.log('Scores updated successfully');
  } catch (err) {
    console.error('Failed to update scores:', err.message);
  }
});
