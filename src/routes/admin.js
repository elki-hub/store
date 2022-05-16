const express = require("express");
const router = express.Router();
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
} = require("../utils/drinks");
const { getCategories } = require("../utils/categories");
const currentPath = "admin/";
const { checkAuthAdmin } = require("../utils/authorization");
const OrderRouter = require("./order");
const { getAllOrdersByUserId } = require("../utils/orders");
const { productWasNotFound } = require("../utils/errors");

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

router.get("/drink/:id", async (req, res) => {
  const drink = await getDrinkWithCategoryById(req.params.id);

  if (drink === undefined) {
    req.flash(
      "warning",
      `Status: ${productWasNotFound.status}! ${productWasNotFound.message}`
    );
    return res.redirect("/");
  }

  res.render("view", {
    layout: "_layouts/admin_layout",
    title: "View Drink details",
    drink: drink,
  });
});

module.exports = router;
