const express = require("express");
const router = express.Router();
const AdminRouter = require("./admin");
const Product = require("./../models/product");
const Category = require("./../models/category");

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await Category.find().sort({ name: "desc" }),
    products: await Product.find().sort({ name: "desc" }),
  });
});

router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product == null) res.redirect("/");
  res.render("admin/product/show", {
    title: "View Drink",
    category: await Category.findById(product.category),
    product: product,
  });
});

router.use("/admin", AdminRouter);

module.exports = router;
