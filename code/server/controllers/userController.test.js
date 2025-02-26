import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from './userController.js';
import User from '../models/userModel.js';

// Mock dependencies
jest.mock('../models/userModel.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        username: 'testuser',
        password: 'password123',
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      // Mock implementations
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({
        _id: 'userId123',
        username: 'testuser',
      });
      jwt.sign.mockReturnValue('mockToken');

      await registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          id: 'userId123',
          username: 'testuser',
        },
        token: 'mockToken',
      });
    });

    it('should return error if username already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'testuser' });

      await registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Username already exists',
      });
    });
  });

  describe('loginUser', () => {
    it('should successfully login a user', async () => {
      // Mock implementations
      User.findOne.mockResolvedValue({
        _id: 'userId123',
        username: 'testuser',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await loginUser(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: 'userId123',
          username: 'testuser',
        },
        token: 'mockToken',
      });
    });

    it('should return error for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      await loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });
}); 