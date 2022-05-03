const express = require("express");
const router = express.Router();
const { getDrinksWithCategories } = require("../utils/drinks");
const { getCategories } = require("../utils/categories");
const currentPath = "admin/";
const { checkAuthAdmin } = require("../utils/authorization");
const OrderRouter = require("./order");
const { getAllOrdersByUserId } = require("../utils/orders");

router.use("/drink", require("./product"));
router.use("/category", require("./category"));
router.use("/order", OrderRouter);

router.get("/", checkAuthAdmin, async (req, res) => {
  const categories = await getCategories();
  res.render(currentPath + "admin", {
    layout: "_layouts/admin_layout",
    title: "Admin Page",
    categories: categories,
    drinks: await getDrinksWithCategories(),
    orders: await getAllOrdersByUserId(),
  });
});

module.exports = router;
