import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  img: String,
  recipe: {
    type: String,
    required: true
  },
  ingredients: [{
    name: String,
    amount: Number,
    unit: String
  }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    dietaryRestrictions: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Meal', MealSchema);