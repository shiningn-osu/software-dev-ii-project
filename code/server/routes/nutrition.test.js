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

    it('should return empty array for search with no results', async () => {
      const response = await request(app)
        .get('/api/nutrition/search?query=nonexistentfood')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });
}); 