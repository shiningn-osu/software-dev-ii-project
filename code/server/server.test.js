import request from 'supertest';
import app from './server.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mock token for testing
const generateTestToken = (userId = 'testuser123') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret');
};

describe('Server Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/testdb');
  });

  afterAll(async () => {
    // Cleanup
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear test collections
    await mongoose.connection.dropDatabase();
  });

  describe('Basic Routes', () => {
    test('GET /test should return success message', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Server is working');
    });

    test('GET /api/test should return success message', async () => {
      const response = await request(app).get('/api/test');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Server is working');
    });
  });

  describe('Nutrition Routes', () => {
    test('GET /api/nutrition/overview should return empty array', async () => {
      const response = await request(app).get('/api/nutrition/overview');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/nutrition/goals without token should return 401', async () => {
      const response = await request(app).get('/api/nutrition/goals');
      expect(response.status).toBe(401);
    });

    test('GET /api/nutrition/goals with token should return default goals', async () => {
      const token = generateTestToken();
      const response = await request(app)
        .get('/api/nutrition/goals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
    });

    test('GET /api/nutrition/recent should return empty meals array', async () => {
      const response = await request(app).get('/api/nutrition/recent');
      expect(response.status).toBe(200);
      expect(response.body.meals).toEqual([]);
    });
  });

  describe('Authentication', () => {
    test('Invalid token format should return 401', async () => {
      const response = await request(app)
        .get('/api/nutrition/goals')
        .set('Authorization', 'InvalidToken');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token format');
    });

    test('No token should return 401', async () => {
      const response = await request(app)
        .get('/api/nutrition/goals');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });
}); 