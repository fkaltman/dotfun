const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  stockQty: Number,
});

module.exports = mongoose.model("Product", ProductSchema);
