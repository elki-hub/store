const Category = require("../models/category");

async function getCategories() {
  try {
    return await Category.find().sort({ name: "desc" });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getCategoryId(categoryName) {
  try {
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      return [];
    }

    return category._id;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getCategories, getCategoryId };
