const express = require("express");
const router = express.Router();
const Product = require("./../models/product");
const Category = require("./../models/category");
const country = require("country-list-js");
const viewsProductPath = "admin/product/";
const layout = "_layouts/admin_layout";
let fs = require("fs-extra");
let resizeImg = require("resize-img");

router.get("/", async (req, res) => {
  let products = await Product.find().sort({ name: "desc" });
  const categories = await Category.find().sort({ name: "desc" });

  res.render(viewsProductPath + "product", {
    layout: layout,
    title: "Products",
    products: products,
    categories: categories,
  });
});

router.get("/new", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });

  //console.log(country.names());

  res.render(viewsProductPath + "new", {
    layout: layout,
    title: "Add new Drink",
    categories: categories,
    product: new Product(),
    productCategory: null,
    countries: country.names(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product == null) res.redirect("/");
  res.render(viewsProductPath + "edit", {
    layout: layout,
    title: "Edit Drink",
    categories: await Category.find().sort({ name: "desc" }),
    product: product,
    productCategory: await Category.findById(product.category),
    countries: country.names(),
  });
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product == null) res.redirect("/");
  res.render(viewsProductPath + "show", {
    layout: layout,
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
  //req.flash("success", "Category was deleted");
  res.redirect("./");
});

function saveDrinkAndRedirect(onErrorRender) {
  return async (req, res) => {
    let { name, category, country, price, degree, size, description } =
      req.body;

    let image = req.files !== null ? req.files.image.name : null;
    let product = req.product;
    let oldProductImage = await product.image;

    product.name = name;
    product.category = category;
    product.price = price;
    product.country = country;
    product.size = size;
    product.image = image;
    product.degree = degree;
    product.description = description;

    try {
      await product.save();

      //adding photo to gallery
      if (image !== null) {
        let productImage = req.files.image;

        await fs.remove(
          "public/images/products/" + product.id + "_" + oldProductImage
        );

        await productImage.mv(
          "public/images/products/" + product.id + "_" + image,
          function (err) {
            return console.log(err);
          }
        );
      }

      res.redirect("../");
    } catch (e) {
      console.log(e);
      res.render(viewsProductPath + `${onErrorRender}`, {
        layout: layout,
        title: "Products",
        product: product,
      });
    }
  };
}

module.exports = router;
