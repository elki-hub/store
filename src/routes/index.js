const express = require("express");
const router = express.Router();
const AdminRouter = require("./admin");
const Product = require("../models/drink");
const Category = require("./../models/category");
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
} = require("../utils/drinks");

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await Category.find().sort({ name: "desc" }),
    drinks: await getDrinksWithCategories(),
  });
});

router.get("/drink/:id", async (req, res) => {
  const product = await getDrinkWithCategoryById(req.params.id);
  if (product == null) res.redirect("/");
  res.render("admin/drink/show", {
    title: "View Drink",
    product: product,
  });
});

router.use("/admin", AdminRouter);

module.exports = router;
