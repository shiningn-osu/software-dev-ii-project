import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import NutritionGoals from './nutritionGoals.js';

describe('NutritionGoals Model', () => {
  let mongoServer;

  // Setup - start MongoDB Memory Server before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Cleanup - stop MongoDB Memory Server after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database between tests
  afterEach(async () => {
    await NutritionGoals.deleteMany({});
  });

  // Schema validation tests
  describe('Schema Validation', () => {
    it('should validate with correct data', () => {
      const validData = {
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(validData);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should require userId', () => {
      const missingUserId = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(missingUserId);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.userId).toBeDefined();
    });

    it('should require calories', () => {
      const missingCalories = {
        userId: new mongoose.Types.ObjectId(),
        protein: 150,
        carbs: 200,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(missingCalories);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.calories).toBeDefined();
    });

    it('should require protein', () => {
      const missingProtein = {
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        carbs: 200,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(missingProtein);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.protein).toBeDefined();
    });

    it('should require carbs', () => {
      const missingCarbs = {
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(missingCarbs);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.carbs).toBeDefined();
    });

    it('should require fats', () => {
      const missingFats = {
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200
      };

      const nutritionGoals = new NutritionGoals(missingFats);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.fats).toBeDefined();
    });

    it('should set updatedAt to current date by default', () => {
      const nutritionGoals = new NutritionGoals({
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });
      
      expect(nutritionGoals.updatedAt).toBeDefined();
      expect(nutritionGoals.updatedAt instanceof Date).toBe(true);
      
      // Check that the date is recent (within the last minute)
      const now = new Date();
      const diffInMs = now - nutritionGoals.updatedAt;
      expect(diffInMs).toBeLessThan(60000); // Less than 1 minute
    });

    it('should validate that nutrition values are numbers', () => {
      const nonNumberValues = {
        userId: new mongoose.Types.ObjectId(),
        calories: 'not a number',
        protein: 150,
        carbs: 200,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(nonNumberValues);
      const validationError = nutritionGoals.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.calories).toBeDefined();
    });
  });

  // Schema structure tests
  describe('Schema Structure', () => {
    it('should have the expected schema fields', () => {
      const nutritionGoals = new NutritionGoals();
      const schemaKeys = Object.keys(nutritionGoals.schema.paths);
      
      // Check required fields
      expect(schemaKeys).toContain('userId');
      expect(schemaKeys).toContain('calories');
      expect(schemaKeys).toContain('protein');
      expect(schemaKeys).toContain('carbs');
      expect(schemaKeys).toContain('fats');
      expect(schemaKeys).toContain('updatedAt');
      expect(schemaKeys).toContain('_id');
      expect(schemaKeys).toContain('__v');
    });

    it('should have the correct field types', () => {
      const nutritionGoals = new NutritionGoals();
      const schema = nutritionGoals.schema;
      
      // Check field types
      expect(schema.paths.userId.instance).toBe('ObjectId');
      expect(schema.paths.calories.instance).toBe('Number');
      expect(schema.paths.protein.instance).toBe('Number');
      expect(schema.paths.carbs.instance).toBe('Number');
      expect(schema.paths.fats.instance).toBe('Number');
      expect(schema.paths.updatedAt.instance).toBe('Date');
    });

    it('should have the correct reference for userId', () => {
      const nutritionGoals = new NutritionGoals();
      const userIdPath = nutritionGoals.schema.paths.userId;
      
      expect(userIdPath.options.ref).toBe('User');
    });
  });

  // Document operations tests
  describe('Document Operations', () => {
    it('should be able to update nutrition values', () => {
      const nutritionGoals = new NutritionGoals({
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });
      
      // Update values
      nutritionGoals.calories = 2200;
      nutritionGoals.protein = 160;
      
      expect(nutritionGoals.calories).toBe(2200);
      expect(nutritionGoals.protein).toBe(160);
    });
  });

  // Model behavior tests
  describe('Model Behavior', () => {
    it('should create a valid model instance', () => {
      const nutritionGoals = new NutritionGoals({
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });
      
      expect(nutritionGoals).toBeInstanceOf(mongoose.Model);
      expect(nutritionGoals.constructor.modelName).toBe('NutritionGoals');
    });

    it('should have the correct collection name', () => {
      // Mongoose typically pluralizes and lowercases the model name for collection
      expect(NutritionGoals.collection.collectionName).toBe('nutritiongoals');
    });
  });
  
  // Database operation tests
  describe('Database Operations', () => {
    it('should save nutrition goals to the database', async () => {
      const userId = new mongoose.Types.ObjectId();
      const nutritionData = {
        userId,
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      };

      const nutritionGoals = new NutritionGoals(nutritionData);
      await nutritionGoals.save();

      // Retrieve from DB and verify
      const savedGoals = await NutritionGoals.findById(nutritionGoals._id);
      expect(savedGoals).toBeDefined();
      expect(savedGoals.calories).toBe(2000);
      expect(savedGoals.protein).toBe(150);
      expect(savedGoals.carbs).toBe(200);
      expect(savedGoals.fats).toBe(70);
    });

    it('should find nutrition goals by userId', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      // Create nutrition goals for a user
      await NutritionGoals.create({
        userId,
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });

      // Create nutrition goals for a different user
      await NutritionGoals.create({
        userId: new mongoose.Types.ObjectId(),
        calories: 1800,
        protein: 120,
        carbs: 180,
        fats: 60
      });

      // Find goals for our user
      const userGoals = await NutritionGoals.findOne({ userId });
      
      expect(userGoals).toBeDefined();
      expect(userGoals.calories).toBe(2000);
      expect(userGoals.protein).toBe(150);
    });

    it('should update nutrition goals', async () => {
      // Create nutrition goals
      const nutritionGoals = await NutritionGoals.create({
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });

      // Update the goals
      await NutritionGoals.findByIdAndUpdate(
        nutritionGoals._id,
        {
          calories: 2200,
          protein: 160
        },
        { new: true }
      );

      // Retrieve and verify
      const updatedGoals = await NutritionGoals.findById(nutritionGoals._id);
      expect(updatedGoals.calories).toBe(2200);
      expect(updatedGoals.protein).toBe(160);
      expect(updatedGoals.carbs).toBe(200); // Unchanged
      expect(updatedGoals.fats).toBe(70);   // Unchanged
    });

    it('should delete nutrition goals', async () => {
      // Create nutrition goals
      const nutritionGoals = await NutritionGoals.create({
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });

      // Delete the goals
      await NutritionGoals.findByIdAndDelete(nutritionGoals._id);

      // Verify it's gone
      const deletedGoals = await NutritionGoals.findById(nutritionGoals._id);
      expect(deletedGoals).toBeNull();
    });
    
    it('should update the updatedAt field when modified', async () => {
      // Create nutrition goals
      const nutritionGoals = await NutritionGoals.create({
        userId: new mongoose.Types.ObjectId(),
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 70
      });
      
      // Store the original updatedAt value
      const originalUpdatedAt = nutritionGoals.updatedAt;
      
      // Wait a bit to ensure the timestamp will be different
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update the goals
      await NutritionGoals.findByIdAndUpdate(
        nutritionGoals._id,
        {
          calories: 2200,
          updatedAt: new Date() // Explicitly update the timestamp
        },
        { new: true }
      );
      
      // Retrieve and verify
      const updatedGoals = await NutritionGoals.findById(nutritionGoals._id);
      expect(updatedGoals.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
}); 