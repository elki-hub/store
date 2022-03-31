const Drinks = require("../models/drink");
let fs = require("fs-extra");
const { internalError } = require("../utils/errors");

async function getDrinksWithCategories() {
  try {
    return await Drinks.aggregate([
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

async function getDrinkWithCategoryById(id) {
  try {
    let drinks = await Drinks.aggregate([
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
    return drinks[0];
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getDrinkById(id) {
  try {
    return await Drinks.findById(id);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deleteDrink(req, res, next) {
  try {
    let drink = await Drinks.findById(req.params.id);
    if (drink.image !== undefined || drink.image !== null) {
      await fs.remove("public/images/drinks/" + drink.id + "_" + drink.image);
    }
    await Drinks.findByIdAndDelete(req.params.id);

    return next();
  } catch (e) {
    console.log(e);
    req.flash(
      "warning",
      `Status: ${internalError.status}! ${internalError.message}`
    );
    return res.redirect("/admin/drink");
  }
}

async function createNewDrink(req, res, next) {
  req.drink = new Drinks();
  return next();
}

async function editDrink(req, res, next) {
  req.drink = await getDrinkById(req.params.id);
  return next();
}

async function saveDrink(req, res, next) {
  try {
    let { name, category, country, price, degree, size, description } =
      req.body;

    let image = req.files !== null ? req.files.image.name : null;
    let drink = req.drink;
    let oldProductImage = await drink.image;

    drink.name = name;
    drink.category = category;
    drink.price = price;
    drink.country = country;
    drink.size = size;
    if (image !== null) {
      drink.image = image;
    }
    drink.degree = degree;
    drink.description = description;

    await drink.save();

    //adding photo to gallery
    if (image !== null) {
      let drinkImage = req.files.image;
      await fs.remove(
        "public/images/drinks/" + drink.id + "_" + oldProductImage
      );

      await drinkImage.mv(
        "public/images/drinks/" + drink.id + "_" + image,
        function (err) {
          if (err) {
            console.log("error adding img: " + err);
          }
        }
      );
    }

    return next();
  } catch (error) {
    console.log("error in save Drink " + error);
    req.flash(
      "warning",
      `Status: ${internalError.status}! ${internalError.message}`
    );
    return res.redirect("/admin/drink");
  }
}

module.exports = {
  getDrinksWithCategories,
  getDrinkWithCategoryById,
  getDrinkById,
  deleteDrink,
  createNewDrink,
  editDrink,
  saveDrink,
};
