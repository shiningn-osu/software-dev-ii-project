import express from 'express';
import User from '../models/userModel.js';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Will implement with real DB later
    res.json({ message: 'Profile route working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
