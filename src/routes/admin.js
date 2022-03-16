const express = require("express");
const router = express.Router();
const ProductRouter = require("./product");
const CategoryRouter = require("./category");
const { getDrinksWithCategories } = require("../utils/drinks");
const { getCategories } = require("../utils/categories");
const currentPath = "admin/";

router.use("/drink", ProductRouter);
router.use("/category", CategoryRouter);

router.get("/", async (req, res) => {
  const categories = await getCategories();
  res.render(currentPath + "admin", {
    layout: "_layouts/admin_layout",
    title: "Admin Page",
    categories: categories,
    drinks: await getDrinksWithCategories(),
  });
});

module.exports = router;
