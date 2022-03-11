const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const { port } = require("./config/port");
const DataBase = require("./config/database");
const Router = require("./routes/index");
const path = require("path");

//connecting to database
DataBase.connect();

// routes
// app.set("layout", path.join(__dirname, "/public/views/layout"));
// app.set("views", path.join(__dirname, "/public/views"));
//app.use(express.static(path.join(__dirname, "/public")));

app.set("layout", path.join(__dirname, "../public/views/layout"));
app.set("views", path.join(__dirname, "../public/views"));
app.use(express.static(path.join(__dirname, "../public"))); //to serve static js/css files

app.set("view engine", "ejs");
console.log(__dirname);

app.use(expressLayouts);
app.use(express.urlencoded({ extended: false })); //body parser that parses only JSON
app.use(methodOverride("_method")); //for delete and put

try {
  app.use("/", Router);
} catch (e) {
  console.log(e);
}

app.listen(port, () => {
  //console.log(path.join(__dirname, "../public/views/layout"));
  console.log(`Server running at http://localhost:${port}/`);
});
