import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Register a new user
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Promise representing the registration process
 * @throws {Error} When registration fails
 */
const registerUser = async (req, res) => {
  console.log('Register request received:', req.body); // Debug log

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide both username and password',
      });
    }

    const userExists = await User.findOne({ username });
    
    if (userExists) {
      return res.status(400).json({
        message: 'Username already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' },
    );

    console.log('User created successfully:', user.username); // Debug log

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error); // Debug log
    return res.status(400).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * Authenticate and login a user
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Promise representing the login process
 * @throws {Error} When login fails
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login attempt for username:', username);
    
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    console.log('Login successful for user:', username);
    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Server error during login:', error);
    return res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};

export { registerUser, loginUser };