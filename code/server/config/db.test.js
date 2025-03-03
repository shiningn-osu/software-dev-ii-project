import mongoose from 'mongoose';
import connectDB from './db.js';

describe('Database Connection', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to the database successfully', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
    await mongoose.connection.close();
  });
}); 