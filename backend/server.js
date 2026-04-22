require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const productRoutes = require('./routes/products');

// Import scheduler
require('./scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

app.get('/api/trends', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const products = await Product.find({});
    
    // Calculate simple market average trend (e.g. average price of all products over time)
    // Note: For a real app, this would be a more complex aggregation.
    res.json({
        message: "Trends API - This would return market-wide aggregated data",
        data: products.slice(0, 5) // Return sample data
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trends data" });
  }
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
