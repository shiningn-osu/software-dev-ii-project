import mongoose from 'mongoose';
import DailyNutrition from './dailyNutrition.js';

describe('DailyNutrition Model', () => {
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
        date: new Date(),
        meals: [
          {
            name: 'Breakfast',
            calories: 500,
            protein: 20,
            carbs: 60,
            fats: 15,
            timeEaten: new Date()
          }
        ],
        totals: {
          calories: 500,
          protein: 20,
          carbs: 60,
          fats: 15
        }
      };

      const dailyNutrition = new DailyNutrition(validData);
      const validationError = dailyNutrition.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should require userId', () => {
      const missingUserId = {
        date: new Date(),
        totals: {
          calories: 500,
          protein: 20,
          carbs: 60,
          fats: 15
        }
      };

      const dailyNutrition = new DailyNutrition(missingUserId);
      const validationError = dailyNutrition.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.userId).toBeDefined();
    });

    it('should require date', () => {
      const missingDate = {
        userId: new mongoose.Types.ObjectId(),
        totals: {
          calories: 500,
          protein: 20,
          carbs: 60,
          fats: 15
        }
      };

      const dailyNutrition = new DailyNutrition(missingDate);
      const validationError = dailyNutrition.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.date).toBeDefined();
    });

    it('should set default values for totals', () => {
      const noTotals = {
        userId: new mongoose.Types.ObjectId(),
        date: new Date()
      };

      const dailyNutrition = new DailyNutrition(noTotals);
      
      expect(dailyNutrition.totals).toBeDefined();
      expect(dailyNutrition.totals.calories).toBe(0);
      expect(dailyNutrition.totals.protein).toBe(0);
      expect(dailyNutrition.totals.carbs).toBe(0);
      expect(dailyNutrition.totals.fats).toBe(0);
    });

    it('should allow empty meals array', () => {
      const emptyMeals = {
        userId: new mongoose.Types.ObjectId(),
        date: new Date(),
        meals: [],
        totals: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }
      };

      const dailyNutrition = new DailyNutrition(emptyMeals);
      const validationError = dailyNutrition.validateSync();

      expect(validationError).toBeUndefined();
      expect(dailyNutrition.meals).toHaveLength(0);
    });
  });

  // Schema structure tests
  describe('Schema Structure', () => {
    it('should have the expected schema fields', () => {
      const dailyNutrition = new DailyNutrition();
      const schemaKeys = Object.keys(dailyNutrition.schema.paths);
      
      // Check required fields
      expect(schemaKeys).toContain('userId');
      expect(schemaKeys).toContain('date');
      expect(schemaKeys).toContain('meals');
      // Check nested fields directly
      expect(schemaKeys).toContain('totals.calories');
      expect(schemaKeys).toContain('totals.protein');
      expect(schemaKeys).toContain('totals.carbs');
      expect(schemaKeys).toContain('totals.fats');
    });

    it('should have the correct field types', () => {
      const dailyNutrition = new DailyNutrition();
      const schema = dailyNutrition.schema;
      
      // Check field types with correct casing
      expect(schema.paths.userId.instance).toBe('ObjectId');
      expect(schema.paths.date.instance).toBe('Date');
      expect(schema.paths.meals.instance).toBe('Array');
      expect(schema.paths['totals.calories'].instance).toBe('Number');
    });
  });

  // Index tests - these require a DB connection
  describe('Indexes', () => {
    it('should have a compound index on userId and date', () => {
      const indexes = DailyNutrition.schema.indexes();
      
      // Find the compound index
      const hasCompoundIndex = indexes.some(indexObj => {
        const indexDef = indexObj[0]; // Index definition is the first element
        return indexDef.userId === 1 && indexDef.date === 1;
      });
      
      expect(hasCompoundIndex).toBe(true);
    });
  });
}); 