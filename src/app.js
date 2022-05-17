const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const { port } = require("./config/port");
const DataBase = require("./config/database");
const Router = require("./routes/index");
const path = require("path");
let fileUpload = require("express-fileupload");
const session = require("express-session");

const passport = require("passport");
const { internalError, noCategories } = require("./utils/errors");

// //Express middleware message
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  res.locals.url = req.originalUrl;
  next();
});

//passport config
const initializePassport = require("./config/passportConfig");
initializePassport(passport);

app.use(
  session({
    secret: "secret",
    //resave: true,
    saveUninitialized: true,
    //store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals for 1 day (1day, 24h, 60min, 60s)
    },
  })
); //

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connecting to database
DataBase.connect();

//File upload
app.use(fileUpload());

//View engine setup
app.set("layout", path.join(__dirname, "../public/views/_layouts/layout"));
app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false })); //body parser that parses only JSON
app.use(express.static(path.join(__dirname, "../public"))); //to serve static js/css files
app.use(expressLayouts);
app.use(methodOverride("_method")); //for delete and put

app.get("*", function async(req, res, next) {
  res.locals.cart = req.session.cart;
  //res.locals.user = req.user === true ? req.user : null;
  res.locals.user = req.user || null;
  next();
});

app.use("/", Router);

app.use((err, req, res, next) => {
  console.error(err.stack);

  req.flash(
    "warning",
    `Status: ${internalError.status}! ${internalError.message}`
  );
  return res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
