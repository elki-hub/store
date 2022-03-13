const express = require("express");
const router = express.Router();
const ProductRouter = require("./product");
const CategoryRouter = require("./category");
const Product = require("./../models/product");
const Category = require("./../models/category");
const currentPath = "admin/";

router.use("/product", ProductRouter);
router.use("/category", CategoryRouter);

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });
  res.render(currentPath + "admin", {
    layout: "_layouts/admin_layout",
    title: "Admin Page",
    categories: categories,
    products: await Product.find().sort({ name: "desc" }),
  });
});

module.exports = router;
