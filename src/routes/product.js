const express = require("express");
const router = express.Router();
const Product = require("./../models/product");
const country = require("country-list-js");
const viewsProductPath = "admin/product/";
const adminLayout = "_layouts/admin_layout";
const { noCategories, productWasNotFound } = require("../utils/errors");
const {
  getProductsWithCategories,
  getProductWithCategoryById,
  deleteProduct,
  createNewProduct,
  editProduct,
  saveDrink,
} = require("../utils/product");
const { getCategories } = require("../utils/categories");

router.get("/", async (req, res) => {
  res.render(viewsProductPath + "product", {
    layout: adminLayout,
    title: "Products",
    products: await getProductsWithCategories(),
  });
});

router.get("/new", async (req, res) => {
  const categories = await getCategories();

  if (categories === undefined) {
    return res
      .status(noCategories.status)
      .render(viewsProductPath + "product", {
        failure: noCategories.message,
        layout: adminLayout,
        title: "Products",
        products: await getProductsWithCategories(),
      });
  }
  res.render(viewsProductPath + "new", {
    layout: adminLayout,
    title: "Add new Drink",
    categories: categories,
    product: new Product(),
    countries: country.names().sort(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const product = await getProductWithCategoryById(req.params.id);
  const categories = await getCategories();

  if (categories === undefined) {
    return res
      .status(noCategories.status)
      .render(viewsProductPath + "product", {
        failure: noCategories.message,
        layout: adminLayout,
        title: "Products",
        products: await getProductsWithCategories(),
        categories: null,
      });
  }
  if (product === undefined) {
    return res
      .status(productWasNotFound.status)
      .render(viewsProductPath + "product", {
        failure: productWasNotFound.message,
        layout: adminLayout,
        title: "Products",
        products: await getProductsWithCategories(),
        categories: categories,
      });
  }

  res.render(viewsProductPath + "edit", {
    layout: adminLayout,
    title: "Edit Drink",
    categories: categories,
    product: product,
    countries: country.names().sort(),
  });
});

router.get("/:id", async (req, res) => {
  const product = await getProductWithCategoryById(req.params.id);

  if (product.length === undefined) {
    return res
      .status(productWasNotFound.status)
      .render(viewsProductPath + "product", {
        failure: productWasNotFound.message,
        layout: adminLayout,
        title: "Products",
        products: await getProductsWithCategories(),
        categories: categories,
      });
  }

  res.render(viewsProductPath + "show", {
    layout: adminLayout,
    title: "View Drink",
    product: product,
  });
});

router.post("/new", createNewProduct, saveDrink, async (req, res, next) => {
  res.render(viewsProductPath + "product", {
    success: "New product was added",
    layout: adminLayout,
    title: "Products",
    products: await getProductsWithCategories(),
  });
});

router.put("/edit/:id", editProduct, saveDrink, async (req, res, next) => {
  res.render(viewsProductPath + "product", {
    success: "Product was successfully changed",
    layout: adminLayout,
    title: "Products",
    products: await getProductsWithCategories(),
  });
});

router.delete("/:id", deleteProduct, async (req, res) => {
  res.redirect("./");
});

module.exports = router;
