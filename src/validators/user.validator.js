const Joi = require("joi");
const Users = require("../models/user");
const {
  name,
  surname,
  email,
  address,
  phone,
  password,
  conf_password,
} = require("./userRules");

async function checkUserRegistrationSchema(req, res, next) {
  try {
    await Joi.object({
      name,
      surname,
      email,
      address,
      phone,
      password,
      conf_password,
    }).validateAsync(req.body);
  } catch (err) {
    //console.log(err);
    return res.render("authorization/register", {
      title: "Create Your Account",
      failure: err.message.split(`"`).join(``) + "!",
    });
  }
  return next();
}

async function checkUserLoginSchema(req, res, next) {
  try {
    await Joi.object({
      email,
      password: Joi.string().max(30).required().messages({
        "string.any": `Wrong password`,
      }),
    }).validateAsync(req.body);
  } catch (err) {
    //console.log(err);
    return res.render("authorization/login", {
      title: "Login",
      failure: err.message.split(`"`).join(``) + "!",
    });
  }
  return next();
}

async function checkIfEmailUnique(req, res, next) {
  let user = await Users.collection.findOne({ email: { $eq: req.body.email } });
  if (user) {
    return res.render("authorization/register", {
      title: "Create Your Account",
      failure: "User with this email already exist",
    });
  }
  return next();
}

module.exports = {
  checkUserRegistrationSchema,
  checkIfEmailUnique,
  checkUserLoginSchema,
};
