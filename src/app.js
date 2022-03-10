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
app.set("layout", path.join(__dirname, "../views/layout"));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(express.urlencoded({ extended: false })); //body parser that parses only JSON
app.use(methodOverride("_method")); //for delete and put
app.use("/", Router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
