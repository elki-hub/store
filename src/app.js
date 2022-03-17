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

//connecting to database
DataBase.connect();

//File upload
app.use(fileUpload());

//Session
app.use(
  session({
    secret: "secret",
    resave: false,
    //saveUninitialized: false,
    //store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals for 1 day (1day, 24h, 60min, 60s)
    },
  })
);

//View engine setup
app.set("layout", path.join(__dirname, "../public/views/_layouts/layout"));
app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false })); //body parser that parses only JSON
app.use(express.static(path.join(__dirname, "../public"))); //to serve static js/css files
app.use(expressLayouts);
app.use(methodOverride("_method")); //for delete and put

app.use("/", Router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
