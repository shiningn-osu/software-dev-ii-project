import express from 'express';
import { addMeal, getMeals, deleteMeal } from '../controllers/mealController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyToken, addMeal);
router.get('/', verifyToken, getMeals);
router.delete('/:id', verifyToken, deleteMeal);

export default router;