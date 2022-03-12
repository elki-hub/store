const express = require("express");
const router = express.Router();
const Product = require("./../models/product");
const Category = require("./../models/category");
const viewsProductPath = "admin/product/";

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ name: "desc" });
  res.render(viewsProductPath + "product", {
    title: "Products",
    products: products,
    categories: await Category.find().sort({ name: "desc" }),
  });
});

router.get("/new", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });
  res.render(viewsProductPath + "new", {
    title: "Add new Drink",
    categories: categories,
    product: new Product(),
    productCategory: null,
  });
});

router.get("/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product == null) res.redirect("/");
  res.render(viewsProductPath + "edit", {
    title: "Edit Drink",
    categories: await Category.find().sort({ name: "desc" }),
    product: product,
    productCategory: await Category.findById(product.category),
  });
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product == null) res.redirect("/");
  res.render(viewsProductPath + "show", {
    title: "View Drink",
    category: await Category.findById(product.category),
    product: product,
  });
});

router.post(
  "/new",
  async (req, res, next) => {
    req.product = new Product();
    next();
  },
  saveDrinkAndRedirect("new")
);

router.put(
  "/edit/:id",
  async (req, res, next) => {
    req.product = await Product.findById(req.params.id);
    next();
  },
  saveDrinkAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("./");
});

function saveDrinkAndRedirect(onErrorRender) {
  return async (req, res) => {
    let { name, category, price, degree, description } = req.body;

    let product = req.product;
    product.name = name;
    product.category = category;
    product.price = price;
    product.degree = degree;
    product.description = description;
    try {
      await product.save();
      res.redirect("../");
    } catch (e) {
      console.log(e);
      res.render(viewsProductPath + `${onErrorRender}`, {
        title: "Products",
        product: product,
      });
    }
  };
}

module.exports = router;
