const express = require("express");
const router = express.Router();
const layout = "_layouts/layout";
const { getCategories } = require("../utils/categories");
const {
  getDrinksWithCategories,
  getDrinksWithCategoriesByCategory,
} = require("../utils/drinks");
const { OrderWasNotFound } = require("../utils/errors");
const {
  getAllOrdersByUserId,
  createNewOrder,
  getOrderById,
} = require("../utils/orders");

const stats = [
  "Order rejected",
  "Pending for confirmation",
  "Pending for delivery confirmation",
  "Order delivered",
];

router.use("/admin", require("./admin"));
router.use("/cart", require("./cart"));
router.use("/user", require("./user"));

router.get("/", async (req, res) => {
  return res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await getCategories(),
    drinks: await getDrinksWithCategories(),
  });
});

router.get("/:category", async (req, res) => {
  const category = req.params.category;

  return res.render("index", {
    title: category,
    categories: await getCategories(),
    drinks: await getDrinksWithCategoriesByCategory(category),
  });
});

router.get("/order/", async (req, res) => {
  let order = await createNewOrder(res.locals.cart, res.locals.user);
  delete req.session.cart;
  req.flash("success", "Yuo made a new order! Yuor new order id: " + order._id);
  res.redirect("/orders");
});

router.get("/orders", async (req, res) => {
  res.render("orders", {
    layout: layout,
    title: "Orders that you made",
    orders: await getAllOrdersByUserId(res.locals.user.email),
    stats: stats,
  });
});

router.get("/orders/view/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);

  if (order === undefined) {
    req.flash(
      "warning",
      `Status: ${OrderWasNotFound.status}! ${OrderWasNotFound.message}`
    );

    return res.redirect("/orders");
  }

  res.render("admin/order/show", {
    title: "Order's details",
    order: order,
    stats: stats,
  });
});

module.exports = router;
