import express from 'express';
import { addMeal, getMeals } from '../controllers/mealController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyToken, addMeal);
router.get('/', verifyToken, getMeals);

export default router;