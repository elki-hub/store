const express = require("express");
const app = express();
const { port } = require("./config/port");
const DataBase = require("./config/database");

//connecting to database
DataBase.connect();

// routes
app.get("", async (req, res) => {
  res.end("Hello World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
