internalError = {
  message: "Internal server error",
  status: 500,
};

emailInUse = {
  message: "This e-mail is already in use",
  status: 400,
};

incorrectCredentials = {
  message: "Incorrect email or password entered. Please try again.",
  status: 403,
};

notAuthSrc = {
  message: "You are not authorized to view this page",
  status: 401,
};

noCategories = {
  message: "You do not have any categories yet. Add new category firs.",
  status: 400,
};

OrderWasNotFound = {
  message: "Order was not found!",
  status: 407,
};

productWasNotFound = {
  message: "Product was not found!",
  status: 400,
};

module.exports = {
  internalError,
  emailInUse,
  incorrectCredentials,
  notAuthSrc,
  noCategories,
  OrderWasNotFound,
  productWasNotFound,
};
