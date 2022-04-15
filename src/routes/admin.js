const express = require("express");
const router = express.Router();
const { getDrinksWithCategories } = require("../utils/drinks");
const { getCategories } = require("../utils/categories");
const currentPath = "admin/";
const { checkAuthAdmin } = require("../utils/authorization");

router.use("/drink", require("./product"));
router.use("/category", require("./category"));

const OrderRouter = require("./order");
const { getOrders, getOrdersWithCategories } = require("../utils/orders");
router.use("/order", OrderRouter);

router.get("/", checkAuthAdmin, async (req, res) => {
  const categories = await getCategories();
  res.render(currentPath + "admin", {
    layout: "_layouts/admin_layout",
    title: "Admin Page",
    categories: categories,
    drinks: await getDrinksWithCategories(),
    orders: await getOrdersWithCategories(),
  });
});

module.exports = router;
