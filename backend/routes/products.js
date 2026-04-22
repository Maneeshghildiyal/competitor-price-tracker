const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, minRating } = req.query;
    
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.current_price = {};
      if (minPrice) query.current_price.$gte = Number(minPrice);
      if (maxPrice) query.current_price.$lte = Number(maxPrice);
    }
    
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    
    const products = await Product.find(query).sort({ current_price: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
