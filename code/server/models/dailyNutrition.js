import mongoose from 'mongoose';

const dailyNutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meals: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    timeEaten: Date
  }],
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 }
  }
});

// Add index for querying by user and date
dailyNutritionSchema.index({ userId: 1, date: 1 });

export default mongoose.model('DailyNutrition', dailyNutritionSchema); 