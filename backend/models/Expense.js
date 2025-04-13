
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'transportation', 'housing', 'utilities', 'entertainment', 
           'healthcare', 'education', 'shopping', 'personal', 'other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  isIncome: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
