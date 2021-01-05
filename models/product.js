const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  stockQty: String,
});

module.exports = mongoose.model("Product", ProductSchema);
