const Product = require("../models/product");

module.exports.getProductsWithCategories = async function () {
  return await Product.aggregate([
    {
      $set: {
        category: { $toObjectId: "$category" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categories",
      },
    },
  ]);
};

module.exports.getProductById = async function (id) {
  let products = await Product.aggregate([
    {
      $set: {
        id: { $toString: "$_id" },
        category: { $toObjectId: "$category" },
      },
    },
    {
      $match: {
        id: id,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categories",
      },
    },
  ]);

  return products[0];
};
