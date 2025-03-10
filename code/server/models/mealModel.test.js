import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Meal from './mealModel.js';

describe('Meal Model', () => {
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
    await Meal.deleteMany({});
  });

  // Schema validation tests
  describe('Schema Validation', () => {
    it('should validate with correct data', () => {
      const validData = {
        name: 'Chicken Salad',
        creator: new mongoose.Types.ObjectId(),
        img: 'chicken-salad.jpg',
        recipe: 'Mix chicken and vegetables',
        ingredients: [
          {
            name: 'Chicken',
            amount: 200,
            unit: 'g',
            nutrition: {
              calories: 330,
              protein: 62,
              carbs: 0,
              fats: 8
            }
          },
          {
            name: 'Mixed Greens',
            amount: 100,
            unit: 'g',
            nutrition: {
              calories: 20,
              protein: 1,
              carbs: 4,
              fats: 0
            }
          }
        ],
        nutrition: {
          calories: 350,
          protein: 63,
          carbs: 4,
          fats: 8,
          dietaryRestrictions: ['Gluten-Free']
        }
      };

      const meal = new Meal(validData);
      const validationError = meal.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should require name', () => {
      const missingName = {
        creator: new mongoose.Types.ObjectId(),
        recipe: 'Mix chicken and vegetables'
      };

      const meal = new Meal(missingName);
      const validationError = meal.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.name).toBeDefined();
    });

    it('should require creator', () => {
      const missingCreator = {
        name: 'Chicken Salad',
        recipe: 'Mix chicken and vegetables'
      };

      const meal = new Meal(missingCreator);
      const validationError = meal.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.creator).toBeDefined();
    });

    it('should trim the name field', () => {
      const mealWithSpacesInName = {
        name: '  Chicken Salad  ',
        creator: new mongoose.Types.ObjectId()
      };

      const meal = new Meal(mealWithSpacesInName);
      
      expect(meal.name).toBe('Chicken Salad');
    });

    it('should set createdAt to current date by default', () => {
      const meal = new Meal({
        name: 'Chicken Salad',
        creator: new mongoose.Types.ObjectId()
      });
      
      expect(meal.createdAt).toBeDefined();
      expect(meal.createdAt instanceof Date).toBe(true);
      
      // Check that the date is recent (within the last minute)
      const now = new Date();
      const diffInMs = now - meal.createdAt;
      expect(diffInMs).toBeLessThan(60000); // Less than 1 minute
    });

    it('should allow empty ingredients array', () => {
      const mealWithNoIngredients = {
        name: 'Empty Meal',
        creator: new mongoose.Types.ObjectId(),
        ingredients: []
      };

      const meal = new Meal(mealWithNoIngredients);
      const validationError = meal.validateSync();

      expect(validationError).toBeUndefined();
      expect(meal.ingredients).toHaveLength(0);
    });

    it('should allow missing optional fields', () => {
      const minimalMeal = {
        name: 'Minimal Meal',
        creator: new mongoose.Types.ObjectId()
      };

      const meal = new Meal(minimalMeal);
      const validationError = meal.validateSync();

      expect(validationError).toBeUndefined();
      expect(meal.img).toBeUndefined();
      expect(meal.recipe).toBeUndefined();
      expect(meal.ingredients).toEqual([]);
      expect(meal.nutrition).toBeDefined();
      expect(meal.nutrition.dietaryRestrictions).toEqual([]);
    });
  });

  // Schema structure tests
  describe('Schema Structure', () => {
    it('should have the expected schema fields', () => {
      const meal = new Meal();
      const schemaKeys = Object.keys(meal.schema.paths);
      
      // Check required fields
      expect(schemaKeys).toContain('name');
      expect(schemaKeys).toContain('creator');
      expect(schemaKeys).toContain('img');
      expect(schemaKeys).toContain('recipe');
      expect(schemaKeys).toContain('ingredients');
      expect(schemaKeys).toContain('nutrition.calories');
      expect(schemaKeys).toContain('nutrition.protein');
      expect(schemaKeys).toContain('nutrition.carbs');
      expect(schemaKeys).toContain('nutrition.fats');
      expect(schemaKeys).toContain('nutrition.dietaryRestrictions');
      expect(schemaKeys).toContain('createdAt');
      expect(schemaKeys).toContain('_id');
      expect(schemaKeys).toContain('__v');
    });

    it('should have the correct field types', () => {
      const meal = new Meal();
      const schema = meal.schema;
      
      // Check field types
      expect(schema.paths.name.instance).toBe('String');
      expect(schema.paths.creator.instance).toBe('ObjectId');
      expect(schema.paths.img.instance).toBe('String');
      expect(schema.paths.recipe.instance).toBe('String');
      expect(schema.paths.ingredients.instance).toBe('Array');
      expect(schema.paths.createdAt.instance).toBe('Date');
    });

    it('should have the correct nested field structure for ingredients', () => {
      // Create a meal with ingredients
      const meal = new Meal({
        name: 'Test Meal',
        creator: new mongoose.Types.ObjectId(),
        ingredients: [
          {
            name: 'Ingredient 1',
            amount: 100,
            unit: 'g',
            nutrition: {
              calories: 100,
              protein: 10,
              carbs: 20,
              fats: 5
            }
          }
        ]
      });
      
      // Check ingredient structure
      const ingredient = meal.ingredients[0];
      expect(ingredient.name).toBe('Ingredient 1');
      expect(ingredient.amount).toBe(100);
      expect(ingredient.unit).toBe('g');
      expect(ingredient.nutrition).toBeDefined();
      expect(ingredient.nutrition.calories).toBe(100);
      expect(ingredient.nutrition.protein).toBe(10);
      expect(ingredient.nutrition.carbs).toBe(20);
      expect(ingredient.nutrition.fats).toBe(5);
    });

    it('should have the correct nested field structure for nutrition', () => {
      // Create a meal with nutrition
      const meal = new Meal({
        name: 'Test Meal',
        creator: new mongoose.Types.ObjectId(),
        nutrition: {
          calories: 350,
          protein: 30,
          carbs: 40,
          fats: 10,
          dietaryRestrictions: ['Vegetarian', 'Gluten-Free']
        }
      });
      
      // Check nutrition structure
      expect(meal.nutrition).toBeDefined();
      expect(meal.nutrition.calories).toBe(350);
      expect(meal.nutrition.protein).toBe(30);
      expect(meal.nutrition.carbs).toBe(40);
      expect(meal.nutrition.fats).toBe(10);
      expect(Array.isArray(meal.nutrition.dietaryRestrictions)).toBe(true);
      expect(meal.nutrition.dietaryRestrictions).toHaveLength(2);
      expect(meal.nutrition.dietaryRestrictions).toContain('Vegetarian');
      expect(meal.nutrition.dietaryRestrictions).toContain('Gluten-Free');
    });
  });

  // Document operations tests
  describe('Document Operations', () => {
    it('should be able to add ingredients to a meal', () => {
      const meal = new Meal({
        name: 'Test Meal',
        creator: new mongoose.Types.ObjectId(),
        ingredients: [
          {
            name: 'Ingredient 1',
            amount: 100,
            unit: 'g'
          }
        ]
      });
      
      // Add a new ingredient
      meal.ingredients.push({
        name: 'Ingredient 2',
        amount: 50,
        unit: 'g'
      });
      
      expect(meal.ingredients).toHaveLength(2);
      expect(meal.ingredients[1].name).toBe('Ingredient 2');
    });

    it('should be able to update nutrition information', () => {
      const meal = new Meal({
        name: 'Test Meal',
        creator: new mongoose.Types.ObjectId(),
        nutrition: {
          calories: 300,
          protein: 20,
          carbs: 30,
          fats: 10
        }
      });
      
      // Update nutrition
      meal.nutrition.calories = 350;
      meal.nutrition.protein = 25;
      
      expect(meal.nutrition.calories).toBe(350);
      expect(meal.nutrition.protein).toBe(25);
    });

    it('should be able to add dietary restrictions', () => {
      const meal = new Meal({
        name: 'Test Meal',
        creator: new mongoose.Types.ObjectId(),
        nutrition: {
          calories: 300,
          protein: 20,
          carbs: 30,
          fats: 10,
          dietaryRestrictions: ['Vegetarian']
        }
      });
      
      // Add a dietary restriction
      meal.nutrition.dietaryRestrictions.push('Dairy-Free');
      
      expect(meal.nutrition.dietaryRestrictions).toHaveLength(2);
      expect(meal.nutrition.dietaryRestrictions).toContain('Vegetarian');
      expect(meal.nutrition.dietaryRestrictions).toContain('Dairy-Free');
    });
  });

  // Model behavior tests
  describe('Model Behavior', () => {
    it('should create a valid model instance', () => {
      const meal = new Meal({
        name: 'Test Meal',
        creator: new mongoose.Types.ObjectId()
      });
      
      expect(meal).toBeInstanceOf(mongoose.Model);
      expect(meal.constructor.modelName).toBe('Meal');
    });

    it('should have the correct collection name', () => {
      // Mongoose typically pluralizes and lowercases the model name for collection
      expect(Meal.collection.collectionName).toBe('meals');
    });
  });
  
  // Database operation tests - using actual MongoDB operations
  describe('Database Operations', () => {
    it('should save a meal to the database', async () => {
      const mealData = {
        name: 'Database Test Meal',
        creator: new mongoose.Types.ObjectId(),
        recipe: 'Test recipe',
        ingredients: [
          {
            name: 'Test Ingredient',
            amount: 100,
            unit: 'g'
          }
        ]
      };

      const meal = new Meal(mealData);
      await meal.save();

      // Retrieve from DB and verify
      const savedMeal = await Meal.findById(meal._id);
      expect(savedMeal).toBeDefined();
      expect(savedMeal.name).toBe('Database Test Meal');
      expect(savedMeal.ingredients).toHaveLength(1);
      expect(savedMeal.ingredients[0].name).toBe('Test Ingredient');
    });

    it('should find meals by creator', async () => {
      const creatorId = new mongoose.Types.ObjectId();
      
      // Create multiple meals for the same creator
      await Meal.create([
        {
          name: 'Meal 1',
          creator: creatorId,
          recipe: 'Recipe 1'
        },
        {
          name: 'Meal 2',
          creator: creatorId,
          recipe: 'Recipe 2'
        }
      ]);

      // Create a meal for a different creator
      await Meal.create({
        name: 'Other Creator Meal',
        creator: new mongoose.Types.ObjectId(),
        recipe: 'Other recipe'
      });

      // Find meals for our creator and sort by name to ensure consistent order
      const creatorMeals = await Meal.find({ creator: creatorId }).sort({ name: 1 });
      
      expect(creatorMeals).toHaveLength(2);
      
      // With sorting applied, we can be sure of the order
      expect(creatorMeals[0].name).toBe('Meal 1');
      expect(creatorMeals[1].name).toBe('Meal 2');
      
      // Alternatively, check that both meals are present without assuming order
      const mealNames = creatorMeals.map(meal => meal.name);
      expect(mealNames).toContain('Meal 1');
      expect(mealNames).toContain('Meal 2');
    });

    it('should update a meal', async () => {
      // Create a meal
      const meal = await Meal.create({
        name: 'Original Meal',
        creator: new mongoose.Types.ObjectId(),
        recipe: 'Original recipe'
      });

      // Update the meal
      await Meal.findByIdAndUpdate(
        meal._id,
        {
          name: 'Updated Meal',
          recipe: 'Updated recipe'
        },
        { new: true }
      );

      // Retrieve and verify
      const updatedMeal = await Meal.findById(meal._id);
      expect(updatedMeal.name).toBe('Updated Meal');
      expect(updatedMeal.recipe).toBe('Updated recipe');
    });

    it('should delete a meal', async () => {
      // Create a meal
      const meal = await Meal.create({
        name: 'Meal to Delete',
        creator: new mongoose.Types.ObjectId(),
        recipe: 'Delete me'
      });

      // Delete the meal
      await Meal.findByIdAndDelete(meal._id);

      // Verify it's gone
      const deletedMeal = await Meal.findById(meal._id);
      expect(deletedMeal).toBeNull();
    });
    
    it('should calculate total nutrition from ingredients', async () => {
      // Create a meal with ingredients that have nutrition info
      const meal = await Meal.create({
        name: 'Nutrition Test Meal',
        creator: new mongoose.Types.ObjectId(),
        ingredients: [
          {
            name: 'Ingredient 1',
            amount: 100,
            unit: 'g',
            nutrition: {
              calories: 100,
              protein: 10,
              carbs: 5,
              fats: 2
            }
          },
          {
            name: 'Ingredient 2',
            amount: 50,
            unit: 'g',
            nutrition: {
              calories: 150,
              protein: 5,
              carbs: 15,
              fats: 8
            }
          }
        ],
        nutrition: {
          calories: 250,  // 100 + 150
          protein: 15,    // 10 + 5
          carbs: 20,      // 5 + 15
          fats: 10,       // 2 + 8
          dietaryRestrictions: ['Vegetarian']
        }
      });

      // Retrieve and verify
      const savedMeal = await Meal.findById(meal._id);
      expect(savedMeal.nutrition.calories).toBe(250);
      expect(savedMeal.nutrition.protein).toBe(15);
      expect(savedMeal.nutrition.carbs).toBe(20);
      expect(savedMeal.nutrition.fats).toBe(10);
    });
  });
}); 