const express = require("express");
const router = express.Router();
const AdminRouter = require("./admin");
const CartRouter = require("./cart");
const { getCategories } = require("../utils/categories");
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
} = require("../utils/drinks");

router.use("/admin", AdminRouter);
router.use("/cart", CartRouter);

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

module.exports = router;
