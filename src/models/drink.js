const mongoose = require("mongoose");
const { Decimal128 } = require("mongodb");
const { Schema, model } = mongoose;
const country = require("country-list-js");

const DrinkSchema = new Schema({
  name: {
    type: String,
    pattern: ["/^[A-Za-z]+$/", "Product name should be alphabetic"],
    required: [true, "Product name is required"],
  },
  category: String,
  price: {
    type: [Decimal128, "Drink price should be a number"],
    required: [true, "drink price is required"],
    min: [0.01, "Product price cannot be below 0"],
  },
  country: {
    type: String,
    valid: [country.names(), "This country is not in the list"],
  },
  size: {
    type: [Decimal128, "Drink size should be a number"],
    required: [true, "drink size is required"],
    min: [0.01, "Product size cannot be below 0"],
  },
  image: {
    type: [String, "Invalid image"],
  },
  degree: {
    type: [Decimal128, "Drink degree should be a number"],
    required: [true, "drink degree is required"],
    min: [0, "Product degree cannot be below 0"],
  },
  description: {
    type: [String, "Invalid description"],
  },
});

module.exports = model("Drink", DrinkSchema);
