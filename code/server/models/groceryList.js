import mongoose from 'mongoose';

const groceryListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: String
  }]
});

const GroceryList = mongoose.model('GroceryList', groceryListSchema);

export default GroceryList; 