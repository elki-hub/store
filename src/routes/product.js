const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");
const country = require("country-list-js");
const viewsDrinkPath = "admin/drink/";
const adminLayout = "_layouts/admin_layout";
const { noCategories, productWasNotFound } = require("../utils/errors");
const {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
  deleteDrink,
  createNewDrink,
  editDrink,
  saveDrink,
} = require("../utils/drinks");
const { getCategories } = require("../utils/categories");
const { checkAuthAdmin } = require("../utils/authorization");

router.get("/", checkAuthAdmin, async (req, res) => {
  res.render(viewsDrinkPath + "drink", {
    layout: adminLayout,
    title: "Drinks",
    drinks: await getDrinksWithCategories(),
  });
});

router.get("/new", checkAuthAdmin, async (req, res) => {
  const categories = await getCategories();

  if (categories === undefined) {
    req.flash(
      "warning",
      `Status: ${noCategories.status}! ${noCategories.message}`
    );
    return res.redirect("/admin/drink");
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
    return res.redirect("/admin/drink/");
  }
  if (drink === undefined) {
    req.flash(
      "warning",
      `Status: ${productWasNotFound.status}! ${productWasNotFound.message}`
    );
    return res.redirect("/admin/drink/");
  }

  res.render(viewsDrinkPath + "edit", {
    layout: adminLayout,
    title: "Edit Drink",
    categories: categories,
    drink: drink,
    countries: country.names().sort(),
  });
});

router.get("/:id", checkAuthAdmin, async (req, res) => {
  const drink = await getDrinkWithCategoryById(req.params.id);

  if (drink === undefined) {
    req.flash(
      "warning",
      `Status: ${productWasNotFound.status}! ${productWasNotFound.message}`
    );
    return res.redirect("/admin/drink/");
  }

  res.render(viewsDrinkPath + "show", {
    layout: adminLayout,
    title: "View Drink",
    drink: drink,
  });
});

router.post("/new", createNewDrink, saveDrink, async (req, res, next) => {
  req.flash("success", "New drink was added");
  res.redirect(viewsDrinkPath);
});

router.put("/edit/:id", editDrink, saveDrink, async (req, res, next) => {
  req.flash("success", "Drink was successfully changed");
  res.redirect(viewsDrinkPath);
});

router.delete("/:id", deleteDrink, async (req, res) => {
  res.send("success");
});

module.exports = router;
