const Category = require("../models/category");

async function getCategories() {
  try {
    return await Category.find().sort({ name: "desc" });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getCategoryId(category) {
  try {
    let categories = await Category.find({ name: category });
    return categories[0]._id;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getCategories, getCategoryId };
