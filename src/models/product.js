const mongoose = require('mongoose')
const { Decimal128 } = require("mongodb");
const {Schema, model} = mongoose

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  category: String,
  price: {
    type: Decimal128,
    required: [true, "product price is required"],
    min: [0.01, "Product price cannot be below 0"],
  },
  // size: {
  //   type: Decimal128,
  //   required: [true, "product size is required"],
  //   min: [0.01, "Product price cannot be below 0"],
  // },
  // image: {
  //   type: String,
  //   required: true,
  // },
  degree:{
    type: Decimal128,
    required: [true, "product degree is required"],
    min: [0, "Product degree cannot be below 0"],
  },
  description: String
});

module.exports = model('Product', ProductSchema);
