require("dotenv").config();
const express = require("express");
const app = express();

const port =
  process.env.NODE_ENV !== "production"
    ? process.env.LOCAL_PORT
    : process.env.PORT;

// routes
app.get("", async (req, res) => {
  res.end("Hello World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
