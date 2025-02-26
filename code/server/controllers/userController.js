import User from '../models/userModel.js';

/**
 * Register a new user
 * @desc    Creates a new user account
 * @route   POST /api/users
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Promise<void>}
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      message: 'User registered',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
};

export { registerUser };