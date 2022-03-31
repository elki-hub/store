const { notAuthSrc } = require("./errors");

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("warning", `Login to view this page`);
  res.status(notAuthSrc.status).redirect("/user/login");
}

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("danger", `Status: ${notAuthSrc.status}! ${notAuthSrc.message}`);
    res.redirect("/");
    return;
  }
  next();
}

function checkAuthAdmin(req, res, next) {
  console.log(res.locals);
  if (req.isAuthenticated() && res.locals.user.is_admin) {
    return next();
  }
  req.flash("danger", `Status: ${notAuthSrc.status}! ${notAuthSrc.message}`);
  res.redirect("/user/login");
}

module.exports = {
  checkAuth,
  checkNotAuth,
  checkAuthAdmin,
};
