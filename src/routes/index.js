const express = require("express");
const Order = require("../models/order");
const router = express.Router();
const { getCategories } = require("../utils/categories");
const { getDrinksWithCategories } = require("../utils/drinks");
const { checkAuth } = require("../utils/authorization");

router.use("/admin", require("./admin"));
router.use("/cart", require("./cart"));
router.use("/user", require("./user"));

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await getCategories(),
    drinks: await getDrinksWithCategories(),
  });
});
router.get("/order", async (req, res) => {
  let cart = res.locals.cart;
  let user = res.locals.user;
  let price = 0;
  await cart.forEach(
    (product) => (price += parseFloat(product.price) * product.quantity)
  );
  console.log(price);
  let order = new Order();
  order.userid = user.email;
  order.price = price;
  order.details =
    ("User contacts: %s %s  email: %s  phone: %s  address: %s",
    user.name,
    user.surname,
    user.email,
    user.phone,
    user.address);

  console.log(order);

  res.redirect("/");
  //console.log("userid: ", req.locals.user);
  // res.render("", {
  //   title: "Good Drink for Good Moments",
  //   categories: await getCategories(),
  //   drinks: await getDrinksWithCategories(),
  // });
});
router.get("/drink/:id", async (req, res) => {
  // const product = await getDrinkWithCategoryById(req.params.id);
  // if (product == null) res.redirect("/");
  // res.render("admin/drink/show", {
  //   title: "View Drink",
  //   product: product,
  // });
  res.redirect("/");
});

module.exports = router;
