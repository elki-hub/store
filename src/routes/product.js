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

router.get("/", async (req, res) => {
  res.render(viewsDrinkPath + "drink", {
    layout: adminLayout,
    title: "Drinks",
    drinks: await getDrinksWithCategories(),
  });
});

router.get("/new", async (req, res) => {
  const categories = await getCategories();

  if (categories === undefined) {
    return res.status(noCategories.status).render(viewsDrinkPath + "drink", {
      failure: noCategories.message,
      layout: adminLayout,
      title: "Drinks",
      drinks: await getDrinksWithCategories(),
    });
  }
  res.render(viewsDrinkPath + "new", {
    layout: adminLayout,
    title: "Add new Drink",
    categories: categories,
    drink: new Drink(),
    countries: country.names().sort(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const drink = await getDrinkWithCategoryById(req.params.id);
  const categories = await getCategories();

  if (categories === undefined) {
    return res.status(noCategories.status).render(viewsDrinkPath + "drink", {
      failure: noCategories.message,
      layout: adminLayout,
      title: "drinks",
      drinks: await getDrinksWithCategories(),
      categories: null,
    });
  }
  if (drink === undefined) {
    return res
      .status(productWasNotFound.status)
      .render(viewsDrinkPath + "drink", {
        failure: productWasNotFound.message,
        layout: adminLayout,
        title: "Drinks",
        drinks: await getDrinksWithCategories(),
        categories: categories,
      });
  }

  res.render(viewsDrinkPath + "edit", {
    layout: adminLayout,
    title: "Edit Drink",
    categories: categories,
    drink: drink,
    countries: country.names().sort(),
  });
});

router.get("/:id", async (req, res) => {
  const drink = await getDrinkWithCategoryById(req.params.id);

  if (drink === undefined) {
    return res
      .status(productWasNotFound.status)
      .render(viewsDrinkPath + "drink", {
        failure: productWasNotFound.message,
        layout: adminLayout,
        title: "Drinks",
        drinks: await getDrinksWithCategories(),
        categories: await getCategories(),
      });
  }

  res.render(viewsDrinkPath + "show", {
    layout: adminLayout,
    title: "View Drink",
    drink: drink,
  });
});

router.post("/new", createNewDrink, saveDrink, async (req, res, next) => {
  res.render(viewsDrinkPath + "drink", {
    success: "New drink was added",
    layout: adminLayout,
    title: "Drinks",
    drinks: await getDrinksWithCategories(),
  });
});

router.put("/edit/:id", editDrink, saveDrink, async (req, res, next) => {
  res.render(viewsDrinkPath + "drink", {
    success: "Drink was successfully changed",
    layout: adminLayout,
    title: "Drinks",
    drinks: await getDrinksWithCategories(),
  });
});

router.delete("/:id", deleteDrink, async (req, res) => {
  res.redirect("./");
});

module.exports = router;
