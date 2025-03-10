import mongoose from 'mongoose';
import GroceryList from './groceryList.js';

describe('GroceryList Model', () => {
  // Setup and teardown
  beforeAll(async () => {
    // Use an in-memory database for testing if possible
    // If not available in your environment, you can skip DB-dependent tests
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Skipping DB tests - not in test environment');
      return;
    }
  });

  afterAll(async () => {
    // Clean up any connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  // Schema validation tests
  describe('Schema Validation', () => {
    it('should validate with correct data', () => {
      const validData = {
        userId: new mongoose.Types.ObjectId(),
        items: ['Apples', 'Milk', 'Bread']
      };

      const groceryList = new GroceryList(validData);
      const validationError = groceryList.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should require userId', () => {
      const missingUserId = {
        items: ['Apples', 'Milk', 'Bread']
      };

      const groceryList = new GroceryList(missingUserId);
      const validationError = groceryList.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.userId).toBeDefined();
    });

    it('should allow empty items array', () => {
      const emptyItems = {
        userId: new mongoose.Types.ObjectId(),
        items: []
      };

      const groceryList = new GroceryList(emptyItems);
      const validationError = groceryList.validateSync();

      expect(validationError).toBeUndefined();
      expect(groceryList.items).toHaveLength(0);
    });

    it('should default to empty items array if not provided', () => {
      const noItems = {
        userId: new mongoose.Types.ObjectId()
      };

      const groceryList = new GroceryList(noItems);
      
      expect(groceryList.items).toBeDefined();
      expect(Array.isArray(groceryList.items)).toBe(true);
      expect(groceryList.items).toHaveLength(0);
    });
  });

  // Schema structure tests
  describe('Schema Structure', () => {
    it('should have the expected schema fields', () => {
      const groceryList = new GroceryList();
      const schemaKeys = Object.keys(groceryList.schema.paths);
      
      // Check required fields
      expect(schemaKeys).toContain('userId');
      expect(schemaKeys).toContain('items');
      expect(schemaKeys).toContain('_id');
      expect(schemaKeys).toContain('__v');
    });

    it('should have the correct field types', () => {
      const groceryList = new GroceryList();
      const schema = groceryList.schema;
      
      // Check field types
      expect(schema.paths.userId.instance).toBe('ObjectId');
      expect(schema.paths.items.instance).toBe('Array');
    });

    it('should have items as an array of strings', () => {
      // Create a grocery list with items
      const groceryList = new GroceryList({
        userId: new mongoose.Types.ObjectId(),
        items: ['Apples', 'Milk', 'Bread']
      });
      
      // Check that items are strings
      groceryList.items.forEach(item => {
        expect(typeof item).toBe('string');
      });
    });
  });

  // Document methods tests
  describe('Document Operations', () => {
    it('should be able to add items to the list', () => {
      const groceryList = new GroceryList({
        userId: new mongoose.Types.ObjectId(),
        items: ['Apples']
      });
      
      // Add items
      groceryList.items.push('Milk');
      groceryList.items.push('Bread');
      
      expect(groceryList.items).toHaveLength(3);
      expect(groceryList.items).toContain('Apples');
      expect(groceryList.items).toContain('Milk');
      expect(groceryList.items).toContain('Bread');
    });

    it('should be able to remove items from the list', () => {
      const groceryList = new GroceryList({
        userId: new mongoose.Types.ObjectId(),
        items: ['Apples', 'Milk', 'Bread']
      });
      
      // Remove an item
      groceryList.items = groceryList.items.filter(item => item !== 'Milk');
      
      expect(groceryList.items).toHaveLength(2);
      expect(groceryList.items).toContain('Apples');
      expect(groceryList.items).toContain('Bread');
      expect(groceryList.items).not.toContain('Milk');
    });

    it('should be able to clear all items', () => {
      const groceryList = new GroceryList({
        userId: new mongoose.Types.ObjectId(),
        items: ['Apples', 'Milk', 'Bread']
      });
      
      // Clear items
      groceryList.items = [];
      
      expect(groceryList.items).toHaveLength(0);
    });
  });

  // Model behavior tests
  describe('Model Behavior', () => {
    it('should create a valid model instance', () => {
      const groceryList = new GroceryList({
        userId: new mongoose.Types.ObjectId(),
        items: ['Apples', 'Milk', 'Bread']
      });
      
      expect(groceryList).toBeInstanceOf(mongoose.Model);
      expect(groceryList.constructor.modelName).toBe('GroceryList');
    });

    it('should have the correct collection name', () => {
      // Mongoose typically pluralizes and lowercases the model name for collection
      expect(GroceryList.collection.collectionName).toBe('grocerylists');
    });
  });
}); 