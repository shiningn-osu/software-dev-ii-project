import mongoose from 'mongoose';

const dailyNutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  calories: {
    type: Number,
    default: 0,
    required: true
  },
  protein: {
    type: Number,
    default: 0,
    required: true
  },
  carbs: {
    type: Number,
    default: 0,
    required: true
  },
  fats: {
    type: Number,
    default: 0,
    required: true
  }
});

// Add index for faster queries
dailyNutritionSchema.index({ userId: 1, date: 1 });

const DailyNutrition = mongoose.model('DailyNutrition', dailyNutritionSchema);

export default DailyNutrition; 