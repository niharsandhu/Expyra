const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productType: { type: String, required: true },
  brand: { type: String },
  imageUrl: { type: String }, // new field for product image
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
