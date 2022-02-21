require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

app.get("", async (req, res) => {
  res.end("Hello World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
