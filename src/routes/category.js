const express = require("express");
const Category = require("./../models/category");
const router = express.Router();
const currentPath = "admin/category/";
const layout = "_layouts/admin_layout";

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });
  res.render(currentPath + "category", {
    layout: layout,
    title: "Drinks Categories",
    categories: categories,
  });
});

/*router.get("/:name", async (req, res) => {
  const category = await Category.findOne({ name: req.params.name });
  if (category == null) res.redirect("/");
  res.render(currentPath + "product/product", {
    layout: layout,
    title: category.name + " drinks",
    category: category,
    products: await Product.find({ category: category.id }).sort({
      name: "desc",
    }),
  });
});*/

router.get("/new", (req, res) => {
  res.render(currentPath + "new", {
    layout: layout,
    title: "Add new Category",
    category: new Category(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render(currentPath + "edit", {
    layout: layout,
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
    console.log(req.body.name);

    let category = req.category;
    category.name = req.body.name;
    try {
      await category.save();
      res.redirect("../");
    } catch (e) {
      console.log(e);
      res.render(currentPath + `${onErrorRender}`, {
        layout: layout,
        title: "Categories",
        category: category,
      });
    }
  };
}

module.exports = router;
