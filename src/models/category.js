const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// const slugify = require('slugify')

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
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
