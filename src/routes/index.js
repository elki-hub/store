const express = require("express");
const router = express.Router();
const AdminRouter = require("./admin");
const CartRouter = require("./cart");
const { getCategories } = require("../utils/categories");
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
} = require("../utils/drinks");
const User = require("../models/user");
const {
  checkUserSchema,
  checkIfEmailUnique,
} = require("../validators/user.validator");

router.use("/admin", AdminRouter);
router.use("/cart", CartRouter);

router.get("*", function async(req, res, next) {
  res.locals.cart = req.session.cart;
  next();
});

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Good Drink for Good Moments",
    categories: await getCategories(),
    drinks: await getDrinksWithCategories(),
  });
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

router.get("/register", async (req, res) => {
  res.render("authorization/register", {
    title: "Create Your Account",
  });
});

router.get("/login", async (req, res) => {
  res.render("authorization/login", {
    title: "Login",
  });
});

router.post(
  "/register",
  checkUserSchema,
  checkIfEmailUnique,
  async (req, res) => {
    let { name, surname, email, password, address, phone } = req.body;

    await User.collection.insertOne({
      name,
      surname,
      //is_admin: true,
      email,
      password,
      address,
      phone,
    });

    res.render("authorization/login", {
      title: "Login",
      success: "You successfully created an account!",
    });
  }
);

module.exports = router;
