
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/expenses', expenseRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('ExpenseWise API is running');
});

// Test MongoDB connection
app.get('/api/test', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      res.json({
        status: 'success',
        message: 'MongoDB is connected',
        databaseName: mongoose.connection.db.databaseName
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'MongoDB is not connected',
        readyState: mongoose.connection.readyState
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking MongoDB connection',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
