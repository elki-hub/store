const Category = require("../models/category");

async function getCategories() {
  try {
    return await Category.find().sort({ name: "desc" });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getCategoryById(id) {
  try {
    return null;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getCategories, getCategoryById };
