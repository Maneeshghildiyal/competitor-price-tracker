const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  current_price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  availability: {
    type: String
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  domain: {
    type: String
  },
  price_history: [priceHistorySchema],
  predicted_price: {
    type: Number,
    default: null
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
