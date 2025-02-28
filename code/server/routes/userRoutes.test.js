import request from 'supertest';
import express from 'express';
import userRoutes from './userRoutes.js';

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes - Basic Tests', () => {
  describe('Public Routes', () => {
    it('GET /api/users/test should work', async () => {
      const response = await request(app).get('/api/users/test');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User routes are working');
    });

    it('GET /api/users/profile should work', async () => {
      const response = await request(app).get('/api/users/profile');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile route working');
    });
  });
}); 