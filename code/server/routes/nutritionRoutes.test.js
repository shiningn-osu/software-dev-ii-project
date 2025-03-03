import request from 'supertest';
import express from 'express';
import nutritionRoutes from './nutritionRoutes.js';

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/nutrition', nutritionRoutes);

describe('Nutrition Routes - Basic Tests', () => {
  describe('Search Route', () => {
    it('GET /api/nutrition/search should require a query parameter', async () => {
      const response = await request(app).get('/api/nutrition/search');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Search query is required');
    });
  });
}); 