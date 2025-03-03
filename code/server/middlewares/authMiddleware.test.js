import { verifyToken } from './authMiddleware.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;
  let nextCalled;

  beforeEach(() => {
    nextCalled = false;
    req = {
      headers: {},
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
    next = () => {
      nextCalled = true;
    };
  });

  it('should return 401 if no authorization header', () => {
    verifyToken(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: 'No token provided'
    });
  });

  it('should return 401 if token format is invalid', () => {
    req.headers.authorization = 'InvalidFormat';
    
    verifyToken(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: 'Invalid token format'
    });
  });

  it('should call next() if token is valid', () => {
    process.env.JWT_SECRET = 'test_secret';
    const token = jwt.sign(
      { userId: '123' },
      process.env.JWT_SECRET
    );
    
    req.headers.authorization = `Bearer ${token}`;
    
    verifyToken(req, res, next);
    
    expect(nextCalled).toBe(true);
    expect(req.userId).toBe('123');
  });
});