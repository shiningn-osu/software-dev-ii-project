import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  plan: {
    type: Object,
    required: true
  },
  settings: {
    allergies: [String],
    diet: String,
    minCalories: Number,
    maxCalories: Number
  }
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan; 