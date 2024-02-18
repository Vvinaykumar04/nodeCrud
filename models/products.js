const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  p_name: {
    type: String,
    required: true,
  },
  p_id: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Products', productSchema);