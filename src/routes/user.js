const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { checkAuth, checkNotAuth } = require("../utils/middleware");

const User = require("../models/user");
const {
  checkUserRegistrationSchema,
  checkUserLoginSchema,
  checkIfEmailUnique,
} = require("../validators/user.validator");

router.get("/register", checkNotAuth, async (req, res) => {
  res.render("authorization/register", {
    title: "Create Your Account",
  });
});

router.get("/login", checkNotAuth, async (req, res) => {
  res.render("authorization/login", {
    title: "Login",
  });
});

router.post(
  "/register",
  checkNotAuth,
  checkUserRegistrationSchema,
  checkIfEmailUnique,
  async (req, res) => {
    let { name, surname, email, password, address, phone } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.collection.insertOne({
        name,
        surname,
        //is_admin: true,
        email,
        password: hashedPassword,
        address,
        phone,
      });
    } catch (err) {
      console.log(err);
    }

    res.render("authorization/login", {
      title: "Login",
      success: "You successfully created an account!",
    });
  }
);

router.post(
  "/login",
  checkNotAuth,
  checkUserLoginSchema,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

router.get("/logout", checkAuth, (req, res) => {
  req.logOut();
  //req.flash('success', "You successfully logged out")
  res.redirect("/");
});

module.exports = router;
