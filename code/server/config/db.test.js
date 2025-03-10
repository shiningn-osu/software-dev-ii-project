import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import connectDB from './db.js';

describe('Database Connection', () => {
  let mongoServer;
  const originalEnv = { ...process.env };
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalExit = process.exit;
  const mockConsoleLog = jest.fn();
  const mockConsoleError = jest.fn();

  // Setup MongoDB Memory Server before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    
    // Set the MongoDB URI to the in-memory database
    process.env.MONGODB_URI = mongoServer.getUri();
    
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    // Mock process.exit for all tests
    process.exit = jest.fn();
  });

  // Close connection and MongoDB Memory Server after all tests
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    // Restore all original functions
    process.env = originalEnv;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exit = originalExit;
  }, 15000);

  // Reset environment and close connection after each test
  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = mongoServer.getUri(); // Ensure this is set for each test
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    jest.clearAllMocks();
  }, 15000);

  it('should connect to the database successfully in non-test environment', async () => {
    process.env.NODE_ENV = 'development';
    // Make sure MONGODB_URI is set before this test
    expect(process.env.MONGODB_URI).toBeDefined();
    
    const conn = await connectDB();
    
    expect(mongoose.connection.readyState).toBe(1);
    expect(conn).toBeDefined();
    expect(conn.connection).toBeDefined();
    expect(conn.connection.host).toBeDefined();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('MongoDB Connected:')
    );
  }, 15000);

  it('should return existing connection if already connected', async () => {
    process.env.NODE_ENV = 'development';
    // Make sure MONGODB_URI is set before this test
    expect(process.env.MONGODB_URI).toBeDefined();
    
    // First connection
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
    
    // Second connection attempt
    const conn2 = await connectDB();
    expect(conn2).toBe(mongoose.connection);
    
    // Should only log connection message once
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  }, 15000);

  it('should return early in test environment', async () => {
    process.env.NODE_ENV = 'test';
    const result = await connectDB();
    
    expect(result).toBeUndefined();
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', async () => {
    process.env.NODE_ENV = 'development';
    
    // Mock mongoose.connect to throw an error
    const originalConnect = mongoose.connect;
    mongoose.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));
    
    try {
      await connectDB();
    } catch (error) {
      // Expected error
    }
    
    expect(mockConsoleError).toHaveBeenCalledWith('Error: Connection failed');
    expect(process.exit).toHaveBeenCalledWith(1);
    
    // Restore original connect function
    mongoose.connect = originalConnect;
  }, 15000);

  it('should not exit process on error in test environment', async () => {
    process.env.NODE_ENV = 'test';
    
    // Mock mongoose.connect to throw an error
    const originalConnect = mongoose.connect;
    mongoose.connect = jest.fn().mockImplementation(() => {
      console.error('Error: Connection failed');
      throw new Error('Connection failed');
    });
    
    try {
      await connectDB();
    } catch (error) {
      // Expected error
    }
    
    expect(process.exit).not.toHaveBeenCalled();
    
    // Restore original connect function
    mongoose.connect = originalConnect;
  }, 15000);

  it('should use correct connection options', async () => {
    process.env.NODE_ENV = 'development';
    // Make sure MONGODB_URI is set before this test
    expect(process.env.MONGODB_URI).toBeDefined();
    
    // Clear any existing connections
    await mongoose.connection.close();
    
    const originalConnect = mongoose.connect;
    
    // Create a mock connection object
    const mockConnection = {
      connection: {
        host: 'mock-host'
      }
    };
    
    // Mock mongoose.connect to return our mock connection
    mongoose.connect = jest.fn().mockResolvedValue(mockConnection);
    
    await connectDB();
    
    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
    
    // Restore original connect function
    mongoose.connect = originalConnect;
  }, 15000);
});