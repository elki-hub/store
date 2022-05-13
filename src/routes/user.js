const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { checkAuth, checkNotAuth } = require("../utils/authorization");

const User = require("../models/user");
const {
  checkUserRegistrationSchema,
  checkUserLoginSchema,
  checkIfEmailUnique,
  checkUserSchema,
} = require("../validators/user.validator");
const { deleteDrink } = require("../utils/drinks");
const Category = require("../models/category");

router.get("/", checkAuth, async (req, res) => {
  res.render("user", {
    title: "Profile details",
  });
});

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

router.put("/", checkAuth, checkUserSchema, async (req, res) => {
  let { password, new_password } = req.body;

  if (!(await bcrypt.compare(password, req.user.password))) {
    return res.render("user", {
      title: "Profile details",
      failure: "Incorrect old password!",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    let user = await User.findOne({ email: req.user.email });
    user.password = hashedPassword;

    await user.save();
  } catch (err) {
    console.log(err);
  }

  req.flash("success", "Password was changed!");
  return res.redirect("/user");
});

router.post(
  "/register",
  checkNotAuth,
  checkUserRegistrationSchema,
  checkIfEmailUnique,
  async (req, res) => {
    let { name, surname, birthday, email, new_password, address, phone } =
      req.body;

    try {
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await User.collection.insertOne({
        name,
        surname,
        birthday,
        //is_admin: true,
        email,
        password: hashedPassword,
        address,
        phone,
      });
    } catch (err) {
      console.log(err);
      req.flash("warning", "Some issues in the server!");
      return res.redirect("/user/register");
    }

    req.flash("success", "You successfully created an account!");
    return res.redirect("/user/login");
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
  res.redirect("/");
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  req.flash("success", "You deleted your account!");
  res.redirect("/");
});

module.exports = router;
