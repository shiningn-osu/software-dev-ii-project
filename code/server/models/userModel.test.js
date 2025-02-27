import mongoose from 'mongoose';
import User from './userModel.js';
import connectDB from '../config/db.js';

describe('User Model Test', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should validate user schema', () => {
    const validUser = new User({
      username: 'testuser',
      password: 'password123'
    });

    expect(validUser.username).toBe('testuser');
    expect(validUser.password).toBe('password123');
  });

  it('should create & save user successfully', async () => {
    const validUser = new User({
      username: 'testuser',
      password: 'password123'
    });

    const savedUser = await validUser.save();
    expect(savedUser.username).toBe('testuser');
    await User.deleteMany({});
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({
      username: 'testuser'
    });

    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.name).toBe('ValidationError');
  });

  it('should fail to save duplicate username', async () => {
    // First user
    const firstUser = new User({
      username: 'testuser',
      password: 'password123'
    });
    await firstUser.save();

    // Duplicate user
    const duplicateUser = new User({
      username: 'testuser',
      password: 'password123'
    });

    let err;
    try {
      await duplicateUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
  });
}); 