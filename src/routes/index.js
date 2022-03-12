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

router.use("/admin", AdminRouter);

module.exports = router;
