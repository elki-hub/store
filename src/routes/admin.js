const express = require("express");
const router = express.Router();
const ProductRouter = require("./product");
const Product = require("./../models/product");
const Category = require("./../models/category");
const currentPath = "admin/";

// router.get("/", (req, res) => {
//   res.render("admin/admin", { title: "Admin Page" });
// });

router.use("/product", ProductRouter);

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: "desc" });
  res.render("admin/admin", {
    title: "Categories",
    categories: categories,
  });
});

router.get("/:name", async (req, res) => {
  const category = await Category.findOne({ name: req.params.name });
  if (category == null) res.redirect("/");
  res.render(currentPath + "product/product", {
    title: category.name + " drinks",
    category: category,
    products: await Product.find({ category: category.id }).sort({
      name: "desc",
    }),
  });
});

router.get("/new", (req, res) => {
  res.render(currentPath + "category/new", {
    title: "Add new Category",
    category: new Category(),
  });
});

router.get("/edit/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render(currentPath + "category/edit", {
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
        title: "Categories",
        category: category,
      });
    }
  };
}

module.exports = router;
