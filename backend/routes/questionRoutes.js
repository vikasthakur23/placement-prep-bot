import express from 'express';
const router = express.Router();
import { getQuestions, evaluateAnswer } from '../controllers/questionController.js';

router.route('/').get(getQuestions);
router.route('/evaluate').post(evaluateAnswer);

export default router;