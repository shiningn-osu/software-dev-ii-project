const User = require('../models/userModel');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Add validation and hashing (e.g., bcrypt) here

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

module.exports = { registerUser };