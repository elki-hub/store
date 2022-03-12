const express = require("express");
const Category = require("./../models/category");
const router = express.Router();
const viewsProductPath = "admin/product/";

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });
  res.render(viewsProductPath + "product", {
    title: "Categories",
    categories: categories,
  });
});

router.get("/new", (req, res) => {
  res.render(viewsProductPath + "new", {
    title: "Add new Drink",
    category: new Category(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render(viewsProductPath + "edit", {
    title: "Edit Drink",
    category: category,
  });
});

router.post(
  "/new",
  async (req, res, next) => {
    req.category = new Category();
    next();
  },
  saveCategoryAndRedirect("new")
);

router.put(
  "/edit/:id",
  async (req, res, next) => {
    req.category = await Category.findById(req.params.id);
    next();
  },
  saveCategoryAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("./");
});

function saveCategoryAndRedirect(onErrorRender) {
  return async (req, res) => {
    let { name } = req.body;

    let category = req.product;
    category.name = name;
    try {
      await category.save();
      res.redirect("../");
    } catch (e) {
      console.log(e);
      res.render(viewsProductPath + `${onErrorRender}`, {
        title: "Products",
        product: category,
      });
    }
  };
}

module.exports = router;
