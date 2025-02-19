import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    dietaryRestrictions: [String], // Example: ["vegan", "gluten-free"]
    caloricGoal: Number, // User's daily caloric target
    macroSplit: {
      protein: Number, // grams
      carbs: Number, // grams
      fats: Number // grams
    }
  },
  savedMeals: [{
    mealId: mongoose.Schema.Types.ObjectId,
    name: String,
    img: String,
    recipe: String,
    ingredients: [String],
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number,
      dietaryRestrictions: [String]
    }
  }],
  mealPlans: [{
    name: String,
    meals: [{
      mealId: mongoose.Schema.Types.ObjectId,
      date: Date,
      portionSize: Number
    }]
  }],
  groceryList: [{
    ingredient: String,
    quantity: String,
    store: String,
    price: Number
  }],
  nutritionLog: [{
    date: Date,
    meals: [{
      mealId: mongoose.Schema.Types.ObjectId,
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number
    }]
  }]
});

export default mongoose.model('User', UserSchema);