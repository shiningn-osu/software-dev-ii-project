import { registerUser, loginUser } from './userController.js';
import User from '../models/userModel.js';

describe('User Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.body = data;
        return this;
      }
    };
  });

  describe('registerUser', () => {
    it('should return 400 if username or password is missing', async () => {
      await registerUser(req, res);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: 'Please provide both username and password'
      });
    });
  });

  describe('loginUser', () => {
    it('should return 401 if user is not found', async () => {
      req.body = { username: 'testuser', password: 'password' };
      
      // Override User.findOne for this test
      const originalFindOne = User.findOne;
      User.findOne = async () => null;

      await loginUser(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        message: 'Invalid credentials'
      });

      // Restore original method
      User.findOne = originalFindOne;
    });
  });
}); 