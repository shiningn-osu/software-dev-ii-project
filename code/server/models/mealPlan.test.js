import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MealPlan from './mealPlan.js';

describe('MealPlan Model', () => {
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
    await MealPlan.deleteMany({});
  });

  // Schema validation tests
  describe('Schema Validation', () => {
    it('should validate with correct data', () => {
      const validData = {
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: {
          monday: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          tuesday: [new mongoose.Types.ObjectId()]
        },
        settings: {
          allergies: ['Nuts', 'Dairy'],
          diet: 'Vegetarian',
          minCalories: 1800,
          maxCalories: 2200
        }
      };

      const mealPlan = new MealPlan(validData);
      const validationError = mealPlan.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should require userId', () => {
      const missingUserId = {
        name: 'Weekly Meal Plan',
        plan: { monday: [] }
      };

      const mealPlan = new MealPlan(missingUserId);
      const validationError = mealPlan.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.userId).toBeDefined();
    });

    it('should require name', () => {
      const missingName = {
        userId: new mongoose.Types.ObjectId(),
        plan: { monday: [] }
      };

      const mealPlan = new MealPlan(missingName);
      const validationError = mealPlan.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.name).toBeDefined();
    });

    it('should require plan', () => {
      const missingPlan = {
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan'
      };

      const mealPlan = new MealPlan(missingPlan);
      const validationError = mealPlan.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.plan).toBeDefined();
    });

    it('should set dateCreated to current date by default', () => {
      const mealPlan = new MealPlan({
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] }
      });
      
      expect(mealPlan.dateCreated).toBeDefined();
      expect(mealPlan.dateCreated instanceof Date).toBe(true);
      
      // Check that the date is recent (within the last minute)
      const now = new Date();
      const diffInMs = now - mealPlan.dateCreated;
      expect(diffInMs).toBeLessThan(60000); // Less than 1 minute
    });

    it('should allow settings to be optional', () => {
      const mealPlanWithoutSettings = {
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] }
      };

      const mealPlan = new MealPlan(mealPlanWithoutSettings);
      const validationError = mealPlan.validateSync();

      expect(validationError).toBeUndefined();
      expect(mealPlan.settings).toBeDefined(); // Mongoose initializes it
    });

    it('should allow empty settings fields', () => {
      const mealPlanWithEmptySettings = {
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] },
        settings: {}
      };

      const mealPlan = new MealPlan(mealPlanWithEmptySettings);
      const validationError = mealPlan.validateSync();

      expect(validationError).toBeUndefined();
      expect(mealPlan.settings).toBeDefined();
      expect(mealPlan.settings.allergies).toEqual([]);
    });
  });

  // Schema structure tests
  describe('Schema Structure', () => {
    it('should have the expected schema fields', () => {
      const mealPlan = new MealPlan();
      const schemaKeys = Object.keys(mealPlan.schema.paths);
      
      // Check required fields
      expect(schemaKeys).toContain('userId');
      expect(schemaKeys).toContain('name');
      expect(schemaKeys).toContain('dateCreated');
      expect(schemaKeys).toContain('plan');
      expect(schemaKeys).toContain('settings.allergies');
      expect(schemaKeys).toContain('settings.diet');
      expect(schemaKeys).toContain('settings.minCalories');
      expect(schemaKeys).toContain('settings.maxCalories');
      expect(schemaKeys).toContain('_id');
      expect(schemaKeys).toContain('__v');
    });

    it('should have the correct field types', () => {
      const mealPlan = new MealPlan();
      const schema = mealPlan.schema;
      
      // Check field types
      expect(schema.paths.userId.instance).toBe('ObjectId');
      expect(schema.paths.name.instance).toBe('String');
      expect(schema.paths.dateCreated.instance).toBe('Date');
      expect(schema.paths.plan.instance).toBe('Mixed');
      expect(schema.paths['settings.allergies'].instance).toBe('Array');
      expect(schema.paths['settings.diet'].instance).toBe('String');
      expect(schema.paths['settings.minCalories'].instance).toBe('Number');
      expect(schema.paths['settings.maxCalories'].instance).toBe('Number');
    });

    it('should have the correct reference for userId', () => {
      const mealPlan = new MealPlan();
      const userIdPath = mealPlan.schema.paths.userId;
      
      expect(userIdPath.options.ref).toBe('User');
    });
  });

  // Document operations tests
  describe('Document Operations', () => {
    it('should be able to update the plan', () => {
      const mealPlan = new MealPlan({
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] }
      });
      
      // Update plan
      mealPlan.plan = {
        monday: [new mongoose.Types.ObjectId()],
        tuesday: [new mongoose.Types.ObjectId()]
      };
      
      expect(mealPlan.plan.monday).toBeDefined();
      expect(mealPlan.plan.tuesday).toBeDefined();
      expect(Array.isArray(mealPlan.plan.monday)).toBe(true);
      expect(mealPlan.plan.monday.length).toBe(1);
    });

    it('should be able to add allergies', () => {
      const mealPlan = new MealPlan({
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] },
        settings: {
          allergies: ['Nuts']
        }
      });
      
      // Add an allergy
      mealPlan.settings.allergies.push('Dairy');
      
      expect(mealPlan.settings.allergies).toHaveLength(2);
      expect(mealPlan.settings.allergies).toContain('Nuts');
      expect(mealPlan.settings.allergies).toContain('Dairy');
    });

    it('should be able to update dietary settings', () => {
      const mealPlan = new MealPlan({
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] },
        settings: {
          diet: 'Regular',
          minCalories: 1800,
          maxCalories: 2200
        }
      });
      
      // Update settings
      mealPlan.settings.diet = 'Vegetarian';
      mealPlan.settings.minCalories = 1600;
      mealPlan.settings.maxCalories = 2000;
      
      expect(mealPlan.settings.diet).toBe('Vegetarian');
      expect(mealPlan.settings.minCalories).toBe(1600);
      expect(mealPlan.settings.maxCalories).toBe(2000);
    });
  });

  // Model behavior tests
  describe('Model Behavior', () => {
    it('should create a valid model instance', () => {
      const mealPlan = new MealPlan({
        userId: new mongoose.Types.ObjectId(),
        name: 'Weekly Meal Plan',
        plan: { monday: [] }
      });
      
      expect(mealPlan).toBeInstanceOf(mongoose.Model);
      expect(mealPlan.constructor.modelName).toBe('MealPlan');
    });

    it('should have the correct collection name', () => {
      // Mongoose typically pluralizes and lowercases the model name for collection
      expect(MealPlan.collection.collectionName).toBe('mealplans');
    });

    it('should handle complex plan structures', () => {
      const complexPlan = {
        monday: {
          breakfast: [new mongoose.Types.ObjectId()],
          lunch: [new mongoose.Types.ObjectId()],
          dinner: [new mongoose.Types.ObjectId()]
        },
        tuesday: {
          breakfast: [new mongoose.Types.ObjectId()],
          lunch: [new mongoose.Types.ObjectId()],
          dinner: [new mongoose.Types.ObjectId()]
        }
      };
      
      const mealPlan = new MealPlan({
        userId: new mongoose.Types.ObjectId(),
        name: 'Detailed Weekly Plan',
        plan: complexPlan
      });
      
      const validationError = mealPlan.validateSync();
      expect(validationError).toBeUndefined();
      
      // Check the structure was preserved
      expect(mealPlan.plan.monday.breakfast).toBeDefined();
      expect(Array.isArray(mealPlan.plan.monday.breakfast)).toBe(true);
      expect(mealPlan.plan.tuesday.dinner).toBeDefined();
      expect(mealPlan.plan.tuesday.dinner.length).toBe(1);
    });
  });

  // Database operation tests - using actual MongoDB operations
  describe('Database Operations', () => {
    it('should save a meal plan to the database', async () => {
      const mealPlanData = {
        userId: new mongoose.Types.ObjectId(),
        name: 'Test Plan',
        plan: { monday: [new mongoose.Types.ObjectId()] }
      };

      const mealPlan = new MealPlan(mealPlanData);
      await mealPlan.save();

      // Retrieve from DB and verify
      const savedMealPlan = await MealPlan.findById(mealPlan._id);
      expect(savedMealPlan).toBeDefined();
      expect(savedMealPlan.name).toBe('Test Plan');
      expect(savedMealPlan.plan.monday).toBeDefined();
    });

    it('should find meal plans by userId', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      // Create multiple meal plans for the same user
      await MealPlan.create([
        {
          userId,
          name: 'Plan 1',
          plan: { monday: [] }
        },
        {
          userId,
          name: 'Plan 2',
          plan: { tuesday: [] }
        }
      ]);

      // Create a plan for a different user
      await MealPlan.create({
        userId: new mongoose.Types.ObjectId(),
        name: 'Other User Plan',
        plan: { wednesday: [] }
      });

      // Find plans for our user and sort by name to ensure consistent order
      const userPlans = await MealPlan.find({ userId }).sort({ name: 1 });
      
      expect(userPlans).toHaveLength(2);
      
      // Instead of assuming order, check that both plans are present
      const planNames = userPlans.map(plan => plan.name);
      expect(planNames).toContain('Plan 1');
      expect(planNames).toContain('Plan 2');
      
      // Or with sorting applied, we can be sure of the order
      expect(userPlans[0].name).toBe('Plan 1');
      expect(userPlans[1].name).toBe('Plan 2');
    });

    it('should update a meal plan', async () => {
      // Create a plan
      const mealPlan = await MealPlan.create({
        userId: new mongoose.Types.ObjectId(),
        name: 'Original Plan',
        plan: { monday: [] }
      });

      // Update the plan
      await MealPlan.findByIdAndUpdate(
        mealPlan._id,
        {
          name: 'Updated Plan',
          'plan.tuesday': [new mongoose.Types.ObjectId()]
        },
        { new: true }
      );

      // Retrieve and verify
      const updatedPlan = await MealPlan.findById(mealPlan._id);
      expect(updatedPlan.name).toBe('Updated Plan');
      expect(updatedPlan.plan.tuesday).toBeDefined();
    });

    it('should delete a meal plan', async () => {
      // Create a plan
      const mealPlan = await MealPlan.create({
        userId: new mongoose.Types.ObjectId(),
        name: 'Plan to Delete',
        plan: { monday: [] }
      });

      // Delete the plan
      await MealPlan.findByIdAndDelete(mealPlan._id);

      // Verify it's gone
      const deletedPlan = await MealPlan.findById(mealPlan._id);
      expect(deletedPlan).toBeNull();
    });
  });
}); 