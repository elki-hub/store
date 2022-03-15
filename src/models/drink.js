const mongoose = require("mongoose");
const { Decimal128 } = require("mongodb");
const { Schema, model } = mongoose;

const DrinkSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  category: String,
  price: {
    type: Decimal128,
    required: [true, "drink price is required"],
    min: [0.01, "Product price cannot be below 0"],
  },
  country: {
    type: String,
  },
  size: {
    type: Decimal128,
    required: [true, "drink size is required"],
    min: [0.01, "Product size cannot be below 0"],
  },
  image: {
    type: String,
  },
  degree: {
    type: Decimal128,
    required: [true, "drink degree is required"],
    min: [0, "Product degree cannot be below 0"],
  },
  description: String,
});

module.exports = model("Drink", DrinkSchema);
