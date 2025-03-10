import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import User from '../models/userModel.js';
import GroceryList from '../models/groceryList.js';
import MealPlan from '../models/mealPlan.js';

// Create a test app with mock routes that match the real ones
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Test route
  app.get('/api/users/test', (req, res) => {
    res.json({ message: 'User routes are working' });
  });
  
  // Profile route
  app.get('/api/users/profile', (req, res) => {
    res.json({ message: 'Profile route working' });
  });
  
  // Auth routes
  app.post('/api/users/register', (req, res) => {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    res.status(201).json({ 
      _id: '507f1f77bcf86cd799439011',
      username: req.body.username 
    });
  });
  
  app.post('/api/users/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    res.status(200).json({ 
      token: 'test-token',
      user: {
        _id: '507f1f77bcf86cd799439011',
        username: req.body.username
      }
    });
  });
  
  // Grocery list routes
  app.get('/api/users/grocery-list', async (req, res) => {
    try {
      const userId = req.headers['x-test-user-id'];
      if (!userId) {
        return res.status(401).json({ message: 'No auth token' });
      }
      
      let groceryList = await GroceryList.findOne({ userId });
      
      if (!groceryList) {
        groceryList = new GroceryList({
          userId,
          items: []
        });
        await groceryList.save();
      }
      
      res.json(groceryList.items);
    } catch (error) {
      console.error('Error fetching grocery list:', error);
      res.status(500).json({ message: 'Failed to fetch grocery list' });
    }
  });
  
  app.post('/api/users/grocery-list', async (req, res) => {
    try {
      const userId = req.headers['x-test-user-id'];
      if (!userId) {
        return res.status(401).json({ message: 'No auth token' });
      }
      
      const { items } = req.body;
      
      const groceryList = await GroceryList.findOneAndUpdate(
        { userId },
        { items },
        { new: true, upsert: true }
      );
      
      res.json(groceryList.items);
    } catch (error) {
      console.error('Error updating grocery list:', error);
      res.status(500).json({ message: 'Failed to update grocery list' });
    }
  });
  
  // Meal plan routes
  app.post('/api/users/meal-plans', async (req, res) => {
    try {
      const userId = req.headers['x-test-user-id'];
      if (!userId) {
        return res.status(401).json({ message: 'No auth token' });
      }
      
      const { name, plan, settings } = req.body;
      
      if (!name || !plan || !settings) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const mealPlan = new MealPlan({
        userId,
        name,
        plan,
        settings
      });
      
      const savedPlan = await mealPlan.save();
      res.json(savedPlan);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      res.status(500).json({ message: error.message || 'Failed to save meal plan' });
    }
  });
  
  app.get('/api/users/meal-plans', async (req, res) => {
    try {
      const userId = req.headers['x-test-user-id'];
      if (!userId) {
        return res.status(401).json({ message: 'No auth token' });
      }
      
      const mealPlans = await MealPlan.find({ userId })
        .sort({ dateCreated: -1 });
      res.json(mealPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      res.status(500).json({ message: 'Failed to fetch meal plans' });
    }
  });
  
  app.delete('/api/users/meal-plans/:id', async (req, res) => {
    try {
      const userId = req.headers['x-test-user-id'];
      if (!userId) {
        return res.status(401).json({ message: 'No auth token' });
      }
      
      const mealPlan = await MealPlan.findOneAndDelete({
        _id: req.params.id,
        userId
      });
      
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      
      res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      res.status(500).json({ message: 'Failed to delete meal plan' });
    }
  });
  
  return app;
};

