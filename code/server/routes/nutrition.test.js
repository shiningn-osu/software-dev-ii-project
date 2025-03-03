import request from 'supertest';
import express from 'express';
import nutritionRoutes from './nutrition.js';

describe('Nutrition Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/nutrition', nutritionRoutes);
  });

  describe('GET /api/nutrition/search', () => {
    it('should return 400 if query parameter is missing', async () => {
      const response = await request(app)
        .get('/api/nutrition/search')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Search query is required'
      });
    });
  });
}); 