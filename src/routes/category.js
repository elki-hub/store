const express = require("express");
const Category = require("./../models/category");
const router = express.Router();
const currentPath = "admin/category/";
const layout = "_layouts/admin_layout";
const { checkAuthAdmin } = require("../utils/authorization");

router.get("/", checkAuthAdmin, async (req, res) => {
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
  res.render(currentPath + "drink/drink", {
    layout: layout,
    title: category.name + " drinks",
    category: category,
    drinks: await Product.find({ category: category.id }).sort({
      name: "desc",
    }),
  });
});*/

router.get("/new", checkAuthAdmin, (req, res) => {
  res.render(currentPath + "new", {
    layout: layout,
    title: "Add new Category",
    category: new Category(),
  });
});

router.get("/edit/:id", checkAuthAdmin, async (req, res) => {
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
  saveCategoryAndRedirect()
);

router.put("/edit/:id", async (req, res) => {
  try {
    await updateCategory(req.params.id, req.body.name);
  } catch (error) {
    req.flash("warning", error.toString().split(`:`)[2] + "!");
    return res.redirect("./");
  }
  res.redirect("/admin/category");
});

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.send("success");
});

async function updateCategory(categoryId, categoryName) {
  // let slug = categoryName.replace(/\s+/g, "-").toLowerCase();
  let category = await Category.findById(categoryId);
  category.name = categoryName;
  await category.save();
}

function saveCategoryAndRedirect() {
  return async (req, res) => {
    let categoryName = req.body.name;
    let slug = categoryName.replace(/\s+/g, "-").toLowerCase();

    try {
      let category = req.category;
      category.name = categoryName;
      category.slug = slug;

      await category.save();
      res.redirect("../");
    } catch (error) {
      req.flash("warning", error.toString().split(`:`)[2] + "!");
      return res.redirect("./");
    }
  };
}

module.exports = router;
