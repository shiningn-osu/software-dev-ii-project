import request from 'supertest';
import app from './server.js';
import mongoose from 'mongoose';

afterAll(async () => {
  // Close database connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Basic Server Tests', () => {
  test('GET /test endpoint should work', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Server is working');
  });

  test('GET /api/test endpoint should work', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Server is working');
  });

  test('GET /api/nutrition/overview should return empty array', async () => {
    const response = await request(app).get('/api/nutrition/overview');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});