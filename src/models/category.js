const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// const slugify = require('slugify')

const CategorySchema = new Schema({
  name: {
    type: String,
    validate: [/^[A-Za-z]+$/, "Category name should be alphabetic"],
    required: [true, "Category name is required"],
    maxLength: [20, "Category name is too long"],
  },
  slug: {
    type: String,
  },
});

// CategorySchema.pre('validate', function(next) {
//   if (this.title) {
//     this.slug = slugify(this.title, { lower: true, strict: true })
//   }
//
//   next()
// })

module.exports = model("Category", CategorySchema);
