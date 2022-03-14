const express = require("express");
const router = express.Router();
const AdminRouter = require("./admin");
const Product = require("./../models/product");
const Category = require("./../models/category");
const {
  getProductsWithCategories,
  getProductById,
} = require("../modules/product");

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await Category.find().sort({ name: "desc" }),
    products: await getProductsWithCategories(),
  });
});

router.get("/product/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (product == null) res.redirect("/");
  res.render("admin/product/show", {
    title: "View Drink",
    product: product,
  });
});

router.use("/admin", AdminRouter);

module.exports = router;
