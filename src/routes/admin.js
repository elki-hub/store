const express = require("express");
const router = express.Router();
const ProductRouter = require("./product");
const CategoryRouter = require("./category");
const Product = require("../models/drink");
const Category = require("./../models/category");
const currentPath = "admin/";
const { getDrinksWithCategories } = require("../utils/drinks");

router.use("/drink", ProductRouter);
router.use("/category", CategoryRouter);

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });
  res.render(currentPath + "admin", {
    layout: "_layouts/admin_layout",
    title: "Admin Page",
    categories: categories,
    drinks: await getDrinksWithCategories(),
  });
});

module.exports = router;
