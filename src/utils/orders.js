const Orders = require("../models/order");
let fs = require("fs-extra");
const { internalError } = require("../utils/errors");
const renderOnError = "admin/order/order";
const adminLayout = "_layouts/admin_layout";
const { getCategories } = require("../utils/categories");
//const { getUsers } = require("../utils/users");

async function getOrdersWithCategories() {
  //async function getOrdersWithUsers() {
  try {
    return await Orders.aggregate([
      {
        $set: {
          category: { $toObjectId: "$category" },
          //user: { $toObjectId: "$user" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",

          /*from: "users",
          localField: "user",
          foreignField: "_id",
          as: "users",*/
        },
      },
    ]);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getOrderWithCategoryById(id) {
  //async function getOrderWithUserById(id) {
  try {
    let orders = await Orders.aggregate([
      {
        $set: {
          id: { $toString: "$_id" },
          category: { $toObjectId: "$category" },
          //user: { $toObjectId: "$user" },
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

          /*from: "users",
          localField: "user",
          foreignField: "_id",
          as: "users",*/
        },
      },
    ]);
    return orders[0];
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getOrderById(id) {
  try {
    return await Orders.findById(id);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deleteOrder(req, res, next) {
  try {
    await Orders.findByIdAndDelete(req.params.id);

    return next();
  } catch (e) {
    console.log(e);
    return res.status(internalError.status).render(renderOnError, {
      error: internalError.message,
      layout: adminLayout,
      title: "Products",
      orders: await getOrdersWithCategories(),
      //orders: await getOrdersWithUsers(),
      categories: await getCategories(),
      //users: await getUsers(),
    });
  }
}

async function createNewOrder(req, res, next) {
  req.order = new Orders();
  return next();
}

async function saveOrder(req, res, next) {
  try {
    let { name, category, country, price, degree, description } = req.body;
    //let { customer, price, data, status, details, goods(prekiu sarasas) } = req.body;

    let order = req.order;
    order.name = name;
    order.category = category;
    order.price = price;
    order.country = country;
    order.degree = degree;
    order.description = description;

    /*order.customer = customer;
    order.price = price;
    order.data = data;
    order.status = status;
    order.details = details;
    order.goods = goods;*/

    await order.save();
    return next();
  } catch (error) {
    console.log("error in save Order " + error);
    return res.status(internalError.status).render(renderOnError, {
      error: internalError,
      layout: adminLayout,
      title: "Products",
      orders: await getOrdersWithCategories(),
      //orders: await getOrdersWithUsers(),
      categories: await getCategories(),
      //users: await getUsers(),
    });
  }
}

module.exports = {
  getOrdersWithCategories,
  //getOrdersWithUsers,
  getOrderWithCategoryById,
  //getOrderWithUserById
  getOrderById,
  deleteOrder,
  createNewOrder,
  saveOrder,
};
