const express = require("express");
const router = express.Router();
const Product = require("./../models/product");
const Category = require("./../models/category");
const country = require("country-list-js");
const viewsProductPath = "admin/product/";
const layout = "_layouts/admin_layout";
let fs = require("fs-extra");
const {
  getProductsWithCategories,
  getProductById,
} = require("../modules/product");

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });

  res.render(viewsProductPath + "product", {
    layout: layout,
    title: "Products",
    products: await getProductsWithCategories(),
    categories: categories,
  });
});

router.get("/new", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });

  if (categories == null) {
    //You don't have any categories yet. Add new category firs
    res.redirect("/");
  }
  res.render(viewsProductPath + "new", {
    layout: layout,
    title: "Add new Drink",
    categories: categories,
    product: new Product(),
    countries: country.names().sort(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  const categories = await Category.find().sort({ name: "desc" });

  if (categories == null) {
    //You don't have any categories yet. Add new category firs
    res.redirect("/");
  }
  if (product == null) {
    res.redirect("/");
  }

  res.render(viewsProductPath + "edit", {
    layout: layout,
    title: "Edit Drink",
    categories: categories,
    product: product,
    countries: country.names().sort(),
  });
});

router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (product == null) res.redirect("/");
  res.render(viewsProductPath + "show", {
    layout: layout,
    title: "View Drink",
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
  try {
    let product = await Product.findById(req.params.id);
    if (product.image !== undefined || product.image !== null) {
      await fs.remove(
        "public/images/products/" + product.id + "_" + product.image
      );
    }

    await Product.findByIdAndDelete(req.params.id);
    //req.flash("success", "Category was deleted");
    res.redirect("./");
  } catch (e) {
    console.log(e);
    res.redirect("./");
  }
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
    if (image !== null) {
      product.image = image;
    }
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
