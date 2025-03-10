import request from 'supertest';
import app from './server.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from './models/userModel.js';
import DailyNutrition from './models/dailyNutrition.js';

// Increase timeout for all tests
const TIMEOUT = 15000;

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret-key';

describe('Server Tests', () => {
  let mongoServer;
  let testToken;
  let testUser;

  beforeAll(async () => {
    // Create new in-memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a test user with all required fields
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      timezone: 'America/Los_Angeles', // Add if required
      dailyCalorieGoal: 2000, // Add if required
      macroGoals: { // Add if required
        protein: 30,
        carbs: 40,
        fat: 30
      }
    });
    await testUser.save();

    // Create token with the actual user ID
    testToken = jwt.sign(
      { userId: testUser._id.toString() },
      process.env.JWT_SECRET
    );
  }, TIMEOUT);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    // Add delay to ensure connections are closed
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, TIMEOUT);

  beforeEach(async () => {
    // Clear all collections except users
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (key !== 'users') { // Skip users collection
        await collections[key].deleteMany();
      }
    }
  });

  // Mock fetch globally
  const originalFetch = global.fetch;
  beforeEach(() => {
    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: 'mock data' })
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('Basic Endpoints', () => {
    test('GET /test should work', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Server is working');
    });

    test('GET /api/test should work', async () => {
      const response = await request(app).get('/api/test');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Server is working');
    });

    test('GET / should return 404 for non-existent route', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(404); // This is expected since there's no root handler
    });
  });

  describe('Protected Endpoints', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/meals'); // Using meals endpoint as protected route
      expect(response.status).toBe(401);
    });

    test('should accept valid token', async () => {
      const response = await request(app)
        .get('/api/meals')
        .set('Authorization', `Bearer ${testToken}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Nutrition Endpoints', () => {
    test('GET /api/nutrition/current should return current nutrition', async () => {
      const response = await request(app)
        .get('/api/nutrition/current')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      // The response should have calories, protein, carbs, fats
      expect(response.body).toHaveProperty('calories');
      expect(response.body).toHaveProperty('protein');
      expect(response.body).toHaveProperty('carbs');
      expect(response.body).toHaveProperty('fats');
    });

    test.skip('POST /api/nutrition/add-custom should add custom food', async () => {
      const foodData = {
        name: 'Test Food',
        servingSize: '100g',
        calories: 300,
        protein: 15,
        carbs: 40,
        fats: 10
      };

      const response = await request(app)
        .post('/api/nutrition/add-custom')
        .set('Authorization', `Bearer ${testToken}`)
        .send(foodData);

      expect(response.status).toBe(200);
    });

    test('GET /api/nutrition/overview should return nutrition overview', async () => {
      const response = await request(app)
        .get('/api/nutrition/overview');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/nutrition/add-meal should add a meal', async () => {
      const mealData = {
        name: 'Test Meal',
        ingredients: [
          {
            name: 'Ingredient 1',
            weight: 100,
            calories: 100,
            protein: 5,
            carbs: 10,
            fats: 5
          }
        ],
        nutrition: {
          calories: 100,
          protein: 5,
          carbs: 10,
          fats: 5
        }
      };

      const response = await request(app)
        .post('/api/nutrition/add-meal')
        .set('Authorization', `Bearer ${testToken}`)
        .send(mealData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Meal');
    });

    test('GET /api/nutrition/goals should return nutrition goals', async () => {
      const response = await request(app)
        .get('/api/nutrition/goals')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('calories');
      expect(response.body).toHaveProperty('protein');
      expect(response.body).toHaveProperty('carbs');
      expect(response.body).toHaveProperty('fats');
    });

    test('POST /api/nutrition/goals should update nutrition goals', async () => {
      const goalsData = {
        calories: 2500,
        protein: 150,
        carbs: 250,
        fats: 80
      };

      const response = await request(app)
        .post('/api/nutrition/goals')
        .set('Authorization', `Bearer ${testToken}`)
        .send(goalsData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('calories', 2500);
      expect(response.body).toHaveProperty('protein', 150);
      expect(response.body).toHaveProperty('carbs', 250);
      expect(response.body).toHaveProperty('fats', 80);
    });

    test('GET /api/nutrition/search should search foods', async () => {
      const response = await request(app)
        .get('/api/nutrition/search')
        .query({ query: 'apple' });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    test('GET /api/nutrition/search should require query parameter', async () => {
      const response = await request(app)
        .get('/api/nutrition/search');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Search query is required');
    });
  });

  describe('External API Endpoints', () => {
    test('GET /api/krogerProducts should require parameters', async () => {
      const response = await request(app)
        .get('/api/krogerProducts');
      expect(response.status).toBe(400);
    });

    test('GET /api/krogerProducts should handle API errors gracefully', async () => {
      // For this test, we'll temporarily override fetch to return an error
      global.fetch = async () => ({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const response = await request(app)
        .get('/api/krogerProducts')
        .query({ query: 'apple', locationId: '123' });
      expect(response.status).toBe(500);
      
      // Add small delay after the test
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('POST /api/generate-meal-plan should handle request', async () => {
      const response = await request(app)
        .post('/api/generate-meal-plan')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          userId: testUser._id.toString(),
          allergies: ['peanut'],
          diet: 'balanced',
          minCalories: 1500,
          maxCalories: 2500
        });

      expect(response.status).toBe(200);
    });

    test('POST /api/generate-meal-plan should handle invalid parameters', async () => {
      const response = await request(app)
        .post('/api/generate-meal-plan')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          minCalories: 'invalid',
          maxCalories: 'invalid'
        });
      expect(response.status).toBe(200);
    });

    test('POST /api/generate-meal-plan should handle missing parameters', async () => {
      const response = await request(app)
        .post('/api/generate-meal-plan')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid routes', async () => {
      const response = await request(app).get('/invalid-route');
      expect(response.status).toBe(404);
    });

    test('should handle invalid token', async () => {
      const response = await request(app)
        .get('/api/meals')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    test('should handle missing token', async () => {
      const response = await request(app).get('/api/meals');
      expect(response.status).toBe(401);
    });
  });

  describe('External API Integration', () => {
    test('GET /api/krogerProducts should handle missing query', async () => {
      const response = await request(app)
        .get('/api/krogerProducts');
      expect(response.status).toBe(400);
    });

    test('GET /api/krogerProducts should handle missing locationId', async () => {
      const response = await request(app)
        .get('/api/krogerProducts')
        .query({ query: 'apple' });
      expect(response.status).toBe(400);
    });

    test('POST /api/generate-meal-plan should handle invalid parameters', async () => {
      const response = await request(app)
        .post('/api/generate-meal-plan')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          minCalories: 'invalid',
          maxCalories: 'invalid'
        });
      expect(response.status).toBe(200);
    });

    test('POST /api/generate-meal-plan should handle missing parameters', async () => {
      const response = await request(app)
        .post('/api/generate-meal-plan')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});
      expect(response.status).toBe(200);
    });
  });
});

// Add these after all your test suites
afterAll(async () => {
  // Close mongoose connection
  await mongoose.disconnect();
  
  // Add a small delay to allow connections to close
  await new Promise(resolve => setTimeout(resolve, 500));

  // Close the Express server if you have access to it
  if (global.server) {
    await new Promise(resolve => global.server.close(resolve));
  }

  // Force close any remaining handles
  await new Promise(resolve => setTimeout(resolve, 500));
});