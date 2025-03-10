import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Meal from '../models/mealModel.js';
import * as mealController from './mealController.js';

describe('Meal Controller', () => {
  let app;
  let mongoServer;
  let token;
  let userId;

  beforeAll(async () => {
    // Setup MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create Express app
    app = express();
    app.use(express.json());

    // Setup test user ID
    userId = new mongoose.Types.ObjectId();
    
    // Mock auth middleware
    app.use((req, res, next) => {
      req.userId = userId.toString();
      next();
    });

    // Setup routes
    app.post('/api/meals', mealController.addMeal);
    app.get('/api/meals', mealController.getMeals);
    app.delete('/api/meals/:id', mealController.deleteMeal);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Meal.deleteMany({});
  });

  describe('POST /api/meals', () => {
    it('should add a new meal and return 201 status', async () => {
      const mealData = {
        name: 'Test Meal',
        img: 'test.jpg',
        recipe: 'Test recipe',
        ingredients: [
          {
            name: 'Ingredient 1',
            weight: 100,
            nutrition: { calories: 100, protein: 10, carbs: 20, fats: 5 }
          }
        ],
        nutrition: { calories: 100, protein: 10, carbs: 20, fats: 5 }
      };

      const response = await request(app)
        .post('/api/meals')
        .send(mealData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(mealData.name);
      expect(response.body.creator.toString()).toBe(userId.toString());
    });

    it('should return 500 if saving fails', async () => {
      const response = await request(app)
        .post('/api/meals')
        .send({}) // Missing required fields
        .expect(500);

      expect(response.body).toEqual({ message: 'Failed to add meal' });
    });
  });

  describe('GET /api/meals', () => {
    it('should return meals for the user', async () => {
      // Create a test meal first
      const testMeal = await Meal.create({
        name: 'Meal 1',
        creator: userId,
        ingredients: [
          { 
            name: 'Ingredient 1', 
            weight: 100,
            nutrition: {
              calories: 100,
              protein: 10,
              carbs: 20,
              fats: 5
            }
          }
        ],
        nutrition: {
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 10
        }
      });

      const response = await request(app)
        .get('/api/meals')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Meal 1');
    });

    it('should handle missing optional data in meals', async () => {
      // Create a meal with only required fields
      await Meal.create({
        name: 'Basic Meal',
        creator: userId
      });

      const response = await request(app)
        .get('/api/meals')
        .expect(200);

      expect(response.body[0].name).toBe('Basic Meal');
      expect(response.body[0].nutrition).toEqual({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
      expect(response.body[0].ingredients).toEqual([]);
    });

    it('should return empty array when no meals exist', async () => {
      const response = await request(app)
        .get('/api/meals')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('DELETE /api/meals/:id', () => {
    it('should delete a meal and return success message', async () => {
      const testMeal = await Meal.create({
        name: 'Test Meal',
        creator: userId
      });

      const response = await request(app)
        .delete(`/api/meals/${testMeal._id}`)
        .expect(200);

      expect(response.body).toEqual({ message: 'Meal deleted successfully' });
      
      // Verify deletion
      const deletedMeal = await Meal.findById(testMeal._id);
      expect(deletedMeal).toBeNull();
    });

    it('should return 404 if meal not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/meals/${nonExistentId}`)
        .expect(404);

      expect(response.body).toEqual({ message: 'Meal not found' });
    });
  });
});