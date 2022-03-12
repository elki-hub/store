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
app.set("layout", path.join(__dirname, "../public/views/layout"));
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
