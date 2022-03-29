const Joi = require("joi");

module.exports = {
  name: Joi.string()
    .min(2)
    .max(50)
    .regex(/^[A-Za-z]+$/)
    .required()
    .label("First name")
    .messages({
      "string.pattern.base": `First name should be alphabetic!`,
    }),
  surname: Joi.string()
    .min(2)
    .max(30)
    .regex(/^[A-Za-z]+$/)
    .required()
    .label("LastName")
    .messages({
      "string.pattern.base": `Last name should be alphabetic!`,
    }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().label("Email"),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base": `Your password should have at least one letter and one number`,
    }),
  conf_password: Joi.required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
  }),
  address: Joi.string()
    .min(20)
    .max(200)
    .regex(/^[#.0-9a-zA-Z\s,-]+$/)
    .required()
    .label("Address")
    .messages({
      "string.pattern.base": `Address can not contain $/*`,
    }),
  phone: Joi.string()
    .min(9)
    .max(12)
    .regex(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .required()
    .label("Phone number")
    .messages({
      "string.pattern.base": `Phone number can contain only numbers and country code`,
    }),
};