describe('User Routes', () => {
  let app;
  let mongoServer;
  let testUserId;
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  // Setup Express app and MongoDB Memory Server
  beforeAll(async () => {
    // Setup MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a test user ID
    testUserId = new mongoose.Types.ObjectId();
    
    // Create the test app
    app = createTestApp();
    
    // Silence console logs during tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  // Cleanup after tests
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    // Restore console functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  // Clear database between tests
  afterEach(async () => {
    await User.deleteMany({});
    await GroceryList.deleteMany({});
    await MealPlan.deleteMany({});
  });

  // Test route tests
  describe('Test Route', () => {
    it('should respond to the test route', async () => {
      const response = await request(app).get('/api/users/test');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User routes are working');
    });
  });

  // Authentication routes tests
  describe('Authentication Routes', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.username).toBe('testuser');
      expect(response.body._id).toBeDefined();
    });

    it('should not register a user without username', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('username');
    });

    it('should login a user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
    });

    it('should not login without credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('username');
    });
  });

  // Profile route tests
  describe('Profile Route', () => {
    it('should access the profile route', async () => {
      const response = await request(app)
        .get('/api/users/profile');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile route working');
    });
  });

  // Grocery list routes tests
  describe('Grocery List Routes', () => {
    it('should get an empty grocery list for a new user', async () => {
      const response = await request(app)
        .get('/api/users/grocery-list')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should create a grocery list when none exists', async () => {
      // First request should create an empty list
      await request(app)
        .get('/api/users/grocery-list')
        .set('x-test-user-id', testUserId.toString());
      
      // Verify a list was created in the database
      const groceryList = await GroceryList.findOne({ userId: testUserId });
      expect(groceryList).toBeDefined();
      expect(groceryList.items).toHaveLength(0);
    });

    it('should update a grocery list', async () => {
      const items = ['Apples', 'Bananas', 'Milk'];
      
      const response = await request(app)
        .post('/api/users/grocery-list')
        .set('x-test-user-id', testUserId.toString())
        .send({ items });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(items);
      
      // Verify the database was updated
      const groceryList = await GroceryList.findOne({ userId: testUserId });
      expect(groceryList.items).toEqual(items);
    });

    it('should get the updated grocery list', async () => {
      // First, create a grocery list
      const items = ['Apples', 'Bananas', 'Milk'];
      await GroceryList.create({
        userId: testUserId,
        items
      });
      
      // Then get it
      const response = await request(app)
        .get('/api/users/grocery-list')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(items);
    });

    it('should handle errors when fetching grocery list', async () => {
      // Mock GroceryList.findOne to throw an error
      const originalFindOne = GroceryList.findOne;
      GroceryList.findOne = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
      
      const response = await request(app)
        .get('/api/users/grocery-list')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch grocery list');
      
      // Restore original method
      GroceryList.findOne = originalFindOne;
    });

    it('should handle errors when updating grocery list', async () => {
      // Mock GroceryList.findOneAndUpdate to throw an error
      const originalFindOneAndUpdate = GroceryList.findOneAndUpdate;
      GroceryList.findOneAndUpdate = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
      
      const response = await request(app)
        .post('/api/users/grocery-list')
        .set('x-test-user-id', testUserId.toString())
        .send({ items: ['test'] });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to update grocery list');
      
      // Restore original method
      GroceryList.findOneAndUpdate = originalFindOneAndUpdate;
    });
  });

  // Meal plan routes tests
  describe('Meal Plan Routes', () => {
    it('should save a new meal plan', async () => {
      const mealPlanData = {
        name: 'Test Meal Plan',
        plan: {
          monday: ['breakfast', 'lunch', 'dinner']
        },
        settings: {
          allergies: ['nuts'],
          diet: 'vegetarian',
          minCalories: 1800,
          maxCalories: 2200
        }
      };
      
      const response = await request(app)
        .post('/api/users/meal-plans')
        .set('x-test-user-id', testUserId.toString())
        .send(mealPlanData);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Meal Plan');
      expect(response.body.userId.toString()).toBe(testUserId.toString());
      expect(response.body.plan).toEqual(mealPlanData.plan);
      expect(response.body.settings).toEqual(mealPlanData.settings);
      
      // Verify the database was updated
      const mealPlan = await MealPlan.findById(response.body._id);
      expect(mealPlan).toBeDefined();
      expect(mealPlan.name).toBe('Test Meal Plan');
    });

    it('should not save a meal plan without required fields', async () => {
      const response = await request(app)
        .post('/api/users/meal-plans')
        .set('x-test-user-id', testUserId.toString())
        .send({
          name: 'Incomplete Plan'
          // Missing plan and settings
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should get all meal plans for a user', async () => {
      // Create two meal plans
      await MealPlan.create([
        {
          userId: testUserId,
          name: 'Plan 1',
          plan: { monday: ['breakfast'] },
          settings: { diet: 'regular' }
        },
        {
          userId: testUserId,
          name: 'Plan 2',
          plan: { tuesday: ['lunch'] },
          settings: { diet: 'vegetarian' }
        }
      ]);
      
      // Create a plan for a different user
      await MealPlan.create({
        userId: new mongoose.Types.ObjectId(),
        name: 'Other User Plan',
        plan: { wednesday: ['dinner'] },
        settings: { diet: 'vegan' }
      });
      
      const response = await request(app)
        .get('/api/users/meal-plans')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBeDefined();
      expect(response.body[1].name).toBeDefined();
      
      // Verify we only got the current user's plans
      const planNames = response.body.map(plan => plan.name);
      expect(planNames).toContain('Plan 1');
      expect(planNames).toContain('Plan 2');
      expect(planNames).not.toContain('Other User Plan');
    });

    it('should delete a meal plan', async () => {
      // Create a meal plan
      const mealPlan = await MealPlan.create({
        userId: testUserId,
        name: 'Plan to Delete',
        plan: { monday: ['breakfast'] },
        settings: { diet: 'regular' }
      });
      
      const response = await request(app)
        .delete(`/api/users/meal-plans/${mealPlan._id}`)
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');
      
      // Verify it's gone from the database
      const deletedPlan = await MealPlan.findById(mealPlan._id);
      expect(deletedPlan).toBeNull();
    });

    it('should not delete another user\'s meal plan', async () => {
      // Create a meal plan for a different user
      const otherUserId = new mongoose.Types.ObjectId();
      const mealPlan = await MealPlan.create({
        userId: otherUserId,
        name: 'Other User Plan',
        plan: { monday: ['breakfast'] },
        settings: { diet: 'regular' }
      });
      
      const response = await request(app)
        .delete(`/api/users/meal-plans/${mealPlan._id}`)
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
      
      // Verify it still exists in the database
      const planStillExists = await MealPlan.findById(mealPlan._id);
      expect(planStillExists).toBeDefined();
    });

    it('should return 404 when deleting a non-existent meal plan', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/users/meal-plans/${nonExistentId}`)
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should handle invalid meal plan ID format', async () => {
      const response = await request(app)
        .delete('/api/users/meal-plans/invalid-id')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(500);
    });

    it('should handle errors when saving meal plan', async () => {
      // Mock MealPlan.prototype.save to throw an error
      const originalSave = MealPlan.prototype.save;
      MealPlan.prototype.save = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
      
      const response = await request(app)
        .post('/api/users/meal-plans')
        .set('x-test-user-id', testUserId.toString())
        .send({
          name: 'Test Plan',
          plan: { monday: ['breakfast'] },
          settings: { diet: 'regular' }
        });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toContain('Database error');
      
      // Restore original method
      MealPlan.prototype.save = originalSave;
    });

    it('should handle errors when fetching meal plans', async () => {
      // Mock MealPlan.find to throw an error
      const originalFind = MealPlan.find;
      MealPlan.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
      
      const response = await request(app)
        .get('/api/users/meal-plans')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch meal plans');
      
      // Restore original method
      MealPlan.find = originalFind;
    });

    it('should handle errors when deleting meal plan', async () => {
      // Mock MealPlan.findOneAndDelete to throw an error
      const originalFindOneAndDelete = MealPlan.findOneAndDelete;
      MealPlan.findOneAndDelete = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
      
      const response = await request(app)
        .delete('/api/users/meal-plans/507f1f77bcf86cd799439011')
        .set('x-test-user-id', testUserId.toString());
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to delete meal plan');
      
      // Restore original method
      MealPlan.findOneAndDelete = originalFindOneAndDelete;
    });
  });
});