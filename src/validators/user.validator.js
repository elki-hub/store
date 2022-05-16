const Joi = require("joi");
const Users = require("../models/user");
const {
  name,
  surname,
  birthday,
  email,
  address,
  phone,
  password,
  new_password,
  conf_password,
} = require("./userRules");

async function checkUserRegistrationSchema(req, res, next) {
  try {
    await Joi.object({
      name,
      surname,
      birthday,
      email,
      address,
      phone,
      new_password,
      conf_password,
    }).validateAsync(req.body);
  } catch (err) {
    req.flash("danger", err.message.split(`"`).join(``) + "!");
    return res.redirect("/user/register");
  }
  return next();
}

async function checkUserSchema(req, res, next) {
  try {
    await Joi.object({
      password,
      new_password,
      conf_password,
    }).validateAsync(req.body);
  } catch (err) {
    req.flash("danger", err.message.split(`"`).join(``) + "!");
    return res.redirect("/user");
  }
  return next();
}

async function checkUserLoginSchema(req, res, next) {
  try {
    await Joi.object({
      email,
      password,
    }).validateAsync(req.body);
  } catch (err) {
    req.flash("danger", err.message.split(`"`).join(``) + "!");
    return res.redirect("/user/login");
  }
  return next();
}

async function checkIfEmailUnique(req, res, next) {
  let user = await Users.collection.findOne({ email: { $eq: req.body.email } });
  if (user) {
    req.flash("warning", "Email is already in use!");
    return res.redirect("/user/register");
  }
  return next();
}

async function checkIfAdult(req, res, next) {
  const age = 20;
  const adulthoodDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - age)
  );
  const birthday = new Date(req.body.birthday);
  if (birthday > adulthoodDate) {
    req.flash(
      "warning",
      "You have to be at least " + age + " years old to register"
    );
    return res.redirect("/user/register");
  }
  return next();
}

module.exports = {
  checkUserSchema,
  checkUserRegistrationSchema,
  checkIfEmailUnique,
  checkUserLoginSchema,
  checkIfAdult,
};
