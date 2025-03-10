import { verifyToken } from './authMiddleware.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;
  let nextCalled;
  let originalConsoleError;
  let originalJwtVerify;
  let originalEnv;

  beforeEach(() => {
    // Save original environment and console.error
    originalEnv = process.env.JWT_SECRET;
    originalConsoleError = console.error;
    originalJwtVerify = jwt.verify;
    
    // Set test environment
    process.env.JWT_SECRET = 'test_secret';
    console.error = () => {}; // Silence console errors
    
    // Setup test doubles
    nextCalled = false;
    req = {
      headers: {},
    };
    res = {
      statusCode: 200,
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

  afterEach(() => {
    // Restore original environment and functions
    process.env.JWT_SECRET = originalEnv;
    console.error = originalConsoleError;
    jwt.verify = originalJwtVerify;
  });

  it('should return 401 if no authorization header', () => {
    verifyToken(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: 'No token provided'
    });
    expect(nextCalled).toBe(false);
  });

  it('should return 401 if token format is invalid', () => {
    req.headers.authorization = 'InvalidFormat';
    
    verifyToken(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: 'Invalid token format'
    });
    expect(nextCalled).toBe(false);
  });

  it('should return 401 if token is invalid', () => {
    // Mock jwt.verify to throw an error
    jwt.verify = () => {
      throw new Error('Invalid token');
    };
    
    req.headers.authorization = 'Bearer invalid.token.here';
    
    verifyToken(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: 'Invalid token'
    });
    expect(nextCalled).toBe(false);
  });

  it('should call next() if token is valid', () => {
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