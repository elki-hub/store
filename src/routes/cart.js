const express = require("express");
const router = express.Router();
const Product = require("../models/drink");
const { internalError, productWasNotFound } = require("../utils/errors");
const { checkAuth } = require("../utils/authorization");

router.get("/", checkAuth, async (req, res) => {
  res.render("cart", {
    title: "My Products",
    cart: req.session.cart,
  });
});

router.get("/clear", async (req, res) => {
  delete req.session.cart;
  res.redirect("/");
});

router.get("/add/:id", async (req, res) => {
  try {
    let itemId = req.params.id;
    let product = await Product.findById(req.params.id);
    if (typeof req.session.cart === "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        id: product.id,
        name: product.name,
        quantity: 1,
        price: parseFloat(product.price).toFixed(2),
        image: product.image,
      });
    } else {
      let cart = req.session.cart;
      let newItem = true;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
          cart[i].quantity++;
          newItem = false;
          break;
        }
      }
      if (newItem) {
        req.session.cart.push({
          id: product.id,
          name: product.name,
          quantity: 1,
          price: parseFloat(product.price).toFixed(2),
          image: product.image,
        });
      }
    }
    res.send(req.session.cart);
  } catch (err) {
    req.flash(
      "warning",
      `Status: ${productWasNotFound.status}! ${productWasNotFound.message}`
    );
    return res.redirect("/cart");
  }
});

router.get("/update/:id", async (req, res) => {
  let itemId = req.params.id;
  let cart = req.session.cart;
  let action = req.query.action;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === itemId) {
      switch (action) {
        case "add":
          cart[i].quantity++;
          break;
        case "remove":
          cart[i].quantity--;
          if (cart[i].quantity === 0) cart.splice(i, 1);
          break;
        case "clear":
          cart.splice(i, 1);
          if (cart.length === 0) delete req.session.cart;
          break;
        default:
          req.flash("warning", internalError.message);
          return res.redirect("/cart");
      }
      break;
    }
  }

  res.send(req.session.cart);
});

module.exports = router;
