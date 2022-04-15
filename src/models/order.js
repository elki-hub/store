const mongoose = require("mongoose");
const { Decimal128 } = require("mongodb");
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  userid: {
    type: String,
    required: [true, "Product name is required"],
  },
  price: {
    type: Decimal128,
    required: [true, "order price is required"],
    min: [0.01, "Product price cannot be below 0"],
  },
  data: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
  details: {
    type: String,
  },
  products: {
    type: Array,
  },
  //goods -> gerimu listas
});

module.exports = model("Order", OrderSchema);
