const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");
const country = require("country-list-js");
const viewsDrinkPath = "admin/drink/";
const routerPath = "/admin/drink/";
const adminLayout = "_layouts/admin_layout";
const {
  noCategories,
  productWasNotFound,
  OrderWasNotFound,
} = require("../utils/errors");
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
  deleteDrink,
  createNewDrink,
  editDrink,
  saveDrink,
  getDrinkById,
} = require("../utils/drinks");
const { getCategories } = require("../utils/categories");
const { checkAuthAdmin } = require("../utils/authorization");
const { getOrderById } = require("../utils/orders");

router.get("/", checkAuthAdmin, async (req, res) => {
  res.redirect("/admin/drink/1");
});

router.get("/:page", checkAuthAdmin, async (req, res) => {
  const drinks = await getDrinksWithCategories();

  const currentPage = req.params.page;
  const limit = 5;
  let pages = drinks.length / limit;

  if (drinks.length % limit !== 0) {
    pages++;
  }

  const startIndex = (currentPage - 1) * limit;
  const endIndex = currentPage * limit;

  const result = drinks.slice(startIndex, endIndex);

  res.render(viewsDrinkPath + "drink", {
    layout: adminLayout,
    title: "Drinks",
    drinks: result,
    pages: pages,
  });
});

router.get("/new", checkAuthAdmin, async (req, res) => {
  const categories = await getCategories();

  if (categories === undefined) {
    req.flash(
      "warning",
      `Status: ${noCategories.status}! ${noCategories.message}`
    );
    return res.redirect(routerPath);
  }
  res.render(viewsDrinkPath + "new", {
    layout: adminLayout,
    title: "Add new Drink",
    categories: categories,
    drink: new Drink(),
    countries: country.names().sort(),
  });
});

router.get("/edit/:id", checkAuthAdmin, async (req, res) => {
  const drink = await getDrinkWithCategoryById(req.params.id);
  const categories = await getCategories();

  if (categories === undefined) {
    req.flash(
      "warning",
      `Status: ${noCategories.status}! ${noCategories.message}`
    );
    return res.redirect(routerPath);
  }
  if (drink === undefined) {
    req.flash(
      "warning",
      `Status: ${productWasNotFound.status}! ${productWasNotFound.message}`
    );
    return res.redirect(routerPath);
  }

  res.render(viewsDrinkPath + "edit", {
    layout: adminLayout,
    title: "Edit Drink",
    categories: categories,
    drink: drink,
    countries: country.names().sort(),
  });
});

router.post("/new", createNewDrink, saveDrink, async (req, res) => {
  req.flash("success", "New drink was added");
  res.redirect(routerPath);
});

router.put("/edit/:id", editDrink, saveDrink, async (req, res) => {
  req.flash("success", "Drink was successfully changed");
  res.redirect(routerPath);
});

router.delete("/:id", deleteDrink, async (req, res) => {
  res.send("success");
});

router.get("/view/:id", async (req, res) => {
  const drink = await getDrinkWithCategoryById(req.params.id);
  if (drink === undefined) {
    req.flash(
      "warning",
      `Status: ${OrderWasNotFound.status}! ${OrderWasNotFound.message}`
    );
    return res.redirect("/admin");
  }
  console.log(drink);
  res.render(viewsDrinkPath + "show", {
    layout: adminLayout,
    title: "Drink details",
    drink: drink,
  });
});

module.exports = router;
