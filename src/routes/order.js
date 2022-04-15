const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const country = require("country-list-js");
const viewsOrderPath = "admin/order/";
const adminLayout = "_layouts/admin_layout";
const { noCategories, productWasNotFound } = require("../utils/errors");
//const { noUsers, productWasNotFound } = require("../utils/errors");
const {
  getOrdersWithCategories,
  //getOrdersWithUsers,
  getOrderWithCategoryById,
  //getOrderWithUserById,
  deleteOrder,
  createNewOrder,
  saveOrder,
} = require("../utils/orders");
const { getCategories } = require("../utils/categories");
//const { getUsers } = require("../utils/users");

router.get("/", async (req, res) => {
  res.render(viewsOrderPath + "order", {
    layout: adminLayout,
    title: "Orders",
    orders: await getOrdersWithCategories(),
    //orders: await getOrdersWithUsers(),
  });
});

router.get("/new", async (req, res) => {
  const categories = await getCategories();
  //const users = await getUsers();

  if (categories === undefined) {
    //if (users === undefined) {
    return res.status(noCategories.status).render(viewsOrderPath + "order", {
      //return res.status(noUsers.status).render(viewsOrderPath + "order", {
      failure: noCategories.message,
      layout: adminLayout,
      title: "Orders",
      orders: await getOrdersWithCategories(),
      //orders: await getOrdersWithUsers(),
    });
  }
  res.render(viewsOrderPath + "new", {
    layout: adminLayout,
    title: "Add new Order",
    categories: categories,
    //users: users,
    order: new Order(),
    countries: country.names().sort(),
  });
});

router.get("/:id", async (req, res) => {
  const order = await getOrderWithCategoryById(req.params.id);
  //const order = await getOrderWithUserById(req.params.id);

  if (order === undefined) {
    return res
      .status(productWasNotFound.status)
      .render(viewsOrderPath + "order", {
        failure: productWasNotFound.message,
        layout: adminLayout,
        title: "Orders",
        orders: await getOrdersWithCategories(),
        //orders: await getOrdersWithUsers(),
        categories: await getCategories(),
        //users: await getUsers(),
      });
  }

  res.render(viewsOrderPath + "show", {
    layout: adminLayout,
    title: "View Order",
    order: order,
  });
});

router.post("/new", createNewOrder, saveOrder, async (req, res, next) => {
  res.render(viewsOrderPath + "order", {
    success: "New order was added",
    layout: adminLayout,
    title: "Orders",
    orders: await getOrdersWithCategories(),
    //orders: await getOrdersWithUsers(),
  });
});

router.delete("/:id", deleteOrder, async (req, res) => {
  res.send("success");
});

module.exports = router;
