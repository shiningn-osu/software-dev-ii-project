import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/userModel.js';
import * as userController from './userController.js';
import bcrypt from 'bcryptjs';

// Unit Tests
describe('User Controller - Unit Tests', () => {
  let req, res;
  let originalFindOne;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      statusCode: 200,
      jsonData: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.jsonData = data;
        return this;
      }
    };

    // Save original findOne
    originalFindOne = User.findOne;
  });

  afterEach(() => {
    // Restore original findOne
    User.findOne = originalFindOne;
  });

  describe('registerUser - Unit', () => {
    it('should validate required fields', async () => {
      await userController.registerUser(req, res);
      
      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual({
        message: 'Please provide both username and password'
      });
    });

    it('should handle database errors', async () => {
      req.body = { username: 'test', password: 'test123' };
      
      // Mock User.findOne to throw error
      User.findOne = async () => { throw new Error('DB Error'); };

      await userController.registerUser(req, res);
      
      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual({
        message: 'Error registering user',
        error: 'DB Error'
      });
    });
  });

  describe('loginUser - Unit', () => {
    it('should validate credentials', async () => {
      // Mock findOne to return null immediately
      User.findOne = async () => null;
      
      req.body = { username: 'test' }; // Missing password
      
      await userController.loginUser(req, res);
      
      expect(res.statusCode).toBe(401);
      expect(res.jsonData).toEqual({
        message: 'Invalid credentials'
      });
    });

    it('should handle invalid password', async () => {
      // Mock user found but password doesn't match
      User.findOne = async () => ({
        _id: 'testid',
        username: 'test',
        password: await bcrypt.hash('realpassword', 10)
      });

      req.body = { username: 'test', password: 'wrongpassword' };
      
      await userController.loginUser(req, res);
      
      expect(res.statusCode).toBe(401);
      expect(res.jsonData).toEqual({
        message: 'Invalid credentials'
      });
    });

    it('should handle database errors during login', async () => {
      // Mock database error
      User.findOne = async () => { throw new Error('DB Error'); };

      req.body = { username: 'test', password: 'test123' };
      
      await userController.loginUser(req, res);
      
      expect(res.statusCode).toBe(500);
      expect(res.jsonData).toEqual({
        message: 'Server error during login',
        error: 'DB Error'
      });
    });
  });
});

// Integration Tests
describe('User Controller - Integration Tests', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    app = express();
    app.use(express.json());
    app.post('/api/users/register', userController.registerUser);
    app.post('/api/users/login', userController.loginUser);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Registration Flow', () => {
    it('should complete full registration process', async () => {
      // Register new user
      const registerResponse = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(201);

      expect(registerResponse.body).toHaveProperty('token');
      expect(registerResponse.body.user.username).toBe('testuser');

      // Verify user exists in database
      const user = await User.findOne({ username: 'testuser' });
      expect(user).toBeTruthy();

      // Try logging in with created user
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
    });
  });

  describe('Authentication Flow', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('testpass', salt);
      await User.create({
        username: 'existinguser',
        password: hashedPassword
      });
    });

    it('should handle complete login flow', async () => {
      await request(app)
        .post('/api/users/login')
        .send({
          username: 'existinguser',
          password: 'wrongpass'
        })
        .expect(401);

      const successResponse = await request(app)
        .post('/api/users/login')
        .send({
          username: 'existinguser',
          password: 'testpass'
        })
        .expect(200);

      expect(successResponse.body).toHaveProperty('token');
    });
  });

  describe('API Error Handling', () => {
    it('should handle duplicate username registration', async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'duplicate',
          password: 'password123'
        })
        .expect(201);

      await request(app)
        .post('/api/users/register')
        .send({
          username: 'duplicate',
          password: 'password123'
        })
        .expect(400);
    });
  });
}); 