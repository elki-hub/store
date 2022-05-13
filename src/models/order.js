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
  },
  data: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
    default: 1,
  },
  statusDetails: {
    type: String,
  },
  details: {
    type: Array,
  },
  products: {
    type: Array,
  },
});

module.exports = model("Order", OrderSchema);
