const { notAuthSrc } = require("./errors");

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // req.flash('danger', 'Please log in');
  console.log(notAuthSrc);
  res.status(notAuthSrc.status).redirect("/user/login");

  //res.status(notAuthSrc.status).render("index.ejs", { error: notAuthSrc });
  //res.sendStatus(401);
  //localStorage.setItem("userId", req.body.userid)
}

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    //res.status(notAuthSrc.status).render("index", { failure: notAuthSrc });
    console.log(notAuthSrc);
    res.status(notAuthSrc.status).redirect("/");
    return;
  }
  next();
}

function checkAuthAdmin(req, res, next) {
  if (req.isAuthenticated() && res.locals.user.is_admin) {
    return next();
  }
  // req.flash('danger', 'Please log in');
  console.log(notAuthSrc);
  res.status(notAuthSrc.status).redirect("/user/login");

  //res.status(notAuthSrc.status).render("index.ejs", { error: notAuthSrc });
  //res.sendStatus(401);
  //localStorage.setItem("userId", req.body.userid)
}

module.exports = {
  checkAuth,
  checkNotAuth,
  checkAuthAdmin,
};
