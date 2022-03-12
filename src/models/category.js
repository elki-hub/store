const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
});

module.exports = model("Category", CategorySchema);
