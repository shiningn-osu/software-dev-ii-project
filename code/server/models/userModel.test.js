import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './userModel.js';

describe('User Model', () => {
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
    await User.deleteMany({});
  });

  // Schema validation tests
  describe('Schema Validation', () => {
    it('should validate with correct minimal data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User(validData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should validate with complete data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123',
        preferences: {
          dietaryRestrictions: ['vegan', 'gluten-free'],
          caloricGoal: 2000,
          macroSplit: {
            protein: 150,
            carbs: 200,
            fats: 70
          }
        },
        savedMeals: [{
          mealId: new mongoose.Types.ObjectId(),
          name: 'Test Meal',
          img: 'test.jpg',
          recipe: 'Test recipe',
          ingredients: ['ingredient1', 'ingredient2'],
          nutrition: {
            calories: 500,
            protein: 30,
            carbs: 40,
            fats: 20,
            dietaryRestrictions: ['vegan']
          }
        }],
        mealPlans: [{
          name: 'Weekly Plan',
          meals: [{
            mealId: new mongoose.Types.ObjectId(),
            date: new Date(),
            portionSize: 1
          }]
        }],
        groceryList: [{
          ingredient: 'Apples',
          quantity: '5',
          store: 'Grocery Store',
          price: 3.99
        }],
        nutritionLog: [{
          date: new Date(),
          meals: [{
            mealId: new mongoose.Types.ObjectId(),
            name: 'Breakfast',
            calories: 400,
            protein: 20,
            carbs: 30,
            fats: 15
          }]
        }]
      };

      const user = new User(validData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should require username', () => {
      const missingUsername = {
        password: 'password123'
      };

      const user = new User(missingUsername);
      const validationError = user.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.username).toBeDefined();
    });

    it('should require password', () => {
      const missingPassword = {
        username: 'testuser'
      };

      const user = new User(missingPassword);
      const validationError = user.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
    });

    it('should trim the username field', () => {
      const userWithSpacesInUsername = {
        username: '  testuser  ',
        password: 'password123'
      };

      const user = new User(userWithSpacesInUsername);
      
      expect(user.username).toBe('testuser');
    });

    it('should set createdAt and updated to current date by default', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });
      
      expect(user.createdAt).toBeDefined();
      expect(user.createdAt instanceof Date).toBe(true);
      expect(user.updated).toBeDefined();
      expect(user.updated instanceof Date).toBe(true);
      
      // Check that the dates are recent (within the last minute)
      const now = new Date();
      const createdDiffInMs = now - user.createdAt;
      const updatedDiffInMs = now - user.updated;
      expect(createdDiffInMs).toBeLessThan(60000); // Less than 1 minute
      expect(updatedDiffInMs).toBeLessThan(60000); // Less than 1 minute
    });
  });

  // Schema structure tests
  describe('Schema Structure', () => {
    it('should have the expected schema fields', () => {
      const user = new User();
      const schemaKeys = Object.keys(user.schema.paths);
      
      // Check required fields
      expect(schemaKeys).toContain('username');
      expect(schemaKeys).toContain('password');
      expect(schemaKeys).toContain('createdAt');
      expect(schemaKeys).toContain('updated');
      expect(schemaKeys).toContain('preferences.dietaryRestrictions');
      expect(schemaKeys).toContain('preferences.caloricGoal');
      expect(schemaKeys).toContain('preferences.macroSplit.protein');
      expect(schemaKeys).toContain('preferences.macroSplit.carbs');
      expect(schemaKeys).toContain('preferences.macroSplit.fats');
      expect(schemaKeys).toContain('savedMeals');
      expect(schemaKeys).toContain('mealPlans');
      expect(schemaKeys).toContain('groceryList');
      expect(schemaKeys).toContain('nutritionLog');
      expect(schemaKeys).toContain('_id');
      expect(schemaKeys).toContain('__v');
    });

    it('should have the correct field types', () => {
      const user = new User();
      const schema = user.schema;
      
      // Check field types
      expect(schema.paths.username.instance).toBe('String');
      expect(schema.paths.password.instance).toBe('String');
      expect(schema.paths.createdAt.instance).toBe('Date');
      expect(schema.paths.updated.instance).toBe('Date');
      expect(schema.paths['preferences.dietaryRestrictions'].instance).toBe('Array');
      expect(schema.paths['preferences.caloricGoal'].instance).toBe('Number');
      expect(schema.paths['preferences.macroSplit.protein'].instance).toBe('Number');
      expect(schema.paths.savedMeals.instance).toBe('Array');
      expect(schema.paths.mealPlans.instance).toBe('Array');
      expect(schema.paths.groceryList.instance).toBe('Array');
      expect(schema.paths.nutritionLog.instance).toBe('Array');
    });
  });

  // Document operations tests
  describe('Document Operations', () => {
    it('should be able to add dietary restrictions', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123',
        preferences: {
          dietaryRestrictions: ['vegan']
        }
      });
      
      // Add a dietary restriction
      user.preferences.dietaryRestrictions.push('gluten-free');
      
      expect(user.preferences.dietaryRestrictions).toHaveLength(2);
      expect(user.preferences.dietaryRestrictions).toContain('vegan');
      expect(user.preferences.dietaryRestrictions).toContain('gluten-free');
    });

    it('should be able to add a saved meal', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });
      
      // Add a saved meal
      user.savedMeals.push({
        mealId: new mongoose.Types.ObjectId(),
        name: 'New Meal',
        img: 'meal.jpg',
        recipe: 'Recipe instructions',
        ingredients: ['ingredient1', 'ingredient2'],
        nutrition: {
          calories: 500,
          protein: 30,
          carbs: 40,
          fats: 20,
          dietaryRestrictions: ['vegan']
        }
      });
      
      expect(user.savedMeals).toHaveLength(1);
      expect(user.savedMeals[0].name).toBe('New Meal');
      expect(user.savedMeals[0].ingredients).toHaveLength(2);
    });

    it('should be able to add a meal plan', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });
      
      // Add a meal plan
      user.mealPlans.push({
        name: 'New Plan',
        meals: [{
          mealId: new mongoose.Types.ObjectId(),
          date: new Date(),
          portionSize: 1
        }]
      });
      
      expect(user.mealPlans).toHaveLength(1);
      expect(user.mealPlans[0].name).toBe('New Plan');
      expect(user.mealPlans[0].meals).toHaveLength(1);
    });

    it('should be able to add to grocery list', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });
      
      // Add to grocery list
      user.groceryList.push({
        ingredient: 'Bananas',
        quantity: '6',
        store: 'Grocery Store',
        price: 2.99
      });
      
      expect(user.groceryList).toHaveLength(1);
      expect(user.groceryList[0].ingredient).toBe('Bananas');
      expect(user.groceryList[0].price).toBe(2.99);
    });

    it('should be able to add to nutrition log', () => {
      const user = new User({
      username: 'testuser',
      password: 'password123'
    });

      // Add to nutrition log
      user.nutritionLog.push({
        date: new Date(),
        meals: [{
          mealId: new mongoose.Types.ObjectId(),
          name: 'Lunch',
          calories: 600,
          protein: 40,
          carbs: 50,
          fats: 25
        }]
      });
      
      expect(user.nutritionLog).toHaveLength(1);
      expect(user.nutritionLog[0].meals).toHaveLength(1);
      expect(user.nutritionLog[0].meals[0].name).toBe('Lunch');
      expect(user.nutritionLog[0].meals[0].calories).toBe(600);
    });

    it('should be able to update preferences', () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      preferences: {
        caloricGoal: 2000,
        macroSplit: {
          protein: 150,
          carbs: 200,
          fats: 70
        }
      }
    });

      // Update preferences
      user.preferences.caloricGoal = 1800;
      user.preferences.macroSplit.protein = 160;
      
      expect(user.preferences.caloricGoal).toBe(1800);
      expect(user.preferences.macroSplit.protein).toBe(160);
    });
  });

  // Model behavior tests
  describe('Model Behavior', () => {
    it('should create a valid model instance', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });
      
      expect(user).toBeInstanceOf(mongoose.Model);
      expect(user.constructor.modelName).toBe('User');
    });

    it('should have the correct collection name', () => {
      // Mongoose typically pluralizes and lowercases the model name for collection
      expect(User.collection.collectionName).toBe('users');
    });
  });
  
  // Database operation tests
  describe('Database Operations', () => {
    it('should save a user to the database', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      // Retrieve from DB and verify
      const savedUser = await User.findById(user._id);
      expect(savedUser).toBeDefined();
      expect(savedUser.username).toBe('testuser');
    });

    it('should enforce unique usernames', async () => {
      // Create a user
      await User.create({
        username: 'uniqueuser',
        password: 'password123'
      });

      // Try to create another user with the same username
      const duplicateUser = new User({
        username: 'uniqueuser',
        password: 'differentpassword'
      });

      // This should fail due to the unique constraint
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should find a user by username', async () => {
      // Create a user
      await User.create({
        username: 'findme',
        password: 'password123'
      });

      // Find the user
      const foundUser = await User.findOne({ username: 'findme' });
      
      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe('findme');
    });

    it('should update a user', async () => {
      // Create a user
      const user = await User.create({
        username: 'updateme',
        password: 'password123'
      });

      // Update the user
      await User.findByIdAndUpdate(
        user._id,
        {
          password: 'newpassword',
          'preferences.caloricGoal': 2200
        },
        { new: true }
      );

      // Retrieve and verify
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.password).toBe('newpassword');
      expect(updatedUser.preferences.caloricGoal).toBe(2200);
    });

    it('should delete a user', async () => {
      // Create a user
      const user = await User.create({
        username: 'deleteme',
        password: 'password123'
      });

      // Delete the user
      await User.findByIdAndDelete(user._id);

      // Verify it's gone
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
    
    it('should add a saved meal to a user', async () => {
      // Create a user
      const user = await User.create({
        username: 'mealuser',
        password: 'password123'
      });
      
      // Add a saved meal
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            savedMeals: {
              mealId: new mongoose.Types.ObjectId(),
              name: 'Database Meal',
              img: 'meal.jpg',
              recipe: 'Recipe instructions',
              ingredients: ['ingredient1', 'ingredient2'],
              nutrition: {
                calories: 500,
                protein: 30,
                carbs: 40,
                fats: 20,
                dietaryRestrictions: ['vegan']
              }
            }
          }
        },
        { new: true }
      );
      
      // Retrieve and verify
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.savedMeals).toHaveLength(1);
      expect(updatedUser.savedMeals[0].name).toBe('Database Meal');
    });
    
    it('should add a meal plan to a user', async () => {
      // Create a user
      const user = await User.create({
        username: 'planuser',
        password: 'password123'
      });
      
      // Add a meal plan
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            mealPlans: {
              name: 'Database Plan',
              meals: [{
                mealId: new mongoose.Types.ObjectId(),
                date: new Date(),
                portionSize: 1
              }]
            }
          }
        },
        { new: true }
      );
      
      // Retrieve and verify
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.mealPlans).toHaveLength(1);
      expect(updatedUser.mealPlans[0].name).toBe('Database Plan');
    });
    
    it('should add to a user\'s grocery list', async () => {
      // Create a user
      const user = await User.create({
        username: 'groceryuser',
        password: 'password123'
      });
      
      // Add to grocery list
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            groceryList: {
              ingredient: 'Database Bananas',
              quantity: '6',
              store: 'Grocery Store',
              price: 2.99
            }
          }
        },
        { new: true }
      );
      
      // Retrieve and verify
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.groceryList).toHaveLength(1);
      expect(updatedUser.groceryList[0].ingredient).toBe('Database Bananas');
    });
    
    it('should add to a user\'s nutrition log', async () => {
      // Create a user
      const user = await User.create({
        username: 'loguser',
        password: 'password123'
      });
      
      // Add to nutrition log
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            nutritionLog: {
              date: new Date(),
              meals: [{
                mealId: new mongoose.Types.ObjectId(),
                name: 'Database Lunch',
                calories: 600,
                protein: 40,
                carbs: 50,
                fats: 25
              }]
            }
          }
        },
        { new: true }
      );
      
      // Retrieve and verify
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.nutritionLog).toHaveLength(1);
      expect(updatedUser.nutritionLog[0].meals[0].name).toBe('Database Lunch');
    });
  });
}); 