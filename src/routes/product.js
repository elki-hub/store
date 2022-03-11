const express = require("express");
const Product = require("./../models/product");
const router = express.Router();
const viewsProductPath = "admin/product/";

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ name: "desc" });
  res.render(viewsProductPath + "product", { products: products });
});

router.get("/new", (req, res) => {
  res.render(viewsProductPath + "new", { product: new Product() });
});

router.get("/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render(viewsProductPath + "edit", { product: product });
});

/*router.get("/edit/", async (req, res) => {
  const products = await Product.find().sort({ name: "desc" });
  res.redirect("../");
});*/

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product == null) res.redirect("/");
  res.render(viewsProductPath + "show", { product: product });
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
      res.render(viewsProductPath + `${onErrorRender}`, { product: product });
    }
  };
}

module.exports = router;
