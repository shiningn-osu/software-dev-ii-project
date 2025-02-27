import mongoose from 'mongoose';
import User from './userModel.js';

describe('User Model Test', () => {
  it('should validate user schema structure', () => {
    const validUser = new User({
      username: 'testuser',
      password: 'password123'
    });

    // Test required fields
    expect(validUser).toHaveProperty('username');
    expect(validUser).toHaveProperty('password');
    expect(validUser).toHaveProperty('createdAt');
    expect(validUser).toHaveProperty('updated');
    
    // Test values
    expect(validUser.username).toBe('testuser');
    expect(validUser.password).toBe('password123');
  });

  it('should have correct schema structure for preferences', () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      preferences: {
        dietaryRestrictions: ['vegan'],
        caloricGoal: 2000,
        macroSplit: {
          protein: 150,
          carbs: 200,
          fats: 70
        }
      }
    });

    expect(user.preferences).toHaveProperty('dietaryRestrictions');
    expect(user.preferences).toHaveProperty('caloricGoal');
    expect(user.preferences).toHaveProperty('macroSplit');
    expect(Array.isArray(user.preferences.dietaryRestrictions)).toBe(true);
  });
}); 