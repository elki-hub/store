const Product = require("../models/product");
let fs = require("fs-extra");
const { internalError } = require("../utils/errors");
const renderOnError = "admin/product/product";
const adminLayout = "_layouts/admin_layout";
const { getCategories } = require("../utils/categories");

async function getProductsWithCategories() {
  try {
    return await Product.aggregate([
      {
        $set: {
          category: { $toObjectId: "$category" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
    ]);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getProductWithCategoryById(id) {
  try {
    let products = await Product.aggregate([
      {
        $set: {
          id: { $toString: "$_id" },
          category: { $toObjectId: "$category" },
        },
      },
      {
        $match: {
          id: id,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
    ]);
    return products[0];
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getProductById(id) {
  try {
    return await Product.findById(id);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deleteProduct(req, res, next) {
  try {
    let product = await Product.findById(req.params.id);
    if (product.image !== undefined || product.image !== null) {
      await fs.remove(
        "public/images/products/" + product.id + "_" + product.image
      );
    }
    await Product.findByIdAndDelete(req.params.id);

    return next();
  } catch (e) {
    console.log(e);
    return res.status(internalError.status).render(renderOnError, {
      error: internalError.message,
      layout: adminLayout,
      title: "Products",
      products: await getProductsWithCategories(),
      categories: await getCategories(),
    });
  }
}

async function createNewProduct(req, res, next) {
  req.product = new Product();
  return next();
}

async function editProduct(req, res, next) {
  req.product = await getProductById(req.params.id);
  return next();
}

async function saveDrink(req, res, next) {
  try {
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
          if (err) {
            console.log("error adding img: " + err);
          }
        }
      );
    }

    return next();
  } catch (error) {
    console.log("error in save Drink" + error);
    return res.status(internalError.status).render(renderOnError, {
      error: internalError.message,
      layout: adminLayout,
      title: "Products",
      products: await getProductsWithCategories(),
      categories: await getCategories(),
    });
  }
}

module.exports = {
  getProductsWithCategories,
  getProductWithCategoryById,
  getProductById,
  deleteProduct,
  createNewProduct,
  editProduct,
  saveDrink,
};
