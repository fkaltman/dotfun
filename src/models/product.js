const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: String,
  subtitle: String,
  image: String,
  price: {
    type: Number,
    required: true,
  },
  description: String,
  stockQty: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
