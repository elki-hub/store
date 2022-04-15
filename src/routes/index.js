const express = require("express");
const router = express.Router();
const { getCategories } = require("../utils/categories");
const { getDrinksWithCategories } = require("../utils/drinks");
const { checkAuth } = require("../utils/authorization");

router.use("/admin", require("./admin"));
router.use("/cart", checkAuth, require("./cart"));
router.use("/user", require("./user"));

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
