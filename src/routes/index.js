const express = require("express");
const router = express.Router();
const layout = "_layouts/layout";
const { getCategories } = require("../utils/categories");
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
  getDrinksWithCategoriesByCategory,
  getFilteredDrinksWithCategories,
} = require("../utils/drinks");
const { OrderWasNotFound, productWasNotFound } = require("../utils/errors");
const {
  getAllOrdersByUserId,
  createNewOrder,
  getOrderById,
} = require("../utils/orders");

let filter = {
  min: 1,
  max: 99,
  category: "",
};

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
  filter = {
    min: 1,
    max: 99,
    category: "",
  };

  return res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await getCategories(),
    drinks: await getDrinksWithCategories(),
    filter: filter,
  });
});

router.post("/filter", async (req, res) => {
  filter.min = parseInt(req.body.min_price);
  filter.max = parseInt(req.body.max_price);
  let title = "Good Drink for Good Moments";
  if (filter.category.length > 0) {
    title = filter.category;
  }
  console.log(filter);
  return res.render("index", {
    title: title,
    categories: await getCategories(),
    drinks: await getFilteredDrinksWithCategories(filter),
    filter: filter,
    user: res.locals.user,
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
    layout: layout,
    title: "View Drink details",
    drink: drink,
  });
});

router.get("/filter/:category", async (req, res) => {
  const category = req.params.category;
  filter.category = category;

  return res.render("index", {
    title: category,
    categories: await getCategories(),
    drinks: await getDrinksWithCategoriesByCategory(category),
    filter: filter,
  });
});

router.get("/order/", async (req, res) => {
  let order = await createNewOrder(res.locals.cart, res.locals.user);
  delete req.session.cart;
  req.flash("success", "Yuo made a new order! Yuor new order id: " + order._id);
  res.redirect("/orders/1");
});

router.get("/orders", async (req, res) => {
  res.redirect("/orders/1");
});

router.get("/orders/:upage", async (req, res) => {
  const orders = await getAllOrdersByUserId(res.locals.user.email);

  const currentPage = req.params.upage;
  const limit = 5;
  let pages = orders.length / limit;

  if (orders.length % limit !== 0) {
    pages++;
  }

  const startIndex = (currentPage - 1) * limit;
  const endIndex = currentPage * limit;

  const result = orders.slice(startIndex, endIndex);

  res.render("orders", {
    layout: layout,
    title: "Orders that you made",
    orders: result,
    stats: stats,
    pages: pages,
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
